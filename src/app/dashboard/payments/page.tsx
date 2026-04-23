'use client';

import { useState } from 'react';
import {
  CreditCard,
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Search,
  Filter,
  X,
  Download,
  Phone,
  Calendar,
  ChevronRight,
  DollarSign,
} from 'lucide-react';

// Mock payments data
const mockPayments = {
  // STK Push transactions
  stkTransactions: [
    {
      id: 'stk_001',
      product: 'Atomic Habits',
      amount: 500,
      cost: 350,
      profit: 150,
      customerPhone: '0705123456',
      customerName: 'John M.',
      reference: 'STK789012',
      status: 'completed',
      timestamp: '2026-01-15T14:30:00',
      checkoutId: 'CO123456',
    },
    {
      id: 'stk_002',
      product: 'Rich Dad Poor Dad',
      amount: 450,
      cost: 300,
      profit: 150,
      customerPhone: '0728987654',
      customerName: 'Sarah K.',
      reference: 'STK789013',
      status: 'completed',
      timestamp: '2026-01-15T12:00:00',
      checkoutId: 'CO123457',
    },
    {
      id: 'stk_003',
      product: 'The Psychology of Money',
      amount: 600,
      cost: 420,
      profit: 180,
      customerPhone: '0734123456',
      customerName: 'Peter W.',
      reference: 'STK789014',
      status: 'pending',
      timestamp: '2026-01-15T11:30:00',
      checkoutId: 'CO123458',
    },
    {
      id: 'stk_004',
      product: 'Atomic Habits',
      amount: 500,
      cost: 350,
      profit: 150,
      customerPhone: '0712345678',
      customerName: 'Mary A.',
      reference: 'STK789015',
      status: 'failed',
      timestamp: '2026-01-15T10:00:00',
      checkoutId: 'CO123459',
    },
  ],

  // C2B payments received
  c2bTransactions: [
    {
      id: 'c2b_001',
      amount: 1000,
      cost: 800,
      profit: 200,
      customerPhone: '0798123456',
      reference: 'C2B345678',
      tillNumber: '567890',
      status: 'completed',
      timestamp: '2026-01-15T14:00:00',
    },
    {
      id: 'c2b_002',
      amount: 2500,
      cost: 2000,
      profit: 500,
      customerPhone: '0700234567',
      reference: 'C2B345679',
      tillNumber: '567890',
      status: 'completed',
      timestamp: '2026-01-14T16:00:00',
    },
  ],

  // Settlement status
  settlements: {
    today: { amount: 4500, status: 'pending' },
    yesterday: { amount: 8200, status: 'settled' },
    dayBefore: { amount: 6300, status: 'settled' },
  },

  // Customer insights
  topCustomers: [
    { name: 'John M.', phone: '0705123456', purchases: 12, totalSpent: 6500 },
    { name: 'Sarah K.', phone: '0728987654', purchases: 8, totalSpent: 4200 },
    { name: 'Peter W.', phone: '0734123456', purchases: 6, totalSpent: 3100 },
  ],

  // Product performance
  productPerformance: [
    { name: 'Atomic Habits', sales: 25, revenue: 12500, profit: 3750 },
    { name: 'Rich Dad Poor Dad', sales: 18, revenue: 8100, profit: 2700 },
    { name: 'The Psychology of Money', sales: 15, revenue: 9000, profit: 2700 },
    { name: 'Think and Grow Rich', sales: 12, revenue: 5400, profit: 1800 },
  ],
};

type PaymentFilter = 'all' | 'stk_push' | 'c2b_received';
type StatusFilter = 'all' | 'completed' | 'pending' | 'failed';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'settlements' | 'insights'>('transactions');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInitiateStk, setShowInitiateStk] = useState(false);
  const [stkPhone, setStkPhone] = useState('');
  const [stkAmount, setStkAmount] = useState('');

  // Combine all transactions
  const allTransactions = [
    ...mockPayments.stkTransactions.map(t => ({ ...t, type: 'stk_push' as const })),
    ...mockPayments.c2bTransactions.map(t => ({ ...t, type: 'c2b_received' as const })),
  ];

  const filteredTransactions = allTransactions.filter(txn => {
    if (paymentFilter !== 'all' && txn.type !== paymentFilter) return false;
    if (statusFilter !== 'all' && txn.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        txn.customerPhone.includes(query) ||
        txn.reference.toLowerCase().includes(query) ||
        ('product' in txn && txn.product?.toLowerCase().includes(query)) ||
        txn.amount.toString().includes(query)
      );
    }
    return true;
  });

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalProfit = filteredTransactions.reduce((sum, t) => sum + t.profit, 0);
  const totalTransactions = filteredTransactions.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'settled': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleInitiateStk = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Initiating STK Push:', { phone: stkPhone, amount: stkAmount });
    setShowInitiateStk(false);
    setStkPhone('');
    setStkAmount('');
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Tab Switcher */}
      <div className="flex bg-white rounded-xl p-1 border border-gray-200">
        {([
          { key: 'transactions', label: 'Transactions' },
          { key: 'settlements', label: 'Settlements' },
          { key: 'insights', label: 'Insights' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-[#8B1D1D] text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <p className="text-[10px] text-gray-500">Revenue</p>
              <p className="text-lg font-bold text-gray-900">KES {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <p className="text-[10px] text-gray-500">Profit</p>
              <p className="text-lg font-bold text-green-600">KES {totalProfit.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <p className="text-[10px] text-gray-500">Count</p>
              <p className="text-lg font-bold text-gray-900">{totalTransactions}</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by phone, reference..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'stk_push', 'c2b_received'] as PaymentFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setPaymentFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  paymentFilter === filter
                    ? 'bg-[#8B1D1D] text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'stk_push' ? 'STK Push' : 'C2B'}
              </button>
            ))}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Transaction List */}
          <div className="space-y-2">
            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.type === 'stk_push' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {txn.type === 'stk_push' ? (
                        <ShoppingCart className="w-5 h-5 text-green-600" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {'product' in txn ? txn.product : `Till #${txn.tillNumber}`}
                        </p>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(txn.status)}`}>
                          {txn.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {txn.customerPhone} • {txn.reference}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">KES {txn.amount}</p>
                    <p className="text-xs text-green-600">
                      Profit: KES {txn.profit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-xs text-gray-400">
                    {new Date(txn.timestamp).toLocaleDateString('en-KE', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase">
                    {txn.type === 'stk_push' ? 'STK Push' : 'C2B Received'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Initiate STK Push Button */}
          <button
            onClick={() => setShowInitiateStk(true)}
            className="w-full bg-[#8B1D1D] text-white py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Initiate STK Push
          </button>
        </>
      )}

      {/* SETTLEMENTS TAB */}
      {activeTab === 'settlements' && (
        <>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Settlement Status</h3>
            
            <div className="space-y-4">
              {Object.entries(mockPayments.settlements).map(([key, settlement]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      settlement.status === 'settled' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {settlement.status === 'settled' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {key === 'today' ? 'Today' : key === 'yesterday' ? 'Yesterday' : 'Day Before'}
                      </p>
                      <p className="text-xs text-gray-500">
                        KES {settlement.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(settlement.status)}`}>
                    {settlement.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Settlement Summary */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Reconciliation Status</h3>
            </div>
            <p className="text-sm text-green-800">
              All settlements are matching. No discrepancies found.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-green-600">Settled This Week</p>
                <p className="text-lg font-bold text-green-900">KES 19,000</p>
              </div>
              <div>
                <p className="text-xs text-green-600">Pending</p>
                <p className="text-lg font-bold text-yellow-600">KES 4,500</p>
              </div>
            </div>
          </div>

          {/* Download Report */}
          <button className="w-full bg-white border-2 border-[#8B1D1D] text-[#8B1D1D] py-3 rounded-lg font-semibold hover:bg-[#8B1D1D]/5 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download Settlement Report
          </button>
        </>
      )}

      {/* INSIGHTS TAB */}
      {activeTab === 'insights' && (
        <>
          {/* Top Customers */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Top Customers</h3>
            <div className="space-y-3">
              {mockPayments.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8B1D1D]/10 rounded-full flex items-center justify-center">
                      <span className="text-[#8B1D1D] font-bold">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {customer.purchases} orders
                    </p>
                    <p className="text-xs text-green-600">
                      KES {customer.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Performance */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Product Performance</h3>
            <div className="space-y-3">
              {mockPayments.productPerformance.map((product, index) => (
                <div key={index} className="p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{product.name}</span>
                    <span className="text-xs text-gray-500">{product.sales} sold</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Revenue: KES {product.revenue.toLocaleString()}
                    </span>
                    <span className="text-green-600 font-medium">
                      Profit: KES {product.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-[#8B1D1D] h-1.5 rounded-full"
                      style={{ 
                        width: `${(product.revenue / mockPayments.productPerformance[0].revenue) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Abandonment */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Cart Abandonment</h3>
            </div>
            <p className="text-sm text-yellow-800 mb-3">
              8 customers initiated STK Push but didn't complete payment this week.
            </p>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Potential lost revenue</p>
              <p className="text-lg font-bold text-yellow-600">KES 3,200</p>
            </div>
          </div>
        </>
      )}

      {/* STK Push Modal */}
      {showInitiateStk && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowInitiateStk(false)}
          />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Initiate STK Push</h3>
              <button
                onClick={() => setShowInitiateStk(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateStk} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CUSTOMER PHONE:
                </label>
                <input
                  type="tel"
                  value={stkPhone}
                  onChange={(e) => setStkPhone(e.target.value)}
                  required
                  placeholder="+254 712 345 678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                />
                <p className="text-xs text-gray-500 mt-1">M-Pesa registered number</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  AMOUNT (KES):
                </label>
                <input
                  type="number"
                  value={stkAmount}
                  onChange={(e) => setStkAmount(e.target.value)}
                  required
                  placeholder="500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B1D1D] text-white py-3 rounded-lg font-semibold hover:bg-[#701616] transition-colors"
              >
                Send Payment Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}