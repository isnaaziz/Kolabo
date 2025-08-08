import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useApiService } from '../../hooks/useApiService';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/AppIcon';

const UserProfile = () => {
    const { user, updateProfile } = useAuth();
    const { showSuccessToast, showErrorToast, showLoadingToast, removeToast } = useToast();
    const apiService = useApiService();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        website: '',
        company: '',
        job_title: '',
        timezone: '',
        language: 'en',
        theme: 'light'
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [deletingPhoto, setDeletingPhoto] = useState(false);

    // Debug profile photo state changes
    useEffect(() => {
        console.log('🔍 UserProfile - Profile photo state changed:', profilePhoto);
    }, [profilePhoto]);

    // Load user sessions
    const loadUserSessions = async () => {
        setLoadingSessions(true);
        try {
            const response = await apiService.request('/auth/sessions');
            setSessions(response.data || []);
        } catch (error) {
            console.error('Failed to load sessions:', error);
            showErrorToast('Failed to load sessions', {
                title: 'Error',
                duration: 4000
            });
        } finally {
            setLoadingSessions(false);
        }
    };

    // Load sessions on component mount
    useEffect(() => {
        if (user) {
            loadUserSessions();
        }
    }, [user]);

    // Initialize form data with user info and update photo
    useEffect(() => {
        if (user) {
            console.log('🔍 UserProfile - User data changed:', user);
            console.log('🔍 UserProfile - Avatar URL:', user.avatar_url);

            setFormData({
                full_name: user.full_name || user.fullName || user.name || '',
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                company: user.company || '',
                job_title: user.job_title || user.jobTitle || '',
                timezone: user.timezone || 'UTC',
                language: user.language || 'en',
                theme: user.theme || 'light'
            });

            // Update profile photo if available - backend returns avatar_url
            const newPhotoUrl = user.avatar_url ? `http://localhost:3000${user.avatar_url}` : null;
            console.log('🔍 UserProfile - Setting photo URL:', newPhotoUrl);
            setProfilePhoto(newPhotoUrl);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let loadingToastId = null;

        try {
            loadingToastId = showLoadingToast('Updating profile...', {
                title: 'Please wait'
            });

            // Prepare update data - only include fields that are allowed by backend
            const updateData = {
                full_name: formData.full_name,
                phone: formData.phone,
                bio: formData.bio
            };

            // Call API to update profile using the new profile endpoint
            const response = await apiService.request('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });

            removeToast(loadingToastId);

            // Update auth context with new user data
            await updateProfile();

            showSuccessToast('Profile updated successfully!', {
                title: 'Success',
                duration: 4000
            });

            setIsEditing(false);
        } catch (error) {
            if (loadingToastId) removeToast(loadingToastId);

            showErrorToast(error.message || 'Failed to update profile', {
                title: 'Update Failed',
                duration: 6000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.confirm_password) {
            showErrorToast('New passwords do not match', {
                title: 'Password Mismatch',
                duration: 4000
            });
            return;
        }

        if (passwordData.new_password.length < 6) {
            showErrorToast('Password must be at least 6 characters long', {
                title: 'Weak Password',
                duration: 4000
            });
            return;
        }

        setIsLoading(true);
        let loadingToastId = null;

        try {
            loadingToastId = showLoadingToast('Changing password...', {
                title: 'Please wait'
            });

            await apiService.request('/auth/change-password', {
                method: 'PUT',
                body: JSON.stringify({
                    current_password: passwordData.current_password,
                    new_password: passwordData.new_password
                })
            });

            removeToast(loadingToastId);

            showSuccessToast('Password changed successfully!', {
                title: 'Success',
                duration: 4000
            });

            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
            setShowPasswordForm(false);
        } catch (error) {
            if (loadingToastId) removeToast(loadingToastId);

            showErrorToast(error.message || 'Failed to change password', {
                title: 'Password Change Failed',
                duration: 6000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showErrorToast('Please select a valid image file', {
                title: 'Invalid File Type',
                duration: 4000
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showErrorToast('Image size must be less than 5MB', {
                title: 'File Too Large',
                duration: 4000
            });
            return;
        }

        setUploadingPhoto(true);
        let loadingToastId = null;

        try {
            loadingToastId = showLoadingToast('Uploading photo...', {
                title: 'Please wait'
            });

            const formData = new FormData();
            formData.append('photo', file);

            // Use fetch directly for FormData upload
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/auth/profile/photo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            removeToast(loadingToastId);

            // Update profile photo state immediately - backend returns avatar_url
            const newPhotoUrl = data.avatar_url ? `http://localhost:3000${data.avatar_url}` : URL.createObjectURL(file);
            setProfilePhoto(newPhotoUrl);

            // Refresh user profile to get updated data
            await updateProfile();

            showSuccessToast('Profile photo updated successfully!', {
                title: 'Success',
                duration: 4000
            });

        } catch (error) {
            if (loadingToastId) removeToast(loadingToastId);

            showErrorToast(error.message || 'Failed to upload photo', {
                title: 'Upload Failed',
                duration: 6000
            });
        } finally {
            setUploadingPhoto(false);
            // Clear the input
            event.target.value = '';
        }
    };

    const handlePhotoDelete = async () => {
        if (!profilePhoto) return;

        setDeletingPhoto(true);
        let loadingToastId = null;

        try {
            loadingToastId = showLoadingToast('Removing photo...', {
                title: 'Please wait'
            });

            await apiService.request('/auth/profile/photo', {
                method: 'DELETE'
            });

            removeToast(loadingToastId);

            // Clear profile photo state
            setProfilePhoto(null);

            // Refresh user profile to get updated data
            await updateProfile();

            showSuccessToast('Profile photo removed successfully!', {
                title: 'Success',
                duration: 4000
            });

        } catch (error) {
            if (loadingToastId) removeToast(loadingToastId);

            showErrorToast(error.message || 'Failed to remove photo', {
                title: 'Delete Failed',
                duration: 6000
            });
        } finally {
            setDeletingPhoto(false);
        }
    };

    const getUserInitials = () => {
        const name = formData.full_name || formData.username || 'User';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <Sidebar />

            {/* Main Content */}
            <main className="lg:ml-60 pt-16">
                <div className="p-6">
                    {/* Page Header */}
                    <PageHeader
                        title="User Profile"
                        subtitle="Manage your account settings and personal information"
                        actions={
                            <div className="flex space-x-3">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                                    >
                                        <Icon name="Edit" size={16} />
                                        <span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                // Reset form data
                                                if (user) {
                                                    setFormData({
                                                        full_name: user.full_name || user.fullName || user.name || '',
                                                        username: user.username || '',
                                                        email: user.email || '',
                                                        phone: user.phone || '',
                                                        bio: user.bio || '',
                                                        location: user.location || '',
                                                        website: user.website || '',
                                                        company: user.company || '',
                                                        job_title: user.job_title || user.jobTitle || '',
                                                        timezone: user.timezone || 'UTC',
                                                        language: user.language || 'en',
                                                        theme: user.theme || 'light'
                                                    });
                                                }
                                            }}
                                            className="px-4 py-2 bg-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-300 transition-colors duration-200 flex items-center space-x-2"
                                        >
                                            <Icon name="X" size={16} />
                                            <span>Cancel</span>
                                        </button>
                                        <button
                                            onClick={handleProfileUpdate}
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Icon name="Save" size={16} />
                                            <span>Save Changes</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        }
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Profile Card - Left Column */}
                        <div className="lg:col-span-4">
                            <div className="bg-surface border border-border rounded-lg p-6">
                                <div className="text-center mb-6">
                                    {/* Profile Picture */}
                                    <div className="relative w-24 h-24 mx-auto mb-4">
                                        {profilePhoto ? (
                                            <img
                                                src={profilePhoto}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full object-cover border-2 border-primary-200"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center ${profilePhoto ? 'hidden' : 'flex'}`}
                                        >
                                            <span className="text-2xl font-bold text-primary-700">{getUserInitials()}</span>
                                        </div>

                                        {/* Delete Photo Button */}
                                        {profilePhoto && (
                                            <button
                                                onClick={handlePhotoDelete}
                                                disabled={deletingPhoto}
                                                className="absolute -top-1 -right-1 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center hover:bg-error-600 transition-colors duration-200 disabled:opacity-50"
                                                title="Remove photo"
                                            >
                                                {deletingPhoto ? (
                                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Icon name="X" size={12} />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Photo Upload Button */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="photo-upload"
                                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto cursor-pointer transition-colors duration-200 ${uploadingPhoto
                                                ? 'bg-secondary-100 text-secondary-500 cursor-not-allowed'
                                                : 'bg-primary text-white hover:bg-primary-600'
                                                }`}
                                        >
                                            {uploadingPhoto ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-secondary-400 border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Uploading...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Icon name="Camera" size={16} />
                                                    <span>{profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
                                                </>
                                            )}
                                        </label>
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            disabled={uploadingPhoto}
                                            className="hidden"
                                        />
                                        <p className="text-xs text-secondary-500">
                                            JPG, PNG or GIF up to 5MB
                                        </p>
                                    </div>
                                </div>

                                {/* Profile Summary */}
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary">{formData.full_name || 'No Name'}</h3>
                                        <p className="text-secondary-600">@{formData.username || 'username'}</p>
                                        {user?.role && (
                                            <p className="text-xs text-primary bg-primary-50 px-2 py-1 rounded-full inline-block mt-1">
                                                {user.role.toUpperCase()}
                                            </p>
                                        )}
                                    </div>

                                    {formData.job_title && (
                                        <div className="flex items-center space-x-2 text-secondary-600">
                                            <Icon name="Briefcase" size={16} />
                                            <span>{formData.job_title}</span>
                                        </div>
                                    )}

                                    {formData.company && (
                                        <div className="flex items-center space-x-2 text-secondary-600">
                                            <Icon name="Building" size={16} />
                                            <span>{formData.company}</span>
                                        </div>
                                    )}

                                    {formData.location && (
                                        <div className="flex items-center space-x-2 text-secondary-600">
                                            <Icon name="MapPin" size={16} />
                                            <span>{formData.location}</span>
                                        </div>
                                    )}

                                    {formData.website && (
                                        <div className="flex items-center space-x-2 text-secondary-600">
                                            <Icon name="Globe" size={16} />
                                            <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-700">
                                                {formData.website}
                                            </a>
                                        </div>
                                    )}

                                    {/* Account Information */}
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <h4 className="text-sm font-medium text-text-primary mb-2">Account Information</h4>
                                        <div className="space-y-2 text-sm text-secondary-600">
                                            {user?.created_at && (
                                                <div className="flex items-center space-x-2">
                                                    <Icon name="Calendar" size={14} />
                                                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {user?.id && (
                                                <div className="flex items-center space-x-2">
                                                    <Icon name="Hash" size={14} />
                                                    <span className="font-mono text-xs">{user.id.split('-')[0]}...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                {formData.bio && (
                                    <div className="mt-6 pt-6 border-t border-border">
                                        <h4 className="text-sm font-medium text-text-primary mb-2">Bio</h4>
                                        <p className="text-secondary-600 text-sm">{formData.bio}</p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 bg-surface border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-text-primary mb-4">Account Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowPasswordForm(true)}
                                        className="w-full px-4 py-2 bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors duration-200 flex items-center space-x-2"
                                    >
                                        <Icon name="Lock" size={16} />
                                        <span>Change Password</span>
                                    </button>

                                    <button
                                        onClick={loadUserSessions}
                                        disabled={loadingSessions}
                                        className="w-full px-4 py-2 bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        <Icon name={loadingSessions ? "Loader" : "Monitor"} size={16} />
                                        <span>{loadingSessions ? 'Loading...' : 'Refresh Sessions'}</span>
                                    </button>

                                    <button
                                        disabled
                                        className="w-full px-4 py-2 bg-secondary-50 text-secondary-500 rounded-lg cursor-not-allowed flex items-center space-x-2"
                                    >
                                        <Icon name="Download" size={16} />
                                        <span>Export Data (Coming Soon)</span>
                                    </button>

                                    <button
                                        disabled
                                        className="w-full px-4 py-2 bg-error-50 text-error-500 rounded-lg cursor-not-allowed flex items-center space-x-2"
                                    >
                                        <Icon name="Trash" size={16} />
                                        <span>Delete Account (Coming Soon)</span>
                                    </button>
                                </div>
                            </div>

                            {/* Active Sessions */}
                            <div className="mt-6 bg-surface border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-text-primary mb-4">Active Sessions</h3>
                                {loadingSessions ? (
                                    <div className="flex items-center justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                ) : sessions.length > 0 ? (
                                    <div className="space-y-3">
                                        {sessions.map((session) => (
                                            <div key={session.id} className="p-3 bg-secondary-50 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-2 h-2 rounded-full ${session.is_active ? 'bg-success' : 'bg-secondary-400'}`}></div>
                                                        <span className="text-sm font-medium text-text-primary">
                                                            {session.device_info || 'Unknown Device'}
                                                        </span>
                                                    </div>
                                                    {session.is_active && (
                                                        <span className="text-xs text-success bg-success-50 px-2 py-1 rounded">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-2 text-xs text-secondary-600 space-y-1">
                                                    {session.ip_address && <p>IP: {session.ip_address}</p>}
                                                    {session.last_activity && (
                                                        <p>Last activity: {new Date(session.last_activity).toLocaleString()}</p>
                                                    )}
                                                    {session.user_agent && (
                                                        <p className="truncate" title={session.user_agent}>
                                                            {session.user_agent}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-secondary-600 text-sm">No active sessions found.</p>
                                )}
                            </div>
                        </div>

                        {/* Profile Form - Right Column */}
                        <div className="lg:col-span-8">
                            <div className="bg-surface border border-border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-text-primary">Profile Information</h3>
                                    <div className="text-xs text-secondary-500">
                                        <span className="bg-secondary-100 px-2 py-1 rounded">Editable: Full Name, Phone, Bio</span>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="full_name" className="block text-sm font-medium text-text-primary mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                id="full_name"
                                                name="full_name"
                                                type="text"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">
                                                Username
                                                <span className="text-xs text-secondary-500 ml-2">(Read-only)</span>
                                            </label>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                disabled={true}
                                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                                placeholder="Enter your username"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                                                Email Address
                                                <span className="text-xs text-secondary-500 ml-2">(Read-only)</span>
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={true}
                                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                    </div>

                                    {/* Professional Information - Read Only */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="job_title" className="block text-sm font-medium text-text-primary mb-2">
                                                Job Title
                                                <span className="text-xs text-secondary-500 ml-2">(Read-only)</span>
                                            </label>
                                            <input
                                                id="job_title"
                                                name="job_title"
                                                type="text"
                                                value={formData.job_title}
                                                onChange={handleInputChange}
                                                disabled={true}
                                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                                placeholder="Enter your job title"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
                                                Company
                                                <span className="text-xs text-secondary-500 ml-2">(Read-only)</span>
                                            </label>
                                            <input
                                                id="company"
                                                name="company"
                                                type="text"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                disabled={true}
                                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                                placeholder="Enter your company"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">
                                                Location
                                                <span className="text-xs text-secondary-500 ml-2">(Read-only)</span>
                                            </label>
                                            <input
                                                id="location"
                                                name="location"
                                                type="text"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                disabled={true}
                                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                                placeholder="Enter your location"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="website" className="block text-sm font-medium text-text-primary mb-2">
                                                Website
                                                <span className="text-xs text-secondary-500 ml-2">(Read-only)</span>
                                            </label>
                                            <input
                                                id="website"
                                                name="website"
                                                type="url"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                disabled={true}
                                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label htmlFor="bio" className="block text-sm font-medium text-text-primary mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={4}
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    {/* Preferences - Read Only */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="timezone" className="block text-sm font-medium text-text-primary mb-2">
                                                Timezone
                                                <span className="text-xs text-secondary-500 ml-2">(Read-only)</span>
                                            </label>
                                            <select
                                                id="timezone"
                                                name="timezone"
                                                value={formData.timezone}
                                                onChange={handleInputChange}
                                                disabled={true}
                                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                            >
                                                <option value="UTC">UTC</option>
                                                <option value="America/New_York">Eastern Time</option>
                                                <option value="America/Chicago">Central Time</option>
                                                <option value="America/Denver">Mountain Time</option>
                                                <option value="America/Los_Angeles">Pacific Time</option>
                                                <option value="Europe/London">London</option>
                                                <option value="Europe/Paris">Paris</option>
                                                <option value="Asia/Tokyo">Tokyo</option>
                                                <option value="Asia/Jakarta">Jakarta</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="language" className="block text-sm font-medium text-text-primary mb-2">
                                                Language
                                                <span className="text-xs text-secondary-500 ml-2">(Read-only)</span>
                                            </label>
                                            <select
                                                id="language"
                                                name="language"
                                                value={formData.language}
                                                onChange={handleInputChange}
                                                disabled={true}
                                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                            >
                                                <option value="en">English</option>
                                                <option value="id">Bahasa Indonesia</option>
                                                <option value="es">Español</option>
                                                <option value="fr">Français</option>
                                                <option value="de">Deutsch</option>
                                                <option value="ja">日本語</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Password Change Modal */}
            {showPasswordForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-text-primary">Change Password</h3>
                            <button
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordData({
                                        current_password: '',
                                        new_password: '',
                                        confirm_password: ''
                                    });
                                }}
                                className="text-secondary-500 hover:text-text-primary"
                            >
                                <Icon name="X" size={20} />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium text-text-primary mb-2">
                                    Current Password
                                </label>
                                <input
                                    id="current_password"
                                    name="current_password"
                                    type="password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    required
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div>
                                <label htmlFor="new_password" className="block text-sm font-medium text-text-primary mb-2">
                                    New Password
                                </label>
                                <input
                                    id="new_password"
                                    name="new_password"
                                    type="password"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    required
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirm_password" className="block text-sm font-medium text-text-primary mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    value={passwordData.confirm_password}
                                    onChange={handlePasswordChange}
                                    required
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswordData({
                                            current_password: '',
                                            new_password: '',
                                            confirm_password: ''
                                        });
                                    }}
                                    className="flex-1 px-4 py-2 bg-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-300 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
