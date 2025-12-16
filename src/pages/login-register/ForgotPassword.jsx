import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import authService from '../../services/auth/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setIsSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to request password reset');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-border p-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <Icon name="Zap" size={24} color="white" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary">Kolabo</h1>
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary mb-2">Forgot Password</h2>
                    <p className="text-text-secondary">Enter your email to receive a reset link</p>
                </div>

                {isSuccess ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-success-50 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="CheckCircle" size={32} />
                        </div>
                        <p className="text-text-primary mb-6">
                            If an account exists with that email, we've sent password reset instructions.
                        </p>
                        <Link to="/login-register" className="text-primary hover:text-primary-700 font-medium">
                            Return to Login
                        </Link>
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
                            <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon name="Mail" size={18} className="text-text-tertiary" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary transition-all duration-200"
                                    placeholder="Enter your email"
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
                                <span>Send Reset Link</span>
                            )}
                        </button>

                        <div className="text-center">
                            <Link to="/login-register" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
