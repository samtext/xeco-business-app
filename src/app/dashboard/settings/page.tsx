'use client';

import { useState } from 'react';
import {
  Store,
  CreditCard,
  Bell,
  Shield,
  Smartphone,
  Globe,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  Edit3,
  Phone,
  Save,
  AlertTriangle,
} from 'lucide-react';

// Mock settings data
const mockSettings = {
  business: {
    businessName: 'Kimani Bookstore',
    businessType: 'Retail - Books',
    businessEmail: 'isaac@kimanibooks.com',
    businessPhone: '+254 712 345 678',
    location: 'Nairobi CBD, Moi Avenue',
  },
  tills: [
    { id: 'till_1', number: '567890', name: 'Main Store Till', type: 'Buy Goods', isActive: true },
    { id: 'till_2', number: '567891', name: 'Online Orders', type: 'Pay Bill', isActive: true },
    { id: 'till_3', number: '567892', name: 'Wholesale', type: 'Buy Goods', isActive: false },
  ],
  notifications: {
    transactionAlerts: true,
    lowStockAlerts: true,
    settlementAlerts: true,
    marketingEmails: false,
    dailyReport: true,
    weeklyReport: true,
  },
  security: {
    pinEnabled: true,
    biometricEnabled: false,
    twoFactorEnabled: false,
    lastPasswordChange: '2026-01-01',
    loginSessions: 2,
  },
  apiKeys: [
    { id: 'key_1', name: 'Daraja API', key: 'sk_live_xxxxxxxxxxxxx1234', created: '2025-06-15' },
    { id: 'key_2', name: 'Webhook Endpoint', key: 'wh_xxxxxxxxxxxxx5678', created: '2025-08-20' },
  ],
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [settings, setSettings] = useState(mockSettings);
  const [showAddTill, setShowAddTill] = useState(false);
  const [newTillNumber, setNewTillNumber] = useState('');
  const [newTillName, setNewTillName] = useState('');
  const [newTillType, setNewTillType] = useState('Buy Goods');

  const handleToggle = (key: keyof typeof settings.notifications) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const handleToggleTill = (tillId: string) => {
    setSettings({
      ...settings,
      tills: settings.tills.map(till =>
        till.id === tillId ? { ...till, isActive: !till.isActive } : till
      ),
    });
  };

  const handleAddTill = (e: React.FormEvent) => {
    e.preventDefault();
    const newTill = {
      id: `till_${Date.now()}`,
      number: newTillNumber,
      name: newTillName,
      type: newTillType,
      isActive: true,
    };
    setSettings({
      ...settings,
      tills: [...settings.tills, newTill],
    });
    setShowAddTill(false);
    setNewTillNumber('');
    setNewTillName('');
  };

  const handleDeleteTill = (tillId: string) => {
    setSettings({
      ...settings,
      tills: settings.tills.filter(till => till.id !== tillId),
    });
  };

  const sections = [
    {
      id: 'business',
      icon: Store,
      label: 'Business Profile',
      description: 'Business name, contact & location',
    },
    {
      id: 'tills',
      icon: CreditCard,
      label: 'M-Pesa Tills',
      description: `${settings.tills.filter(t => t.isActive).length} active tills`,
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      description: 'Alerts, reports & preferences',
    },
    {
      id: 'security',
      icon: Shield,
      label: 'Security',
      description: 'PIN, biometrics & sessions',
    },
    {
      id: 'api',
      icon: Globe,
      label: 'API & Webhooks',
      description: 'Daraja integration keys',
    },
  ];

  return (
    <div className="p-4 space-y-4">
      
      {/* Settings Menu */}
      {!activeSection ? (
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-[#8B1D1D] transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{section.label}</p>
                      <p className="text-xs text-gray-500">{section.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            );
          })}

          {/* Danger Zone */}
          <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h3 className="font-semibold text-red-900">Danger Zone</h3>
            </div>
            <p className="text-xs text-red-700 mb-3">
              Permanently delete your business account and all associated data.
            </p>
            <button className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors">
              Delete Business Account
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Back Button */}
          <button
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-2 text-sm text-[#8B1D1D] font-medium hover:underline"
          >
            ← Back to Settings
          </button>

          {/* BUSINESS PROFILE */}
          {activeSection === 'business' && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Business Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">BUSINESS NAME</label>
                  <input
                    type="text"
                    defaultValue={settings.business.businessName}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">BUSINESS TYPE</label>
                  <select
                    defaultValue={settings.business.businessType}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  >
                    <option>Retail</option>
                    <option>Airtime Vendor</option>
                    <option>Service Provider</option>
                    <option>Restaurant</option>
                    <option>Wholesale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL</label>
                  <input
                    type="email"
                    defaultValue={settings.business.businessEmail}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">PHONE</label>
                  <input
                    type="tel"
                    defaultValue={settings.business.businessPhone}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">LOCATION</label>
                  <input
                    type="text"
                    defaultValue={settings.business.location}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                </div>
                <button className="w-full bg-[#8B1D1D] text-white py-3 rounded-lg font-semibold hover:bg-[#701616] transition-colors flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TILLS MANAGEMENT */}
          {activeSection === 'tills' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">M-Pesa Tills</h3>
                <div className="space-y-3">
                  {settings.tills.map((till) => (
                    <div
                      key={till.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        till.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          till.isActive ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          <Phone className={`w-5 h-5 ${
                            till.isActive ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{till.name}</p>
                          <p className="text-xs text-gray-500">
                            {till.number} • {till.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleTill(till.id)}
                          className={`p-1 rounded-lg transition-colors ${
                            till.isActive ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          {till.isActive ? (
                            <ToggleRight className="w-6 h-6" />
                          ) : (
                            <ToggleLeft className="w-6 h-6" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteTill(till.id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddTill(true)}
                  className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#8B1D1D] hover:text-[#8B1D1D] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Till
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {key === 'transactionAlerts' && 'Get notified for every transaction'}
                        {key === 'lowStockAlerts' && 'Alert when stock is running low'}
                        {key === 'settlementAlerts' && 'Daily settlement confirmations'}
                        {key === 'marketingEmails' && 'Promotional offers and updates'}
                        {key === 'dailyReport' && 'End of day summary report'}
                        {key === 'weeklyReport' && 'Weekly performance report'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle(key as keyof typeof settings.notifications)}
                      className={value ? 'text-green-600' : 'text-gray-300'}
                    >
                      {value ? (
                        <ToggleRight className="w-8 h-8" />
                      ) : (
                        <ToggleLeft className="w-8 h-8" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeSection === 'security' && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">App PIN</p>
                    <p className="text-xs text-gray-500">Required to access dashboard</p>
                  </div>
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Biometric Login</p>
                    <p className="text-xs text-gray-500">Use fingerprint to verify</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Disabled</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Auth</p>
                    <p className="text-xs text-gray-500">Extra security layer</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Disabled</span>
                </div>
                <div className="py-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Last password change: {settings.security.lastPasswordChange}</p>
                  <button className="text-sm text-[#8B1D1D] font-medium mt-1 hover:underline">
                    Change Password
                  </button>
                </div>
                <div className="py-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Active sessions: {settings.security.loginSessions}</p>
                  <button className="text-sm text-red-600 font-medium mt-1 hover:underline">
                    Sign out all devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API & WEBHOOKS */}
          {activeSection === 'api' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">API Keys</h3>
                <div className="space-y-3">
                  {settings.apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{apiKey.name}</p>
                        <span className="text-xs text-gray-400">
                          Created: {new Date(apiKey.created).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                        {apiKey.key}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs text-[#8B1D1D] font-medium hover:underline">Copy</button>
                        <button className="text-xs text-red-600 font-medium hover:underline">Revoke</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#8B1D1D] hover:text-[#8B1D1D] transition-colors font-medium text-sm">
                  + Generate New API Key
                </button>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Webhook Configuration</h4>
                <p className="text-xs text-blue-700 mb-2">
                  XecoFlow sends real-time transaction updates via Daraja C2B callbacks.
                </p>
                <div className="bg-white rounded p-2">
                  <p className="text-xs font-mono text-gray-600">
                    https://api.xecoflow.com/webhook/daraja
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Till Modal */}
      {showAddTill && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAddTill(false)}
          />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add M-Pesa Till</h3>
            
            <form onSubmit={handleAddTill} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">TILL NUMBER:</label>
                <input
                  type="text"
                  value={newTillNumber}
                  onChange={(e) => setNewTillNumber(e.target.value)}
                  required
                  placeholder="e.g., 567890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">TILL NAME:</label>
                <input
                  type="text"
                  value={newTillName}
                  onChange={(e) => setNewTillName(e.target.value)}
                  required
                  placeholder="e.g., Main Store Till"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">TILL TYPE:</label>
                <select
                  value={newTillType}
                  onChange={(e) => setNewTillType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                >
                  <option>Buy Goods</option>
                  <option>Pay Bill</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#8B1D1D] text-white py-3 rounded-lg font-semibold hover:bg-[#701616] transition-colors"
              >
                Add Till
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}