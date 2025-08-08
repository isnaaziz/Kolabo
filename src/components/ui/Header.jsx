import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    // Trigger command palette (Ctrl+K functionality)
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true
    });
    document.dispatchEvent(event);
  };

  const notifications = [
    { id: 1, title: 'Task assigned to you', message: 'New task in Sprint Planning', time: '2 min ago', unread: true },
    { id: 2, title: 'Sprint completed', message: 'Sprint #12 has been completed', time: '1 hour ago', unread: true },
    { id: 3, title: 'Team meeting reminder', message: 'Daily standup in 15 minutes', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (!confirmed) return;

    try {
      setIsLoggingOut(true);
      console.log('🚪 Logging out...');
      await logout();
      console.log('✅ Logout successful, redirecting to login');
      navigate('/login-register');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still redirect to login even if logout API fails
      navigate('/login-register');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.full_name && !user?.name) return 'U';
    const name = user?.full_name || user?.name || 'User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Debug user data
  React.useEffect(() => {
    if (user) {
      console.log('🔍 Header - User data changed:', user);
      console.log('🔍 Header - Avatar URL:', user.avatar_url);
      console.log('🔍 Header - Full avatar path:', user.avatar_url ? `http://localhost:3000${user.avatar_url}` : 'No avatar');
    }
  }, [user]);

  // Force re-render when user data changes
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    forceUpdate();
  }, [user?.avatar_url]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-100">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Workspace Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={18} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-medium text-text-primary">TaskFlow Pro</h1>
              <p className="text-xs text-text-secondary">Development Team</p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div
            className="relative cursor-pointer"
            onClick={handleSearchClick}
          >
            <div className="w-full bg-secondary-50 border border-border rounded-lg px-4 py-2 flex items-center space-x-3 hover:bg-secondary-100 transition-colors duration-200">
              <Icon name="Search" size={16} color="#64748B" />
              <span className="text-sm text-secondary-500 flex-1 text-left">Search tasks, projects... (Ctrl+K)</span>
              <div className="hidden sm:flex items-center space-x-1">
                <kbd className="px-2 py-1 text-xs bg-secondary-200 text-secondary-600 rounded border">⌘</kbd>
                <kbd className="px-2 py-1 text-xs bg-secondary-200 text-secondary-600 rounded border">K</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-12 w-80 bg-surface border border-border rounded-lg shadow-lg z-150">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-border-light hover:bg-secondary-50 transition-colors duration-150">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-primary' : 'bg-secondary-300'}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">{notification.title}</p>
                          <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
                          <p className="text-xs text-secondary-400 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <button className="w-full text-sm text-primary hover:text-primary-700 transition-colors duration-200">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
            <Icon name="Plus" size={20} />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              {/* Profile Avatar */}
              <div className="relative w-8 h-8">
                {user?.avatar_url ? (
                  <img
                    src={`http://localhost:3000${user.avatar_url}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-primary-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center ${user?.avatar_url ? 'hidden' : 'flex'}`}
                >
                  <span className="text-sm font-medium text-primary-700">{getUserInitials()}</span>
                </div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-text-primary">{user?.full_name || user?.name || 'User'}</p>
                <p className="text-xs text-text-secondary">{user?.email || 'user@example.com'}</p>
              </div>
              <Icon name="ChevronDown" size={16} color="#64748B" />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-surface border border-border rounded-lg shadow-lg z-150">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">{user?.full_name || user?.name || 'User'}</p>
                  <p className="text-xs text-text-secondary">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-50 transition-colors duration-150 flex items-center space-x-3"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-50 transition-colors duration-150 flex items-center space-x-3">
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-50 transition-colors duration-150 flex items-center space-x-3">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                </div>
                <div className="border-t border-border py-2">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error-50 transition-colors duration-150 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name={isLoggingOut ? "Loader" : "LogOut"} size={16} />
                    <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handlers */}
      {(isUserMenuOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-90"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;