'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ChevronDown,
  Wifi,
  ShoppingCart,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Calendar,
  Download,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

// Mock transaction data
const mockTransactions = [
  {
    id: 'txn_001',
    type: 'airtime_sale' as const,
    network: 'Safaricom',
    amount: 100,
    cost: 95,
    profit: 5,
    phone: '0723123456',
    reference: 'ATL123456',
    timestamp: '2026-01-15T14:30:00',
    status: 'completed' as const,
  },
  {
    id: 'txn_002',
    type: 'airtime_sale' as const,
    network: 'Airtel',
    amount: 50,
    cost: 47,
    profit: 3,
    phone: '0712123456',
    reference: 'ATL123457',
    timestamp: '2026-01-15T13:15:00',
    status: 'completed' as const,
  },
  {
    id: 'txn_003',
    type: 'stk_payment' as const,
    description: 'Atomic Habits - Book',
    amount: 500,
    cost: 350,
    profit: 150,
    phone: '0705123456',
    reference: 'STK789012',
    timestamp: '2026-01-15T12:00:00',
    status: 'completed' as const,
  },
  {
    id: 'txn_004',
    type: 'c2b_received' as const,
    description: 'Till #567890',
    amount: 1000,
    cost: 800,
    profit: 200,
    phone: '0798123456',
    reference: 'C2B345678',
    timestamp: '2026-01-15T10:45:00',
    status: 'completed' as const,
  },
  {
    id: 'txn_005',
    type: 'airtime_sale' as const,
    network: 'Telkom',
    amount: 20,
    cost: 18.5,
    profit: 1.5,
    phone: '0741123456',
    reference: 'ATL123458',
    timestamp: '2026-01-15T09:30:00',
    status: 'pending' as const,
  },
  {
    id: 'txn_006',
    type: 'stk_payment' as const,
    description: 'Rich Dad Poor Dad',
    amount: 450,
    cost: 300,
    profit: 150,
    phone: '0728987654',
    reference: 'STK789013',
    timestamp: '2026-01-15T08:00:00',
    status: 'failed' as const,
  },
  {
    id: 'txn_007',
    type: 'airtime_sale' as const,
    network: 'Safaricom',
    amount: 250,
    cost: 238,
    profit: 12,
    phone: '0711345678',
    reference: 'ATL123459',
    timestamp: '2026-01-14T18:30:00',
    status: 'completed' as const,
  },
  {
    id: 'txn_008',
    type: 'c2b_received' as const,
    description: 'Till #567890',
    amount: 2500,
    cost: 2000,
    profit: 500,
    phone: '0700234567',
    reference: 'C2B345679',
    timestamp: '2026-01-14T16:00:00',
    status: 'completed' as const,
  },
  {
    id: 'txn_009',
    type: 'airtime_sale' as const,
    network: 'Airtel',
    amount: 100,
    cost: 93,
    profit: 7,
    phone: '0765123456',
    reference: 'ATL123460',
    timestamp: '2026-01-14T14:20:00',
    status: 'completed' as const,
  },
  {
    id: 'txn_010',
    type: 'stk_payment' as const,
    description: 'The Psychology of Money',
    amount: 600,
    cost: 420,
    profit: 180,
    phone: '0734123456',
    reference: 'STK789014',
    timestamp: '2026-01-14T11:00:00',
    status: 'completed' as const,
  },
];

type TransactionType = 'all' | 'airtime_sale' | 'stk_payment' | 'c2b_received';
type TransactionStatus = 'all' | 'completed' | 'pending' | 'failed';
type SortOrder = 'newest' | 'oldest' | 'highest' | 'lowest';

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType>('all');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null);

  // Filter and sort transactions
  const filteredTransactions = mockTransactions
    .filter((txn) => {
      if (typeFilter !== 'all' && txn.type !== typeFilter) return false;
      if (statusFilter !== 'all' && txn.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          txn.phone.includes(query) ||
          txn.reference.toLowerCase().includes(query) ||
          (txn.type === 'airtime_sale' && txn.network?.toLowerCase().includes(query)) ||
          (txn.type === 'stk_payment' && txn.description?.toLowerCase().includes(query)) ||
          txn.amount.toString().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'newest': return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest': return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'highest': return b.amount - a.amount;
        case 'lowest': return a.amount - b.amount;
        default: return 0;
      }
    });

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalProfit = filteredTransactions.reduce((sum, t) => sum + t.profit, 0);
  const completedCount = filteredTransactions.filter(t => t.status === 'completed').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'airtime_sale': return <Wifi className="w-5 h-5 text-blue-600" />;
      case 'stk_payment': return <ShoppingCart className="w-5 h-5 text-green-600" />;
      case 'c2b_received': return <CreditCard className="w-5 h-5 text-orange-600" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'airtime_sale': return 'Airtime Sale';
      case 'stk_payment': return 'STK Payment';
      case 'c2b_received': return 'C2B Received';
      default: return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'airtime_sale': return 'bg-blue-50 border-blue-200';
      case 'stk_payment': return 'bg-green-50 border-green-200';
      case 'c2b_received': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Summary Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">Transactions</p>
            <p className="text-lg font-bold text-gray-900">{filteredTransactions.length}</p>
            <p className="text-[10px] text-green-600">{completedCount} completed</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-lg font-bold text-gray-900">KES {totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Profit</p>
            <p className="text-lg font-bold text-green-600">KES {totalProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border transition-colors ${
            showFilters || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'bg-[#8B1D1D] text-white border-[#8B1D1D]'
              : 'bg-white border-gray-200 text-gray-600'
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-4">
          {/* Type Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">TYPE</label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'airtime_sale', 'stk_payment', 'c2b_received'] as TransactionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    typeFilter === type
                      ? 'bg-[#8B1D1D] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All' : getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">STATUS</label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'completed', 'pending', 'failed'] as TransactionStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-[#8B1D1D] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">SORT BY</label>
            <div className="flex flex-wrap gap-2">
              {([
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'highest', label: 'Highest Amount' },
                { value: 'lowest', label: 'Lowest Amount' },
              ] as const).map((sort) => (
                <button
                  key={sort.value}
                  onClick={() => setSortOrder(sort.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sortOrder === sort.value
                      ? 'bg-[#8B1D1D] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setTypeFilter('all');
              setStatusFilter('all');
              setSortOrder('newest');
              setSearchQuery('');
            }}
            className="w-full py-2 text-sm text-[#8B1D1D] font-medium hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredTransactions.map((txn) => (
            <button
              key={txn.id}
              onClick={() => setSelectedTransaction(txn)}
              className={`w-full text-left p-3 rounded-xl border transition-colors hover:shadow-sm ${getTypeBgColor(txn.type)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {getTypeIcon(txn.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {txn.type === 'airtime_sale' && `${txn.network} Airtime`}
                        {txn.type === 'stk_payment' && txn.description}
                        {txn.type === 'c2b_received' && txn.description}
                      </p>
                      {getStatusIcon(txn.status)}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {txn.phone} • {txn.reference}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    KES {txn.amount}
                  </p>
                  <p className="text-xs text-green-600">
                    +KES {txn.profit}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/50">
                <span className="text-[10px] text-gray-400">
                  {new Date(txn.timestamp).toLocaleDateString('en-KE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-medium">
                  {getTypeLabel(txn.type)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedTransaction(null)}
          />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Transaction Detail</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Type & Status */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  {getTypeIcon(selectedTransaction.type)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {getTypeLabel(selectedTransaction.type)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className="text-xs capitalize">{selectedTransaction.status}</span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="text-center py-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  KES {selectedTransaction.amount}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Profit: +KES {selectedTransaction.profit}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Reference</span>
                  <span className="text-sm font-medium">{selectedTransaction.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Phone</span>
                  <span className="text-sm font-medium">{selectedTransaction.phone}</span>
                </div>
                {selectedTransaction.type === 'airtime_sale' && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Network</span>
                    <span className="text-sm font-medium">{selectedTransaction.network}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Cost</span>
                  <span className="text-sm font-medium">KES {selectedTransaction.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Profit</span>
                  <span className="text-sm font-medium text-green-600">KES {selectedTransaction.profit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date & Time</span>
                  <span className="text-sm font-medium">
                    {new Date(selectedTransaction.timestamp).toLocaleDateString('en-KE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-full bg-[#8B1D1D] text-white py-3 rounded-lg font-semibold hover:bg-[#701616] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Button */}
      <button className="w-full bg-white border-2 border-[#8B1D1D] text-[#8B1D1D] py-3 rounded-lg font-semibold hover:bg-[#8B1D1D]/5 transition-colors flex items-center justify-center gap-2">
        <Download className="w-4 h-4" />
        Download Statement
      </button>
    </div>
  );
}