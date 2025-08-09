import axios from 'axios';

// --- Config -------------------------------------------------
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/+$/, '');
const LOGIN_ROUTE = '/login-register';

// --- Internal state -----------------------------------------
let accessToken = null;
let refreshToken = null;
let isRefreshing = false;
let refreshQueue = []; // [{resolve, reject}]
let toastFns = null;
let hasRedirectedAuth = false;

// --- Helpers ------------------------------------------------
const runQueue = (error, token = null) => {
    refreshQueue.forEach(p => {
        if (error) p.reject(error); else p.resolve(token);
    });
    refreshQueue = [];
};

const handleAuthRedirect = (msg, title) => {
    if (hasRedirectedAuth) return;
    hasRedirectedAuth = true;
    toastFns?.showErrorToast?.(msg, { title });
    setTimeout(() => { window.location.replace(LOGIN_ROUTE); }, 40);
};

// --- Token Store --------------------------------------------
export const tokenStore = {
    set(tokens) {
        if (tokens?.access_token) accessToken = tokens.access_token;
        if (tokens?.refresh_token) refreshToken = tokens.refresh_token;
        localStorage.setItem('kolabo_tokens', JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken
        }));
        // Legacy keys (optional backward compatibility)
        if (accessToken) localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    },
    load() {
        const raw = localStorage.getItem('kolabo_tokens');
        if (!raw) return;
        try {
            const p = JSON.parse(raw);
            accessToken = p.access_token || p.accessToken || accessToken;
            refreshToken = p.refresh_token || p.refreshToken || refreshToken;
        } catch { }
    },
    clear() {
        accessToken = null;
        refreshToken = null;
        localStorage.removeItem('kolabo_tokens');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },
    getAccess() { return accessToken; },
    getRefresh() { return refreshToken; }
};
// Initial load
tokenStore.load();

// --- Axios instance -----------------------------------------
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

// --- Request interceptor ------------------------------------
api.interceptors.request.use(
    (config) => {
        tokenStore.load();
        const token = tokenStore.getAccess();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Refresh logic ------------------------------------------
const performRefresh = async () => {
    const refresh = tokenStore.getRefresh();
    if (!refresh) throw new Error('No refresh token');
    const res = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refresh });
    tokenStore.set(res.data);
    return tokenStore.getAccess();
};

// --- Response interceptor -----------------------------------
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const original = error.config;

        if (status === 401 && !original?._retry) {
            // Do not attempt refresh for refresh endpoint itself
            if (original?.url && /\/auth\/refresh$/.test(original.url)) {
                tokenStore.clear();
                handleAuthRedirect('Session expired, please login again', 'Session Ended');
                return Promise.reject(error);
            }

            // Mark for retry
            original._retry = true;

            try {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        refreshQueue.push({
                            resolve: (token) => {
                                original.headers.Authorization = `Bearer ${token}`;
                                resolve(api.request(original));
                            },
                            reject: (err) => reject(err)
                        });
                    });
                }

                isRefreshing = true;
                const newAccess = await performRefresh();
                runQueue(null, newAccess);
                original.headers.Authorization = `Bearer ${newAccess}`;
                return api.request(original);
            } catch (refreshErr) {
                runQueue(refreshErr, null);
                tokenStore.clear();
                handleAuthRedirect('Session expired, please login again', 'Session Ended');
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        // If still 401 after retry or other 401 w/out refresh
        if (status === 401) {
            tokenStore.clear();
            handleAuthRedirect('Please login to continue', 'Not Authenticated');
        }

        return Promise.reject(error);
    }
);

// --- Public API ---------------------------------------------
export const attachAuthToasts = (fns) => { toastFns = fns; };
export const getHttpClient = () => api;
export default api;