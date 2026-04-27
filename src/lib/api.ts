// ============================================================================
// XECOFLOW API CLIENT - Connected to Real Backend
// ============================================================================
// This file connects the XecoFlow Frontend to the XecoFlow Backend.
// Every API call goes through this file.
// Backend URL: https://xecoflow.onrender.com
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://xecoflow.onrender.com';

// ============================================================================
// HELPER: Get auth token from localStorage
// ============================================================================
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

// ============================================================================
// CORE: fetchApi - Every request goes through this function
// ============================================================================
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${response.status}`);
  }

  const json = await response.json();
  return json.data || json;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const api = {
  // -------------------------------------------------------------------------
  // MERCHANT PROFILE
  // -------------------------------------------------------------------------
  getMerchantProfile: () =>
    fetchApi<any>('/api/v1/merchant/me'),

  // -------------------------------------------------------------------------
  // FLOAT BALANCES
  // -------------------------------------------------------------------------
  getFloatBalance: () =>
    fetchApi<{ aggregatorFloat?: number; tillBalance: number }>('/api/v1/merchant/float'),

  // -------------------------------------------------------------------------
  // TRANSACTIONS (Airtime)
  // -------------------------------------------------------------------------
  getTransactions: (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return fetchApi<any>(`/api/v1/merchant/transactions${qs ? `?${qs}` : ''}`);
  },

  // -------------------------------------------------------------------------
  // TODAY'S SUMMARY
  // -------------------------------------------------------------------------
  getTodaySummary: () =>
    fetchApi<any>('/api/v1/merchant/transactions/summary'),

  // -------------------------------------------------------------------------
  // STOCK INVENTORY
  // -------------------------------------------------------------------------
  getStock: () =>
    fetchApi<any[]>('/api/v1/merchant/stock'),

  // -------------------------------------------------------------------------
  // ALERTS
  // -------------------------------------------------------------------------
  getAlerts: () =>
    fetchApi<any>('/api/v1/merchant/alerts'),

  // -------------------------------------------------------------------------
  // SEND AIRTIME
  // -------------------------------------------------------------------------
  sendAirtime: (data: { phone: string; amount: number; network: string }) =>
    fetchApi<any>('/api/v1/airtime/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // -------------------------------------------------------------------------
  // TOP UP STOCK
  // -------------------------------------------------------------------------
  topUpStock: (data: { network: string; denomination: number; quantity: number }) =>
    fetchApi<any>('/api/v1/stock/topup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // -------------------------------------------------------------------------
  // RETRY FAILED TRANSACTION
  // -------------------------------------------------------------------------
  retryTransaction: (transactionId: string) =>
    fetchApi<any>(`/api/v1/admin/airtime/retry`, {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    }),

  // -------------------------------------------------------------------------
  // REFUND TRANSACTION
  // -------------------------------------------------------------------------
  refundTransaction: (transactionId: string) =>
    fetchApi<any>(`/api/v1/transaction/${transactionId}/refund`, {
      method: 'POST',
    }),
};