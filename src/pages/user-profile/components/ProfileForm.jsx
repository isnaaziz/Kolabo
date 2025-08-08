import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfileForm = ({
    formData = {},
    isEditing = false,
    isLoading = false,
    handleInputChange = () => { },
    handleProfileUpdate = () => { },
    setIsEditing = () => { },
    resetFormData = () => { }
}) => {
    return (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
            {/* Form Header */}
            <div className="p-6 bg-gradient-to-r from-secondary-50 to-secondary-100 border-b border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-text-primary flex items-center">
                            <Icon name="User" size={24} className="mr-3 text-primary" />
                            Profile Information
                        </h3>
                        <p className="text-sm text-secondary-600 mt-1">Manage your personal details and preferences</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="text-xs bg-secondary-200 text-secondary-700 px-3 py-1 rounded-full font-medium">
                            Editable: Full Name, Phone, Bio
                        </div>
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                            >
                                <Icon name="Edit" size={16} />
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        resetFormData();
                                    }}
                                    className="px-4 py-2 bg-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-300 transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <Icon name="X" size={16} />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleProfileUpdate}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="Save" size={16} />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6">
                <form onSubmit={handleProfileUpdate} className="space-y-8">
                    {/* Basic Information Section */}
                    <div>
                        <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                            <Icon name="UserCheck" size={18} className="mr-2 text-primary" />
                            Basic Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="full_name" className="block text-sm font-medium text-text-primary mb-2">
                                    <Icon name="User" size={14} className="inline mr-1" />
                                    Full Name
                                </label>
                                <input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500 transition-all duration-200"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">
                                    <Icon name="AtSign" size={14} className="inline mr-1" />
                                    Username
                                    <span className="text-xs text-secondary-500 ml-2 bg-secondary-100 px-2 py-0.5 rounded">(Read-only)</span>
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    disabled={true}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                                    <Icon name="Mail" size={14} className="inline mr-1" />
                                    Email Address
                                    <span className="text-xs text-secondary-500 ml-2 bg-secondary-100 px-2 py-0.5 rounded">(Read-only)</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    disabled={true}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                                    <Icon name="Phone" size={14} className="inline mr-1" />
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500 transition-all duration-200"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Information Section */}
                    <div className="pt-6 border-t border-border">
                        <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                            <Icon name="Briefcase" size={18} className="mr-2 text-primary" />
                            Professional Information
                            <span className="text-xs text-secondary-500 ml-2 bg-secondary-100 px-3 py-1 rounded-full">(Read-only)</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="job_title" className="block text-sm font-medium text-text-primary mb-2">
                                    <Icon name="Briefcase" size={14} className="inline mr-1" />
                                    Job Title
                                </label>
                                <input
                                    id="job_title"
                                    name="job_title"
                                    type="text"
                                    value={formData.job_title}
                                    disabled={true}
                                    className="w-full px-4 py-3 border border-border rounded-lg disabled:bg-secondary-50 disabled:text-secondary-500"
                                    placeholder="Enter your job title"
                                />
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
                                    <Icon name="Building" size={14} className="inline mr-1" />
                                    Company
                                </label>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    value={formData.company}
                                    disabled={true}
                                    className="w-full px-4 py-3 border border-border rounded-lg disabled:bg-secondary-50 disabled:text-secondary-500"
                                    placeholder="Enter your company"
                                />
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">
                                    <Icon name="MapPin" size={14} className="inline mr-1" />
                                    Location
                                </label>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={formData.location}
                                    disabled={true}
                                    className="w-full px-4 py-3 border border-border rounded-lg disabled:bg-secondary-50 disabled:text-secondary-500"
                                    placeholder="Enter your location"
                                />
                            </div>

                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-text-primary mb-2">
                                    <Icon name="Globe" size={14} className="inline mr-1" />
                                    Website
                                </label>
                                <input
                                    id="website"
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    disabled={true}
                                    className="w-full px-4 py-3 border border-border rounded-lg disabled:bg-secondary-50 disabled:text-secondary-500"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="pt-6 border-t border-border">
                        <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                            <Icon name="FileText" size={18} className="mr-2 text-primary" />
                            About You
                        </h4>
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-text-primary mb-2">
                                <Icon name="FileText" size={14} className="inline mr-1" />
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={5}
                                value={formData.bio}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500 transition-all duration-200 resize-none"
                                placeholder="Tell us about yourself, your interests, and what you're working on..."
                            />
                            <p className="text-xs text-secondary-500 mt-2">
                                Share a bit about yourself, your role, and what drives you professionally.
                            </p>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="pt-6 border-t border-border">
                        <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                            <Icon name="Settings" size={18} className="mr-2 text-primary" />
                            Preferences
                            <span className="text-xs text-secondary-500 ml-2 bg-secondary-100 px-3 py-1 rounded-full">(Read-only)</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="timezone" className="block text-sm font-medium text-text-primary mb-2">
                                    <Icon name="Clock" size={14} className="inline mr-1" />
                                    Timezone
                                </label>
                                <select
                                    id="timezone"
                                    name="timezone"
                                    value={formData.timezone}
                                    disabled={true}
                                    className="w-full px-4 py-3 border border-border rounded-lg disabled:bg-secondary-50 disabled:text-secondary-500"
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
                                    <Icon name="Languages" size={14} className="inline mr-1" />
                                    Language
                                </label>
                                <select
                                    id="language"
                                    name="language"
                                    value={formData.language}
                                    disabled={true}
                                    className="w-full px-4 py-3 border border-border rounded-lg disabled:bg-secondary-50 disabled:text-secondary-500"
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
