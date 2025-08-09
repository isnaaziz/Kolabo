import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/+$/, '');

let accessToken = null;
let refreshToken = null;
let isRefreshing = false;
let refreshQueue = [];
let toastFns = null;
let hasRedirectedAuth = false; // cegah multiple redirect & spam toast

export const tokenStore = {
    set(tokens) {
        console.log('Setting tokens:', tokens);
        if (tokens?.access_token) accessToken = tokens.access_token;
        if (tokens?.refresh_token) refreshToken = tokens.refresh_token;

        // Simpan dengan nama field yang konsisten
        localStorage.setItem('kolabo_tokens', JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken
        }));
        console.log('Tokens saved to localStorage');
    },
    load() {
        const raw = localStorage.getItem('kolabo_tokens');
        if (!raw) {
            console.log('No tokens found in localStorage');
            return;
        }
        try {
            const p = JSON.parse(raw);
            // Coba kedua format untuk backward compatibility
            accessToken = p.access_token || p.accessToken;
            refreshToken = p.refresh_token || p.refreshToken;
            console.log('Tokens loaded from localStorage:', { hasAccess: !!accessToken, hasRefresh: !!refreshToken });
        } catch (e) {
            console.error('Failed to parse tokens:', e);
        }
    },
    clear() {
        console.log('Clearing tokens');
        accessToken = null;
        refreshToken = null;
        localStorage.removeItem('kolabo_tokens');
    },
    getAccess() { return accessToken; },
    getRefresh() { return refreshToken; }
}; tokenStore.load();

const api = axios.create({
    baseURL: API_BASE,
    timeout: 15000
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

        tokenStore.load();
        const token = tokenStore.getAccess();

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token added to request:', `Bearer ${token.substring(0, 20)}...`);
        } else {
            console.log('No token available for request');
        }

        console.log('Request headers:', config.headers);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
        return response;
    },
    async (error) => {
        console.log(`API Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`);

        if (error.response?.status === 401 && !error.config._retry) {
            console.log('Attempting token refresh...');
            error.config._retry = true;

            // Jangan coba refresh kalau endpoint yang gagal adalah /auth/refresh untuk menghindari loop
            if (error.config.url && /\/auth\/refresh$/.test(error.config.url)) {
                tokenStore.clear();
                if (!hasRedirectedAuth) {
                    hasRedirectedAuth = true;
                    toastFns?.showErrorToast?.('Session expired, please login again', { title: 'Session Ended' });
                    setTimeout(() => { window.location.replace('/login-register'); }, 50);
                }
                return Promise.reject(error);
            }

            const refresh = tokenStore.getRefresh();
            if (refresh) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
                        refresh_token: refresh
                    });

                    console.log('Token refresh successful');
                    tokenStore.set(response.data);

                    // Retry original request
                    const token = tokenStore.getAccess();
                    error.config.headers.Authorization = `Bearer ${token}`;
                    console.log('Retrying original request with new token');
                    return api.request(error.config);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    tokenStore.clear();
                    if (!hasRedirectedAuth) {
                        hasRedirectedAuth = true;
                        toastFns?.showErrorToast?.('Session expired, please login again', { title: 'Session Ended' });
                        setTimeout(() => { window.location.replace('/login-register'); }, 50);
                    }
                }
            } else {
                tokenStore.clear();
                if (!hasRedirectedAuth) {
                    hasRedirectedAuth = true;
                    toastFns?.showErrorToast?.('Please login to continue', { title: 'Not Authenticated' });
                    setTimeout(() => { window.location.replace('/login-register'); }, 50);
                }
            }
        }

        return Promise.reject(error);
    }
);

// Helper debug manual di console
if (typeof window !== 'undefined') {
    window.__api = api;
    window.__showTokens = () => {
        tokenStore.load();
        console.log('Access:', tokenStore.getAccess(), 'Refresh:', tokenStore.getRefresh());
    };
}

export const attachAuthToasts = (fns) => { toastFns = fns; };

export default api;