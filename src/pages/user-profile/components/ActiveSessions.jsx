import React from 'react';
import Icon from '../../../components/AppIcon';

const ActiveSessions = ({ sessions, loadingSessions }) => {
    return (
        <div className="mt-6 bg-surface border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary flex items-center">
                    <Icon name="Shield" size={20} className="mr-2 text-success-600" />
                    Active Sessions
                </h3>
                <p className="text-sm text-secondary-600 mt-1">Monitor your login activity across devices</p>
            </div>

            <div className="p-4">
                {loadingSessions ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center space-y-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600 mx-auto"></div>
                            <p className="text-sm text-secondary-600">Loading session data...</p>
                        </div>
                    </div>
                ) : sessions.length > 0 ? (
                    <div className="space-y-3">
                        {sessions.map((session, index) => (
                            <div key={session.id || index} className={`
                                p-4 rounded-lg border transition-all duration-200 hover:shadow-md
                                ${session.is_active
                                    ? 'bg-success-50 border-success-200 hover:bg-success-100'
                                    : 'bg-secondary-50 border-secondary-200 hover:bg-secondary-100'
                                }
                            `}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                            ${session.is_active ? 'bg-success-200' : 'bg-secondary-200'}
                                        `}>
                                            <Icon
                                                name={session.device_info?.includes('Mobile') ? 'Smartphone' : 'Monitor'}
                                                size={18}
                                                className={session.is_active ? 'text-success-700' : 'text-secondary-600'}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h4 className="text-sm font-medium text-text-primary truncate">
                                                    {session.device_info || 'Unknown Device'}
                                                </h4>
                                                <div className={`
                                                    w-2 h-2 rounded-full flex-shrink-0
                                                    ${session.is_active ? 'bg-success-500' : 'bg-secondary-400'}
                                                `}></div>
                                            </div>

                                            <div className="space-y-1">
                                                {session.ip_address && (
                                                    <p className="text-xs text-secondary-600 flex items-center">
                                                        <Icon name="Globe" size={12} className="mr-1" />
                                                        IP: {session.ip_address}
                                                    </p>
                                                )}
                                                {session.last_activity && (
                                                    <p className="text-xs text-secondary-600 flex items-center">
                                                        <Icon name="Clock" size={12} className="mr-1" />
                                                        {new Date(session.last_activity).toLocaleString()}
                                                    </p>
                                                )}
                                                {session.user_agent && (
                                                    <p className="text-xs text-secondary-500 truncate max-w-xs" title={session.user_agent}>
                                                        <Icon name="Info" size={12} className="mr-1 inline" />
                                                        {session.user_agent}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {session.is_active && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 border border-success-200">
                                                <div className="w-1.5 h-1.5 bg-success-500 rounded-full mr-1 animate-pulse"></div>
                                                Current
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="Shield" size={32} className="text-secondary-500" />
                        </div>
                        <h4 className="text-sm font-medium text-text-primary mb-1">No Active Sessions</h4>
                        <p className="text-xs text-secondary-600">
                            No active login sessions found for your account.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveSessions;
