'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Wifi,
  CreditCard,
  Download,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { api } from '../../../lib/api';

// ============================================================================
// TYPES
// ============================================================================
interface Transaction {
  id: string;
  name: string;
  phone: string;
  amount: number;
  status: string;
  profit: number;
  timestamp: string;
  provider: string;
  mpesaReceipt: string;
  balance: string;
  source: string;
  failReason?: string;
  failCode?: string;
}

type StatusFilter = 'all' | 'delivered' | 'failed' | 'completed' | 'processing';
type SortOrder = 'newest' | 'oldest' | 'highest' | 'lowest';

// ============================================================================
// HELPERS
// ============================================================================
const maskPhone = (phone: string) => {
  if (!phone) return 'xxxxxxxx';
  const clean = phone.replace('254', '0');
  if (clean.length >= 10) return clean.slice(0, 4) + 'xxxx' + clean.slice(-2);
  return clean;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-KE', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
};

const formatCurrency = (amount: number) => {
  return `KES ${amount.toLocaleString()}`;
};

// ============================================================================
// COMPONENT
// ============================================================================
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const itemsPerPage = 20;

  // Fetch ALL transactions on mount
  useEffect(() => { 
    loadAllTransactions(); 
  }, []);

  const loadAllTransactions = async () => {
    setLoading(true);
    try {
      // Fetch all transactions without limit
      const data = await api.getTransactions({ limit: 1000 });
      
      if (data?.transactions) {
        setAllTransactions(data.transactions);
        setTransactions(data.transactions);
      } else if (Array.isArray(data)) {
        setAllTransactions(data);
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort transactions
  const filteredTransactions = allTransactions
    .filter(txn => {
      // Status filter
      if (statusFilter !== 'all' && txn.status !== statusFilter) return false;
      
      // Date range filter
      if (dateRange.start) {
        const txnDate = new Date(txn.timestamp).toISOString().split('T')[0];
        if (txnDate < dateRange.start) return false;
      }
      if (dateRange.end) {
        const txnDate = new Date(txn.timestamp).toISOString().split('T')[0];
        if (txnDate > dateRange.end) return false;
      }
      
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          txn.name?.toLowerCase().includes(q) ||
          txn.phone?.includes(q) ||
          txn.mpesaReceipt?.toLowerCase().includes(q) ||
          txn.id?.toLowerCase().includes(q) ||
          txn.amount?.toString().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'newest': 
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest': 
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'highest': 
          return b.amount - a.amount;
        case 'lowest': 
          return a.amount - b.amount;
        default: 
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalProfit = filteredTransactions.reduce((sum, t) => sum + (t.profit || 0), 0);
  const completedCount = filteredTransactions.filter(t => t.status === 'delivered' || t.status === 'completed').length;
  const failedCount = filteredTransactions.filter(t => t.status === 'failed').length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered': 
      case 'completed': 
        return { bg: 'bg-green-100', text: 'text-green-600', icon: CheckCircle, label: 'Success' };
      case 'failed': 
        return { bg: 'bg-red-100', text: 'text-red-600', icon: AlertCircle, label: 'Failed' };
      case 'processing': 
        return { bg: 'bg-amber-100', text: 'text-amber-600', icon: Clock, label: 'Processing' };
      default: 
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: Clock, label: status };
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSortOrder('newest');
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Transaction ID', 'Customer Name', 'Phone', 'Amount', 'Profit', 'Status', 'Receipt'];
    const csvData = filteredTransactions.map(txn => [
      formatDate(txn.timestamp),
      txn.id,
      txn.name || 'Customer',
      txn.phone,
      txn.amount,
      txn.profit || 0,
      txn.status,
      txn.mpesaReceipt || ''
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#8B1D1D] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-sm text-gray-500 mt-1">View all your transactions</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B1D1D] text-white rounded-xl text-sm font-semibold hover:bg-[#701616] transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Transactions</p>
          <p className="text-xl font-bold text-gray-900">{filteredTransactions.length}</p>
          <p className="text-xs text-green-600 mt-1">{completedCount} completed</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Profit</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalProfit)}</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Failed</p>
          <p className="text-xl font-bold text-red-600">{failedCount}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, phone, receipt, or ID..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border transition-colors ${
              showFilters || statusFilter !== 'all' || dateRange.start || dateRange.end 
                ? 'bg-[#8B1D1D] text-white border-[#8B1D1D]' 
                : 'bg-white border-gray-200 text-gray-600'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">STATUS</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'delivered', 'failed', 'processing'] as StatusFilter[]).map(s => (
                  <button 
                    key={s} 
                    onClick={() => {
                      setStatusFilter(s);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                      statusFilter === s ? 'bg-[#8B1D1D] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">SORT BY</label>
              <div className="flex flex-wrap gap-2">
                {(['newest', 'oldest', 'highest', 'lowest'] as SortOrder[]).map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSortOrder(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                      sortOrder === s ? 'bg-[#8B1D1D] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">DATE RANGE</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, start: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, end: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="End Date"
                />
              </div>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full py-2 text-sm text-[#8B1D1D] font-medium hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {paginatedTransactions.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          paginatedTransactions.map((txn) => {
            const style = getStatusStyle(txn.status);
            const Icon = style.icon;
            return (
              <button 
                key={txn.id} 
                onClick={() => setSelectedTransaction(txn)}
                className="w-full text-left p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${style.bg} rounded-full flex items-center justify-center shrink-0`}>
                      {typeof Icon === 'function' && <Icon className={`w-5 h-5 ${style.text}`} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{txn.name || 'Customer'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        📱 {maskPhone(txn.phone)} • {txn.mpesaReceipt?.slice(0, 10) || txn.id?.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">{formatCurrency(txn.amount)}</p>
                    {txn.profit > 0 && (
                      <p className="text-xs text-green-600">+{formatCurrency(txn.profit)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{formatTimeAgo(txn.timestamp)}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100">
          <p className="text-xs text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTransaction(null)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
              <button onClick={() => setSelectedTransaction(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="text-center py-5 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(selectedTransaction.amount)}</p>
                {selectedTransaction.profit > 0 && (
                  <p className="text-sm text-green-600 mt-2">Profit: +{formatCurrency(selectedTransaction.profit)}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Transaction ID</span>
                  <span className="text-sm font-mono font-medium text-gray-900">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Customer</span>
                  <span className="text-sm font-medium text-gray-900">{selectedTransaction.name || 'Customer'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Phone</span>
                  <span className="text-sm font-medium text-gray-900">{maskPhone(selectedTransaction.phone)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Receipt</span>
                  <span className="text-sm font-mono font-medium text-gray-900">{selectedTransaction.mpesaReceipt || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`text-sm font-semibold ${getStatusStyle(selectedTransaction.status).text}`}>
                    {getStatusStyle(selectedTransaction.status).label}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Date & Time</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(selectedTransaction.timestamp)}</span>
                </div>
                {selectedTransaction.failReason && (
                  <div className="py-2">
                    <span className="text-sm text-gray-500 block mb-2">Failure Reason</span>
                    <div className="bg-red-50 rounded-xl p-3">
                      <p className="text-sm text-red-700">{selectedTransaction.failReason}</p>
                      {selectedTransaction.failCode && (
                        <p className="text-xs text-red-500 mt-1">Code: {selectedTransaction.failCode}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setSelectedTransaction(null)} 
                className="w-full bg-[#8B1D1D] text-white py-3 rounded-xl font-semibold hover:bg-[#701616] transition-colors mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}