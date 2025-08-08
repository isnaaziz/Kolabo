import React from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PageHeader from '../../components/ui/PageHeader';
import CommandPalette from '../../components/ui/CommandPalette';
import Icon from '../../components/AppIcon';
import {
    ProfilePhotoUpload,
    ProfileSummaryCard,
    QuickActions,
    ActiveSessions,
    ProfileForm,
    PasswordChangeModal,
    useProfileManagement
} from './components';

const UserProfile = () => {
    const {
        // State
        isEditing,
        isLoading,
        formData,
        passwordData,
        showPasswordForm,
        sessions,
        loadingSessions,
        profilePhoto,
        uploadingPhoto,
        deletingPhoto,

        // Handlers
        setIsEditing,
        setFormData,
        setPasswordData,
        setShowPasswordForm,
        handleInputChange,
        handleProfileUpdate,
        handlePhotoUpload,
        handlePhotoDelete,
        handlePasswordUpdate,
        loadUserSessions,
        getUserInitials,
        resetFormData,

        // User data
        user
    } = useProfileManagement();

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <Sidebar />
            <CommandPalette />

            {/* Main Content */}
            <main className="lg:ml-60 pt-16">
                <div className="p-6">
                    {/* Page Header */}
                    <PageHeader
                        title="User Profile"
                        subtitle="Manage your account settings and preferences"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Photo Upload & Summary */}
                        <div className="lg:col-span-1 space-y-6">
                            <ProfilePhotoUpload
                                profilePhoto={profilePhoto}
                                uploadingPhoto={uploadingPhoto}
                                deletingPhoto={deletingPhoto}
                                getUserInitials={getUserInitials}
                                handlePhotoUpload={handlePhotoUpload}
                                handlePhotoDelete={handlePhotoDelete}
                            />

                            <ProfileSummaryCard
                                user={user}
                                formData={formData}
                                getUserInitials={getUserInitials}
                            />

                            <QuickActions
                                setIsEditing={setIsEditing}
                                setShowPasswordForm={setShowPasswordForm}
                                loadUserSessions={loadUserSessions}
                            />
                        </div>

                        {/* Right Column - Forms & Sessions */}
                        <div className="lg:col-span-2 space-y-6">
                            <ProfileForm
                                isEditing={isEditing}
                                isLoading={isLoading}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleProfileUpdate={handleProfileUpdate}
                                setIsEditing={setIsEditing}
                                resetFormData={resetFormData}
                            />

                            <ActiveSessions
                                sessions={sessions}
                                loadingSessions={loadingSessions}
                                loadUserSessions={loadUserSessions}
                            />
                        </div>
                    </div>

                    {/* Password Change Modal */}
                    <PasswordChangeModal
                        showPasswordForm={showPasswordForm}
                        setShowPasswordForm={setShowPasswordForm}
                        passwordData={passwordData}
                        setPasswordData={setPasswordData}
                        handlePasswordChange={handlePasswordUpdate}
                        isLoading={isLoading}
                    />
                </div>
            </main>
        </div>
    );
};

export default UserProfile;