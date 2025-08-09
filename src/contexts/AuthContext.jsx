import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { tokenStore, attachAuthToasts } from '../services/apiClient';
import { useToast } from './ToastContext';

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
};

const ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    SET_USER: 'SET_USER',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN_START:
            return { ...state, isLoading: true, error: null };
        case ACTIONS.LOGIN_SUCCESS:
            return { ...state, user: action.payload.user, isAuthenticated: true, isLoading: false };
        case ACTIONS.LOGIN_FAILURE:
            return { ...state, user: null, isAuthenticated: false, isLoading: false, error: action.payload.error };
        case ACTIONS.LOGOUT:
            return { ...state, user: null, isAuthenticated: false, isLoading: false, error: null };
        case ACTIONS.SET_USER:
            return { ...state, user: action.payload.user, isAuthenticated: !!action.payload.user, isLoading: false };
        case ACTIONS.CLEAR_ERROR:
            return { ...state, error: null };
        default:
            return state;
    }
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { showSuccessToast, showErrorToast, showLoadingToast, removeToast } = useToast();
    attachAuthToasts({ showErrorToast, showSuccessToast });

    const makeRequest = async (url, options = {}) => {
        tokenStore.load();
        const token = tokenStore.getAccess();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        };
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}${url}`, { ...options, headers });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const err = new Error(data.message || 'Request failed');
            err.status = res.status;
            err.data = data;
            throw err;
        }
        return { data, status: res.status };
    };

    // Init
    useEffect(() => {
        (async () => {
            try {
                tokenStore.load();
                const token = tokenStore.getAccess();
                if (!token) {
                    dispatch({ type: ACTIONS.LOGOUT });
                    return;
                }
                const profile = await makeRequest('/auth/profile');
                dispatch({ type: ACTIONS.SET_USER, payload: { user: profile.data } });
            } catch (e) {
                if (e.status === 401) {
                    // Session invalid / dihapus backend
                    tokenStore.clear();
                    showErrorToast('Session expired, please login again', { title: 'Session Ended' });
                    dispatch({ type: ACTIONS.LOGOUT });
                } else {
                    // Fail lain: tetap hentikan loading supaya UI tidak macet
                    dispatch({ type: ACTIONS.LOGOUT });
                }
            }
        })();
    }, []);

    const login = async (usernameOrEmail, password) => {
        dispatch({ type: ACTIONS.LOGIN_START });
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ username: usernameOrEmail, password })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || 'Login failed');
            tokenStore.set({ access_token: data.access_token, refresh_token: data.refresh_token });
            dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { user: data.user } });
            try {
                const profile = await makeRequest('/auth/profile');
                dispatch({ type: ACTIONS.SET_USER, payload: { user: profile.data } });
            } catch { }
            showSuccessToast('Logged in');
            return data.user;
        } catch (e) {
            dispatch({ type: ACTIONS.LOGIN_FAILURE, payload: { error: e.message } });
            showErrorToast(e.message || 'Login failed');
            throw e;
        }
    };

    const register = async (payload) => {
        dispatch({ type: ACTIONS.LOGIN_START });
        try {
            const res = await makeRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
            showSuccessToast('Registration successful');
            dispatch({ type: ACTIONS.LOGIN_FAILURE, payload: { error: null } }); // keep unauthenticated until login
            return res.data;
        } catch (e) {
            dispatch({ type: ACTIONS.LOGIN_FAILURE, payload: { error: e.message } });
            showErrorToast(e.message || 'Registration failed');
            throw e;
        }
    };

    const logout = async () => {
        let toastId = null;
        try {
            toastId = showLoadingToast('Signing out...');
            try { await makeRequest('/auth/logout', { method: 'POST' }); } catch { }
            showSuccessToast('Logged out');
        } finally {
            if (toastId) removeToast(toastId);
            tokenStore.clear();
            dispatch({ type: ACTIONS.LOGOUT });
        }
    };

    const updateProfile = async () => {
        try {
            const res = await makeRequest('/auth/profile');
            dispatch({ type: ACTIONS.SET_USER, payload: { user: res.data } });
            return res.data;
        } catch (e) {
            showErrorToast('Failed to load profile');
            throw e;
        }
    };

    const clearError = () => dispatch({ type: ACTIONS.CLEAR_ERROR });

    const value = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        login,
        register,
        logout,
        updateProfile,
        clearError
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};

export default AuthContext;
