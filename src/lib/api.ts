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
// HELPER: Check if token is expired
// ============================================================================
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > exp;
  } catch {
    return true; // If we can't parse, treat as expired
  }
}

// ============================================================================
// HELPER: Clear auth data and redirect to login
// ============================================================================
function clearAuthAndRedirect(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('merchantId');
  localStorage.removeItem('merchantName');
  localStorage.removeItem('businessName');
  localStorage.removeItem('merchantEmail');
  localStorage.removeItem('merchantPin');
  localStorage.removeItem('verificationEmail');
  localStorage.removeItem('serviceType');
  localStorage.removeItem('merchantTill');
  localStorage.removeItem('codeSent');
  
  window.location.href = '/auth/signin';
}

// ============================================================================
// CORE: fetchApi - Every request goes through this function
// ============================================================================
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`\n🔵 [API] ========== REQUEST ==========`);
  console.log(`🔵 [API] Full URL: ${url}`);
  console.log(`🔵 [API] Method: ${options?.method || 'GET'}`);
  console.log(`🔵 [API] Token present: ${!!token}`);
  if (token) {
    console.log(`🔵 [API] Token preview: ${token.substring(0, 30)}...`);
    console.log(`🔵 [API] Token expired: ${isTokenExpired(token) ? 'YES' : 'NO'}`);
  }

  // Check if token exists and is expired before making the request
  if (token && isTokenExpired(token)) {
    console.warn('🔴 [API] Token expired, clearing storage and redirecting');
    clearAuthAndRedirect();
    throw new Error('Session expired. Please login again.');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  console.log(`🔵 [API] Response status: ${response.status}`);
  console.log(`🔵 [API] Response status text: ${response.statusText}`);
  
  // Try to get response body for debugging
  let responseBody;
  try {
    const clonedResponse = response.clone();
    responseBody = await clonedResponse.text();
    console.log(`🔵 [API] Response body: ${responseBody.substring(0, 500)}`);
  } catch (e) {
    console.log(`🔵 [API] Could not read response body`);
  }
  
  console.log(`🔵 [API] ========== END ==========\n`);

  // Handle 401 Unauthorized - Token invalid or expired
  if (response.status === 401) {
    console.warn('🔴 [API] Received 401 Unauthorized, clearing storage and redirecting');
    clearAuthAndRedirect();
    throw new Error('Session expired. Please login again.');
  }

  // Handle 404 Not Found - Log details
  if (response.status === 404) {
    console.error(`🔴 [API] 404 Not Found - Endpoint: ${url}`);
    console.error(`🔴 [API] This endpoint may not be registered on the backend`);
    throw new Error(`API endpoint not found: ${endpoint}`);
  }

  if (!response.ok) {
    let errorBody;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = { error: response.statusText };
    }
    console.error(`🔴 [API] Error ${response.status}:`, errorBody);
    throw new Error(errorBody.message || errorBody.error || `API Error: ${response.status}`);
  }

  const json = await response.json();
  console.log(`🔵 [API] Response success: ${!!json.success}`);
  
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