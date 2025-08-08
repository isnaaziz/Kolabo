# Toast System Documentation

## Overview
Sistem toast dinamis berdasarkan respons API dari Swagger backend Anda. Toast secara otomatis menangani loading states, success messages, dan error handling berdasarkan HTTP status codes dan struktur respons API.

## Features
- ✅ **Automatic API Response Handling** - Toast otomatis berdasarkan status HTTP
- ✅ **Manual Toast Control** - Kontrol manual untuk notifikasi custom
- ✅ **Dynamic Error Parsing** - Parse error dari response API secara otomatis
- ✅ **Loading States** - Toast loading untuk operasi async
- ✅ **Action Buttons** - Tombol aksi pada toast untuk interaksi user
- ✅ **Auto-dismiss** - Auto close dengan progress bar
- ✅ **Type-based Styling** - Styling berbeda untuk success, error, warning, info

## Basic Usage

### 1. Setup (Sudah configured)
```jsx
// App.jsx - Already done
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ui/ToastContainer';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes />
        <ToastContainer />
      </AuthProvider>
    </ToastProvider>
  );
}
```

### 2. Manual Toast Usage
```jsx
import { useToast } from '../contexts/ToastContext';

const MyComponent = () => {
  const { 
    showSuccessToast, 
    showErrorToast, 
    showWarningToast, 
    showInfoToast,
    showLoadingToast 
  } = useToast();

  const handleSuccess = () => {
    showSuccessToast('Task created successfully!', {
      title: 'Success',
      duration: 4000,
      actions: [
        {
          label: 'View Task',
          variant: 'primary',
          onClick: () => console.log('View clicked')
        }
      ]
    });
  };

  const handleError = () => {
    showErrorToast('Failed to save changes', {
      title: 'Error',
      duration: 6000
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
};
```

### 3. Automatic API Integration
```jsx
import { useApiService } from '../services/apiService';

const TaskComponent = () => {
  const apiService = useApiService();

  const createTask = async () => {
    try {
      // Automatically shows loading toast, then success/error toast
      const response = await apiService.createTask({
        title: 'New Task',
        description: 'Task description',
        status: 'todo'
      });
      // Success toast shown automatically
    } catch (error) {
      // Error toast shown automatically
    }
  };

  return <button onClick={createTask}>Create Task</button>;
};
```

### 4. API Error Handling
```jsx
const { showApiErrorToast } = useToast();

// Handle specific API errors
try {
  await apiCall();
} catch (error) {
  showApiErrorToast(error, {
    title: 'Custom Error Title'
  });
}
```

## API Response Patterns

### Success Responses (200-299)
```json
{
  "message": "Task created successfully",
  "data": { "id": 1, "title": "New Task" }
}
```
→ Shows success toast with message

### Error Responses (400+)
```json
{
  "message": "Validation failed",
  "error_code": "VALIDATION_ERROR",
  "errors": [
    { "field": "title", "message": "Title is required" },
    { "field": "assignee", "message": "Invalid assignee" }
  ]
}
```
→ Shows error toast with appropriate formatting

### HTTP Status Code Handling
- **400 Bad Request** → "Invalid request data"
- **401 Unauthorized** → "Please login to continue" 
- **403 Forbidden** → "Permission denied"
- **404 Not Found** → "Resource not found"
- **422 Validation Error** → Formats validation errors
- **429 Too Many Requests** → "Please wait before retrying"
- **500 Server Error** → "Internal server error"
- **502 Bad Gateway** → "Service unavailable"

## Available API Service Methods

### Authentication
```jsx
await apiService.login(credentials);        // Auto toast
await apiService.logout();                  // Auto toast
await apiService.register(userData);        // Auto toast
```

### Tasks
```jsx
await apiService.createTask(taskData);      // Auto toast
await apiService.updateTask(id, data);      // Auto toast  
await apiService.deleteTask(id);            // Auto toast
```

### Sprints
```jsx
await apiService.createSprint(sprintData);  // Auto toast
```

### Team
```jsx
await apiService.inviteMember(inviteData);  // Auto toast
```

### File Upload
```jsx
await apiService.uploadFile(file);          // Auto toast
```

### Generic
```jsx
await apiService.get('/api/endpoint');      // Auto error toast
```

## Toast Types & Styling

### Success (Green)
- ✅ Icon: CheckCircle
- Duration: 4000ms
- Usage: Operations completed successfully

### Error (Red)  
- ❌ Icon: XCircle
- Duration: 7000ms
- Usage: Failed operations, validation errors

### Warning (Yellow)
- ⚠️ Icon: AlertTriangle  
- Duration: 6000ms
- Usage: Important notices, unsaved changes

### Info (Blue)
- ℹ️ Icon: Info
- Duration: 5000ms  
- Usage: General information, updates

### Loading (Gray)
- 🔄 Icon: Loader (spinning)
- No auto-dismiss
- Usage: Long-running operations

## Custom Toast Options

```jsx
showSuccessToast('Message', {
  title: 'Custom Title',           // Toast title
  duration: 5000,                  // Auto-dismiss time (ms)
  autoClose: true,                 // Enable auto-dismiss
  actions: [                       // Action buttons
    {
      label: 'Action 1',
      variant: 'primary',           // 'primary' or default
      onClick: () => {}
    },
    {
      label: 'Dismiss',
      onClick: () => {}
    }
  ]
});
```

## Examples

Check `/src/components/examples/ToastExamples.jsx` for comprehensive examples.

## Integration Notes

1. **AuthContext** - Updated to use new toast system
2. **LoginForm** - Uses toast for login feedback  
3. **Header** - Logout uses toast notifications
4. **Dashboard** - Welcome toast on login
5. **API Service** - Automatic toast handling for all operations

## Testing Toast System

1. Login/logout to see authentication toasts
2. Visit dashboard to see welcome toast
3. Click "Create Task" on dashboard for demo toast
4. Check browser console for action button interactions

## Customization

### Add New Toast Type
```jsx
// In ToastContext.jsx
export const TOAST_TYPES = {
  // ... existing types
  CUSTOM: 'custom'
};

// In ToastContainer.jsx  
const getToastStyles = () => {
  switch (toast.type) {
    case TOAST_TYPES.CUSTOM:
      return `${baseStyles} bg-purple-50 border-purple-200 text-purple-800`;
    // ... other cases
  }
};
```

### Custom API Operation Messages
```jsx
// In apiService.js
const successMessages = {
  // ... existing messages
  customOperation: 'Custom operation completed!',
};
```

## Browser Compatibility
- Modern browsers with ES6+ support
- React Portals for toast positioning
- CSS animations for smooth transitions
