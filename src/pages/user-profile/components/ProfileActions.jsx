import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfileActions = ({
    isEditing,
    setIsEditing,
    isLoading,
    handleProfileUpdate,
    resetFormData
}) => {
    const handleCancel = () => {
        setIsEditing(false);
        resetFormData();
    };

    return (
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
                        onClick={handleCancel}
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
    );
};

export default ProfileActions;
