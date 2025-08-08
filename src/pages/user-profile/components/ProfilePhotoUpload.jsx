import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfilePhotoUpload = ({
    profilePhoto,
    uploadingPhoto = false,
    deletingPhoto = false,
    getUserInitials = () => 'U',
    handlePhotoUpload = () => { },
    handlePhotoDelete = () => { }
}) => {
    return (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
            {/* Hero Header */}
            <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600 relative">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="absolute bottom-4 left-6 text-white">
                    <h2 className="text-lg font-semibold">Profile Photo</h2>
                    <p className="text-sm opacity-90">Customize your avatar</p>
                </div>
            </div>

            <div className="p-6 pt-0">
                <div className="text-center -mt-16 mb-6">
                    {/* Profile Picture */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                        {profilePhoto ? (
                            <div className="relative group">
                                <img
                                    src={profilePhoto}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 flex items-center justify-center">
                                    <Icon name="Camera" size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </div>
                            </div>
                        ) : (
                            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                <span className="text-3xl font-bold text-primary-700">{getUserInitials()}</span>
                            </div>
                        )}

                        {/* Delete Photo Button */}
                        {profilePhoto && (
                            <button
                                onClick={handlePhotoDelete}
                                disabled={deletingPhoto}
                                className="absolute top-0 right-0 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:bg-error-600 transition-all duration-200 shadow-lg transform hover:scale-110 disabled:opacity-50 disabled:transform-none"
                                title="Remove photo"
                            >
                                {deletingPhoto ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Icon name="Trash2" size={14} />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Photo Upload Area */}
                    <div className="relative">
                        <label
                            htmlFor="photo-upload"
                            className={`
                                relative block w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                                ${uploadingPhoto
                                    ? 'border-secondary-300 bg-secondary-50 cursor-not-allowed'
                                    : 'border-primary-300 bg-primary-50 hover:border-primary-400 hover:bg-primary-100'
                                }
                            `}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add('border-primary-500', 'bg-primary-100');
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('border-primary-500', 'bg-primary-100');
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('border-primary-500', 'bg-primary-100');
                                const files = e.dataTransfer.files;
                                if (files.length > 0) {
                                    const event = { target: { files } };
                                    handlePhotoUpload(event);
                                }
                            }}
                        >
                            <div className="text-center">
                                {uploadingPhoto ? (
                                    <div className="space-y-3">
                                        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
                                        <div>
                                            <p className="text-primary-600 font-medium">Uploading your photo...</p>
                                            <p className="text-secondary-500 text-sm">Please wait while we process your image</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto">
                                            <Icon name="Upload" size={24} className="text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="text-primary-600 font-medium">
                                                {profilePhoto ? 'Change your photo' : 'Upload a profile photo'}
                                            </p>
                                            <p className="text-secondary-500 text-sm">
                                                Drag and drop an image here, or click to browse
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </label>

                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            disabled={uploadingPhoto}
                            className="hidden"
                        />
                    </div>

                    {/* Upload Guidelines */}
                    <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <Icon name="Info" size={16} className="text-secondary-500 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-secondary-700 mb-1">Photo Guidelines</p>
                                <ul className="text-xs text-secondary-600 space-y-1">
                                    <li>• JPG, PNG, or GIF format</li>
                                    <li>• Maximum size: 5MB</li>
                                    <li>• Recommended: Square images (1:1 ratio)</li>
                                    <li>• Minimum: 200x200 pixels</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePhotoUpload;
