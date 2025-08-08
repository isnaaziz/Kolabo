import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordChangeModal = ({
    showPasswordForm,
    setShowPasswordForm,
    passwordData,
    setPasswordData,
    handlePasswordUpdate,
    handlePasswordChange,
    isLoading
}) => {
    const handleClose = () => {
        setShowPasswordForm(false);
        setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: ''
        });
    };

    if (!showPasswordForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                {/* Modal Header */}
                <div className="p-6 border-b border-border bg-gradient-to-r from-primary-50 to-primary-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-200 rounded-lg flex items-center justify-center">
                                <Icon name="Lock" size={20} className="text-primary-700" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-primary">Change Password</h3>
                                <p className="text-sm text-secondary-600">Update your account security</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-secondary-500 hover:text-text-primary hover:bg-secondary-200 p-2 rounded-lg transition-all duration-200"
                        >
                            <Icon name="X" size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <form onSubmit={handlePasswordUpdate} className="space-y-5">
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-text-primary mb-2">
                                <Icon name="Key" size={14} className="inline mr-1" />
                                Current Password
                            </label>
                            <input
                                id="current_password"
                                name="current_password"
                                type="password"
                                value={passwordData.current_password}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                placeholder="Enter your current password"
                            />
                        </div>

                        <div>
                            <label htmlFor="new_password" className="block text-sm font-medium text-text-primary mb-2">
                                <Icon name="Lock" size={14} className="inline mr-1" />
                                New Password
                            </label>
                            <input
                                id="new_password"
                                name="new_password"
                                type="password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                placeholder="Enter your new password"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-text-primary mb-2">
                                <Icon name="ShieldCheck" size={14} className="inline mr-1" />
                                Confirm New Password
                            </label>
                            <input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                value={passwordData.confirm_password}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                placeholder="Confirm your new password"
                            />
                        </div>

                        {/* Password Requirements */}
                        <div className="p-4 bg-secondary-50 rounded-lg">
                            <p className="text-sm font-medium text-secondary-700 mb-2 flex items-center">
                                <Icon name="Info" size={14} className="mr-1" />
                                Password Requirements
                            </p>
                            <ul className="text-xs text-secondary-600 space-y-1">
                                <li className="flex items-center">
                                    <Icon name="Check" size={12} className="mr-1 text-success" />
                                    At least 6 characters long
                                </li>
                                <li className="flex items-center">
                                    <Icon name="Check" size={12} className="mr-1 text-success" />
                                    Contains letters and numbers
                                </li>
                                <li className="flex items-center">
                                    <Icon name="Check" size={12} className="mr-1 text-success" />
                                    Different from current password
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-3 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Changing...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="Save" size={16} className="mr-2" />
                                        Change Password
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
