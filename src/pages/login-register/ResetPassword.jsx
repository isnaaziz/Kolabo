import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import authService from '../../services/auth/authService';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.resetPassword(token, password);
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/login-register');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Invalid Request</h2>
                    <p className="mb-4">No reset token provided.</p>
                    <Link to="/login-register" className="text-primary hover:underline">Return to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-border p-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <Icon name="Lock" size={24} color="white" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary">Kolabo</h1>
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary mb-2">Reset Password</h2>
                    <p className="text-text-secondary">Enter your new password below</p>
                </div>

                {isSuccess ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-success-50 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="CheckCircle" size={32} />
                        </div>
                        <p className="text-text-primary mb-2 font-medium">Password Reset Successful!</p>
                        <p className="text-text-secondary mb-6">Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-error-50 border border-error-200 rounded-lg flex items-center space-x-3 text-error-700">
                                <Icon name="AlertCircle" size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon name="Lock" size={18} className="text-text-tertiary" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary transition-all duration-200"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon name="Lock" size={18} className="text-text-tertiary" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary transition-all duration-200"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <span>Reset Password</span>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
