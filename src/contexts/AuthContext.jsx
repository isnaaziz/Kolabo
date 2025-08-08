import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from './ToastContext';

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,  // Start with loading for auth check
    error: null
};

// Action types - moved inside to avoid HMR issues
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    SET_USER: 'SET_USER',
    SET_LOADING: 'SET_LOADING',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload.error
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            };
        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: !!action.payload.user,
                isLoading: false
            };
        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
            };
        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const { showSuccessToast, showErrorToast, showLoadingToast, removeToast } = useToast();

    // Simple API functions without toast integration for auth context
    const makeRequest = async (url, options = {}) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        };

        const response = await fetch(`http://localhost:3000/api${url}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return { data, status: response.status };
    };

    // Initialize authentication state
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('Initializing authentication...');

            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Verify token with backend and get current user data
                    try {
                        const user = await makeRequest('/auth/profile');
                        console.log('🔍 User data from /auth/profile:', user.data);
                        console.log('🔍 Avatar URL:', user.data.avatar_url);
                        dispatch({
                            type: AUTH_ACTIONS.SET_USER,
                            payload: { user: user.data }
                        });
                        console.log('Authentication verified with backend');
                    } catch (error) {
                        console.warn('Token verification failed, clearing auth:', error.message);
                        localStorage.removeItem('token');
                        dispatch({ type: AUTH_ACTIONS.LOGOUT });
                    }
                } else {
                    console.log('No authentication found');
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (usernameOrEmail, password) => {
        let loadingToastId = null;

        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            // Show loading toast
            loadingToastId = showLoadingToast('Signing in...', {
                title: 'Please wait'
            });

            console.log('Attempting login with backend...');

            // Determine if it's email or username
            const isEmail = usernameOrEmail.includes('@');
            const credentials = isEmail
                ? { email: usernameOrEmail, password }
                : { username: usernameOrEmail, password };

            const response = await makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            // Remove loading toast
            if (loadingToastId) removeToast(loadingToastId);

            // Store token
            localStorage.setItem('token', response.data.access_token);

            console.log('🔍 User data from login response:', response.data.user);
            console.log('🔍 Login Avatar URL:', response.data.user?.avatar_url);

            // Dispatch user data immediately
            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user: response.data.user }
            });

            // Force a profile refresh to ensure we have the latest data
            try {
                const profileResponse = await makeRequest('/auth/profile');
                console.log('🔄 Refreshed user data after login:', profileResponse.data);
                console.log('🔄 Refreshed Avatar URL:', profileResponse.data.avatar_url);

                dispatch({
                    type: AUTH_ACTIONS.SET_USER,
                    payload: { user: profileResponse.data }
                });
            } catch (profileError) {
                console.warn('⚠️ Profile refresh failed, using login data:', profileError.message);
            }

            // Show success toast
            showSuccessToast('Login successful! Welcome back.', {
                title: 'Success',
                duration: 3000
            });

            console.log('Login successful with backend');
            return response;
        } catch (error) {
            // Remove loading toast
            if (loadingToastId) removeToast(loadingToastId);

            console.error('Login error:', error.message);

            // Show error toast based on error type
            let errorMessage = error.message || 'Login failed. Please try again.';
            let errorTitle = 'Login Failed';

            if (error.message === 'Invalid credentials') {
                errorMessage = 'Invalid username/email or password. Please check your credentials.';
            } else if (error.message.includes('Network')) {
                errorTitle = 'Connection Error';
                errorMessage = 'Unable to connect to server. Please check your internet connection.';
            }

            showErrorToast(errorMessage, {
                title: errorTitle,
                duration: 6000
            });

            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: { error: error.message }
            });
            throw error;
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            console.log('📝 Attempting registration with backend...');
            const response = await makeRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            console.log('✅ Registration successful');
            return response;
        } catch (error) {
            console.error('❌ Registration error:', error.message);
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: { error: error.message }
            });
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        let loadingToastId = null;

        try {
            // Show loading toast
            loadingToastId = showLoadingToast('Signing out...', {
                title: 'Please wait'
            });

            console.log('🚪 Logging out...');
            await makeRequest('/auth/logout', { method: 'POST' });

            // Remove loading toast
            if (loadingToastId) removeToast(loadingToastId);

            // Show success toast
            showSuccessToast('Logged out successfully. See you next time!', {
                title: 'Goodbye',
                duration: 3000
            });

            console.log('✅ Logout successful');
        } catch (error) {
            // Remove loading toast
            if (loadingToastId) removeToast(loadingToastId);

            console.error('❌ Logout error:', error);

            // Show warning toast (logout still happens locally)
            showErrorToast('Logout request failed, but you have been signed out locally.', {
                title: 'Warning',
                duration: 4000
            });
        } finally {
            localStorage.removeItem('token');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    // Update user profile
    const updateProfile = async () => {
        try {
            const response = await makeRequest('/auth/profile');
            console.log('🔍 Updated user data from /auth/profile:', response.data);
            console.log('🔍 Updated Avatar URL:', response.data.avatar_url);
            dispatch({
                type: AUTH_ACTIONS.SET_USER,
                payload: { user: response.data }
            });
            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    // Context value
    const value = {
        // State
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,

        // Actions
        login,
        register,
        logout,
        updateProfile,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;
