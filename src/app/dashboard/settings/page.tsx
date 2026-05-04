'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // ✅ ADD THIS IMPORT
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
  Loader2,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://xecoflow.onrender.com';

interface MerchantData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  serviceType: string;
  tillNumber: string;
  isActive: boolean;
  createdAt: string;
}

export default function SettingsPage() {
  const router = useRouter();  // ✅ ADD THIS LINE
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<MerchantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [formData, setFormData] = useState<Partial<MerchantData>>({});

  useEffect(() => {
    fetchMerchantData();
  }, []);

  const fetchMerchantData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/merchant/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        const d = data.data;
        const merchantData: MerchantData = {
          id: d.id || d.user_id || '',
          fullName: d.full_name || d.fullName || '',
          email: d.email || '',
          phone: d.phone || d.phoneNumber || '',
          businessName: d.business_name || d.businessName || '',
          serviceType: d.service_type || d.serviceType || 'AIRTIME_AUTOMATION',
          tillNumber: d.pin_code || d.tillNumber || '',
          isActive: d.is_active ?? true,
          createdAt: d.created_at || d.createdAt || '',
        };
        setMerchant(merchantData);
        setFormData(merchantData);
      }
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      setErrorMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBusiness = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_URL}/api/v1/merchant/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          businessName: formData.businessName,
          phone: formData.phone,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Business profile updated successfully!');
        setEditingBusiness(false);
        fetchMerchantData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(data.message || 'Update failed');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      id: 'business',
      icon: Store,
      label: 'Business Profile',
      description: 'Business name, contact & till number',
    },
    {
      id: 'security',
      icon: Shield,
      label: 'Security',
      description: 'Password & security settings',
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      description: 'Manage alert preferences',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#8B1D1D] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

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
          {activeSection === 'business' && merchant && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Business Profile</h3>
                {!editingBusiness && (
                  <button
                    onClick={() => setEditingBusiness(true)}
                    className="text-sm text-[#8B1D1D] font-medium flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                )}
              </div>
              
              {editingBusiness ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">FULL NAME</label>
                    <input
                      type="text"
                      value={formData.fullName || ''}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">BUSINESS NAME</label>
                    <input
                      type="text"
                      value={formData.businessName || ''}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">PHONE NUMBER</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL</label>
                    <input
                      type="email"
                      value={merchant.email}
                      disabled
                      className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">TILL NUMBER (PIN CODE)</label>
                    <input
                      type="text"
                      value={merchant.tillNumber}
                      disabled
                      className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 font-mono"
                    />
                    <p className="text-xs text-gray-400 mt-1">Till number is system assigned and cannot be changed</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleUpdateBusiness}
                      disabled={saving}
                      className="flex-1 bg-[#8B1D1D] text-white py-2.5 rounded-lg font-semibold hover:bg-[#701616] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingBusiness(false);
                        setFormData(merchant);
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Full Name</span>
                    <span className="text-sm font-medium text-gray-900">{merchant.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Business Name</span>
                    <span className="text-sm font-medium text-gray-900">{merchant.businessName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Phone Number</span>
                    <span className="text-sm font-medium text-gray-900">{merchant.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-medium text-gray-900">{merchant.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Till Number</span>
                    <span className="text-sm font-mono font-medium text-gray-900">{merchant.tillNumber || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Service Type</span>
                    <span className="text-sm font-medium text-gray-900">
                      {merchant.serviceType === 'AIRTIME_AUTOMATION' ? '📡 Airtime Reseller' : '💳 Payment Collection'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`text-sm font-medium ${merchant.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {merchant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECURITY */}
          {activeSection === 'security' && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="py-2">
                  <p className="font-medium text-gray-900 mb-1">Change Password</p>
                  <p className="text-xs text-gray-500 mb-3">Update your account password</p>
                  <button 
                    onClick={() => router.push('/auth/change-password')}
                    className="text-sm text-[#8B1D1D] font-medium hover:underline"
                  >
                    Change Password →
                  </button>
                </div>
                <div className="py-2 border-t border-gray-100">
                  <p className="font-medium text-gray-900 mb-1">Session Management</p>
                  <p className="text-xs text-gray-500 mb-3">Manage your active sessions</p>
                  <button className="text-sm text-red-600 font-medium hover:underline">
                    Sign out all devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Transaction Alerts</p>
                    <p className="text-xs text-gray-500">Get notified for every transaction</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Settlement Alerts</p>
                    <p className="text-xs text-gray-500">Daily settlement confirmations</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 mt-2">
                  <p className="text-xs text-blue-700">
                    💡 Notification settings will be available in the next update
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}