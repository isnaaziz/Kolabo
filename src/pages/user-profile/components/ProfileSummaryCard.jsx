import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfileSummaryCard = ({ formData = {}, user = {} }) => {
    return (
        <div className="bg-surface border border-border rounded-lg p-6 mt-6">
            <div className="text-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-text-primary mb-1">
                        {formData.full_name || 'No Name Set'}
                    </h3>
                    <p className="text-secondary-600 mb-2">@{formData.username || 'username'}</p>
                    {user?.role && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200">
                            <Icon name="Shield" size={14} className="mr-1" />
                            {user.role.toUpperCase()}
                        </span>
                    )}
                </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
                {formData.job_title && (
                    <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                        <div className="w-8 h-8 bg-secondary-200 rounded-lg flex items-center justify-center">
                            <Icon name="Briefcase" size={16} className="text-secondary-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-primary">{formData.job_title}</p>
                            <p className="text-xs text-secondary-500">Job Title</p>
                        </div>
                    </div>
                )}

                {formData.company && (
                    <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                        <div className="w-8 h-8 bg-secondary-200 rounded-lg flex items-center justify-center">
                            <Icon name="Building" size={16} className="text-secondary-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-primary">{formData.company}</p>
                            <p className="text-xs text-secondary-500">Company</p>
                        </div>
                    </div>
                )}

                {formData.location && (
                    <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                        <div className="w-8 h-8 bg-secondary-200 rounded-lg flex items-center justify-center">
                            <Icon name="MapPin" size={16} className="text-secondary-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-primary">{formData.location}</p>
                            <p className="text-xs text-secondary-500">Location</p>
                        </div>
                    </div>
                )}

                {formData.website && (
                    <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                        <div className="w-8 h-8 bg-secondary-200 rounded-lg flex items-center justify-center">
                            <Icon name="Globe" size={16} className="text-secondary-600" />
                        </div>
                        <div>
                            <a
                                href={formData.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary hover:text-primary-700 transition-colors duration-200"
                            >
                                {formData.website}
                            </a>
                            <p className="text-xs text-secondary-500">Website</p>
                        </div>
                    </div>
                )}

                {formData.phone && (
                    <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                        <div className="w-8 h-8 bg-secondary-200 rounded-lg flex items-center justify-center">
                            <Icon name="Phone" size={16} className="text-secondary-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-primary">{formData.phone}</p>
                            <p className="text-xs text-secondary-500">Phone</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bio Section */}
            {formData.bio && (
                <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mt-1">
                            <Icon name="FileText" size={16} className="text-primary-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-text-primary mb-2">About</h4>
                            <p className="text-secondary-600 text-sm leading-relaxed">{formData.bio}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Information */}
            <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center">
                    <Icon name="Info" size={16} className="mr-2" />
                    Account Information
                </h4>
                <div className="grid grid-cols-1 gap-3">
                    {user?.created_at && (
                        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Icon name="Calendar" size={14} className="text-secondary-600" />
                                <span className="text-sm text-secondary-600">Member since</span>
                            </div>
                            <span className="text-sm font-medium text-text-primary">
                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    )}
                    {user?.id && (
                        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Icon name="Hash" size={14} className="text-secondary-600" />
                                <span className="text-sm text-secondary-600">User ID</span>
                            </div>
                            <span className="text-sm font-mono text-text-primary bg-white px-2 py-1 rounded border">
                                {user.id.split('-')[0]}...
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSummaryCard;
