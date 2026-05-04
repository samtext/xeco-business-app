'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Building2, Phone, MapPin, CreditCard, 
  Save, Edit2, Loader2, CheckCircle, AlertCircle,
  Clock, Calendar, Package, Wallet
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://xecoflow.onrender.com';

interface MerchantProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  businessType: string;
  serviceType: string;
  tillNumber: string;
  paybillNumber?: string;
  accountNumber?: string;
  mpesaNumber?: string;
  kraPin?: string;
  businessAddress?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<Partial<MerchantProfile>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/merchant/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setFormData(data.data);
      } else {
        setErrorMessage('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
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
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setSuccessMessage('Profile updated successfully!');
        setEditMode(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getServiceTypeBadge = (type: string) => {
    if (type === 'airtime' || type === 'AIRTIME_AUTOMATION') {
      return { bg: 'bg-orange-100', text: 'text-orange-700', label: '📡 Airtime Reseller' };
    }
    return { bg: 'bg-green-100', text: 'text-green-700', label: '💳 Payment Collection' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#8B1D1D] animate-spin" />
      </div>
    );
  }

  const badge = getServiceTypeBadge(profile?.serviceType || '');

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B1D1D] text-white rounded-xl text-sm font-semibold hover:bg-[#701616] transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#8B1D1D] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profile?.fullName || 'Merchant'}</h2>
              <p className="text-white/70 text-sm">{profile?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Business Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#8B1D1D]" />
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Business Name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.businessName || ''}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B1D1D]"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{profile?.businessName || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Business Type</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.businessType || ''}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B1D1D]"
                    placeholder="e.g., Retail, Wholesale"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{profile?.businessType || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Service Type</label>
                <div className="inline-flex px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: badge.bg, color: badge.text.split(' ')[1] }}>
                  {badge.label}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Status</label>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${profile?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {profile?.status || 'Active'}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#8B1D1D]" />
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Till Number</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.tillNumber || ''}
                    onChange={(e) => setFormData({ ...formData, tillNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B1D1D]"
                  />
                ) : (
                  <p className="text-sm font-mono font-medium text-gray-900">{profile?.tillNumber || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Paybill Number</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.paybillNumber || ''}
                    onChange={(e) => setFormData({ ...formData, paybillNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B1D1D]"
                  />
                ) : (
                  <p className="text-sm font-mono font-medium text-gray-900">{profile?.paybillNumber || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Account Number</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.accountNumber || ''}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B1D1D]"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{profile?.accountNumber || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">M-Pesa Number</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.mpesaNumber || ''}
                    onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B1D1D]"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{profile?.mpesaNumber || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#8B1D1D]" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B1D1D]"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{profile?.phoneNumber || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Email Address</label>
                <p className="text-sm font-medium text-gray-900">{profile?.email}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500 block mb-1">Business Address</label>
                {editMode ? (
                  <textarea
                    value={formData.businessAddress || ''}
                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B1D1D]"
                    rows={2}
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{profile?.businessAddress || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#8B1D1D]" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">KRA PIN</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.kraPin || ''}
                    onChange={(e) => setFormData({ ...formData, kraPin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B1D1D]"
                  />
                ) : (
                  <p className="text-sm font-mono font-medium text-gray-900">{profile?.kraPin || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Member Since</label>
                <p className="text-sm font-medium text-gray-900">{formatDate(profile?.createdAt || '')}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons (Edit Mode) */}
          {editMode && (
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="flex-1 bg-[#8B1D1D] text-white py-3 rounded-xl font-semibold hover:bg-[#701616] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData(profile || {});
                  setErrorMessage('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}