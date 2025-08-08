# Authentication Integration Guide

This guide explains how the React frontend is connected to your NestJS authentication backend.

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_API_TIMEOUT=10000
NODE_ENV=development
```

For production, update the API URL:
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

### 2. Backend Requirements

Ensure your NestJS backend is running on `http://localhost:3000` (or update the API URL accordingly).

Required endpoints that should be available:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- `POST /api/auth/forgot-password`

## 📁 File Structure

```
src/
├── components/
│   └── ProtectedRoute.jsx        # Route protection component
├── contexts/
│   └── AuthContext.jsx          # Authentication context and provider
├── services/
│   ├── api.js                   # Axios client with interceptors
│   ├── authService.js           # Authentication API calls
│   ├── userService.js           # User management API calls
│   └── index.js                 # Service exports
├── config/
│   └── api.js                   # API configuration constants
├── utils/
│   └── auth.js                  # Authentication utility functions
└── pages/
    └── login-register/
        └── components/
            ├── LoginForm.jsx    # Updated with real auth
            └── RegisterForm.jsx # Updated with real auth
```

## 🚀 How It Works

### Authentication Flow

1. **Login Process**:
   - User enters credentials in `LoginForm`
   - Form calls `authService.login()` with credentials
   - Service sends POST request to `/api/auth/login`
   - On success, tokens are stored in localStorage
   - User is redirected to dashboard

2. **Registration Process**:
   - User fills registration form in `RegisterForm`
   - Form calls `authService.register()` with user data
   - Service sends POST request to `/api/auth/register`
   - On success, user can proceed to login

3. **Token Management**:
   - Access token stored in localStorage
   - Refresh token stored in localStorage
   - API client automatically adds Authorization header
   - Automatic token refresh on 401 responses

### API Client Features

The `apiClient` (axios instance) includes:

- **Automatic Authorization**: Adds `Bearer {token}` header to requests
- **Token Refresh**: Automatically refreshes expired tokens
- **Error Handling**: Handles common HTTP errors gracefully
- **Request/Response Interceptors**: Manages authentication flow

### Context Provider

The `AuthContext` provides:
- Authentication state management
- Login/logout functions
- User data storage
- Loading states
- Error handling

## 🔒 Security Features

### Token Storage
- Access tokens: Short-lived (15 minutes)
- Refresh tokens: Longer-lived (7 days)
- Automatic token cleanup on logout

### Protected Routes
Use `ProtectedRoute` component to protect authenticated pages:

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

<ProtectedRoute>
  <DashboardComponent />
</ProtectedRoute>
```

### Password Security
- Real-time password strength validation
- Minimum complexity requirements
- Visual strength indicators

## 📝 Usage Examples

### Using Auth Context

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.fullName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```jsx
import { apiClient } from '../services';

// API calls automatically include authentication
const fetchUserData = async () => {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Using Auth Service Directly

```jsx
import authService from '../services/authService';

// Login
const handleLogin = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// Check authentication status
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
  console.log('Current user:', user);
}
```

## 🔧 Configuration Options

### API Configuration

In `src/config/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user'
  }
};
```

### Customizing Auth Behavior

You can modify authentication behavior by updating:

1. **Token storage**: Change storage keys in `api.js`
2. **Request timeout**: Update timeout in environment variables
3. **Error handling**: Modify error handlers in services
4. **Validation rules**: Update password validation in `auth.js`

## 🐛 Troubleshooting

### Common Issues

1. **"Network Error"**:
   - Check if backend server is running
   - Verify API URL in environment variables
   - Check CORS configuration on backend

2. **"401 Unauthorized"**:
   - Token might be expired
   - Check token format in localStorage
   - Verify backend authentication logic

3. **"Cannot read properties of undefined"**:
   - Ensure AuthProvider wraps your app
   - Check if useAuth is called inside AuthProvider
   - Verify context is properly imported

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
REACT_APP_DEBUG=true
```

### Backend Connection Test

Test backend connectivity:
```javascript
// In browser console
fetch('http://localhost:3000/api/health')
  .then(response => response.json())
  .then(data => console.log('Backend status:', data))
  .catch(error => console.error('Backend error:', error));
```

## 🔄 Fallback to Mock Authentication

The forms include fallback to mock authentication if the backend is not available:

**Mock Credentials**:
- Email: `john.doe@company.com`
- Password: `Kolabo2024!`

This allows the frontend to work independently during development.

## 🚀 Production Deployment

### Before Deploying

1. Update environment variables for production
2. Configure proper CORS on backend
3. Use HTTPS for production API
4. Set secure localStorage practices
5. Configure proper error logging

### Production Environment Variables

```env
REACT_APP_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

## 📚 API Documentation

Your backend provides comprehensive Swagger documentation at:
- **Development**: http://localhost:3000/api/docs
- **Production**: https://api.yourdomain.com/api/docs

Use this documentation to:
- Test endpoints directly
- View request/response schemas
- Understand authentication flow
- Debug API issues

## 🤝 Integration Checklist

- [ ] Backend server is running
- [ ] Environment variables are configured
- [ ] CORS is properly set up
- [ ] All authentication endpoints are available
- [ ] Token expiration times are configured
- [ ] Error responses match expected format
- [ ] Password validation rules are aligned
- [ ] Database connections are working
- [ ] JWT secrets are properly configured

---

For more information about the backend API, refer to your Swagger documentation or the backend README.
