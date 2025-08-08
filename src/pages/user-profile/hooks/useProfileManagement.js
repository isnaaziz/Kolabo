import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { useApiService } from '../../../hooks/useApiService';

export const useProfileManagement = () => {
    const { user, updateProfile } = useAuth();
    const { showSuccessToast, showErrorToast, showLoadingToast, removeToast } = useToast();
    const apiService = useApiService();

    // State management
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

    // Form handlers
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

    const resetFormData = () => {
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
    };

    return {
        // State
        isEditing,
        setIsEditing,
        isLoading,
        formData,
        passwordData,
        setPasswordData,
        showPasswordForm,
        setShowPasswordForm,
        sessions,
        loadingSessions,
        profilePhoto,
        uploadingPhoto,
        deletingPhoto,

        // Handlers
        setFormData,
        handleInputChange,
        handlePasswordChange,
        handleProfileUpdate,
        handlePasswordUpdate,
        handlePhotoUpload,
        handlePhotoDelete,
        loadUserSessions,
        getUserInitials,
        resetFormData,

        // User data
        user
    };
};
