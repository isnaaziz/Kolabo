import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login after 3 seconds
        const timer = setTimeout(() => {
            navigate('/login-register');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Logged Out Successfully</h2>
                <p className="text-gray-600 mb-6">
                    You have been safely logged out of your account.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/login-register')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Login Again
                    </button>

                    <p className="text-sm text-gray-500">
                        Redirecting to login page in 3 seconds...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogoutPage;
