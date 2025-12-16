import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import teamService from '../../services/team/teamService';
import authService from '../../services/auth/authService';

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [step, setStep] = useState(1); // 1: Check token, 2: Form (if new user), 3: Success
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [inviteData, setInviteData] = useState(null);

    // Form for new users
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid invitation token');
        } else {
            // In a real flow, you might fetch invite details here if the API supported "get invite by token".
            // Assuming we just show the form directly. 
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const payload = {
                token,
                username,
                password,
                full_name: fullName
            };

            const response = await teamService.acceptInvite(payload);

            // Response typically contains tokens. Login user automatically.
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
                if (response.refresh_token) localStorage.setItem('refresh_token', response.refresh_token);
                if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
            }

            setStep(3);
            setTimeout(() => {
                navigate('/dashboard-overview');
            }, 2000);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to accept invitation');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-surface rounded-lg p-8 shadow text-center">
                    <Icon name="AlertTriangle" size={48} className="mx-auto text-error mb-4" />
                    <h2 className="text-xl font-bold mb-2">Invalid Invite</h2>
                    <p className="text-text-secondary">No invitation token was provided.</p>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-success-50 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="CheckCircle" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to the Team!</h2>
                    <p>Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-lg bg-surface rounded-2xl shadow-xl border border-border p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">Team Invitation</h1>
                    <p className="text-text-secondary">You've been invited to join a workspace on Kolabo.</p>
                </div>

                {error && (
                    <div className="p-4 bg-error-50 border border-error-200 rounded-lg flex items-center space-x-3 text-error-700 mb-6">
                        <Icon name="AlertCircle" size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="block w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                            placeholder="johndoe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                            placeholder="Choose a password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white rounded-full animate-spin text-transparent">...</div> : <span>Accept Invitation</span>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AcceptInvite;
