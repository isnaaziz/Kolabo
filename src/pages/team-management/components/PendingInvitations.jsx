import React from 'react';
import Icon from '../../../components/AppIcon';

const PendingInvitations = ({
  invites = [],
  loading = false,
  onResend = () => { },
  onRevoke = () => { }
}) => {
  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-8 text-center text-sm text-text-secondary">
        Loading invitations...
      </div>
    );
  }

  if (!invites.length) {
    return (
      <div className="bg-surface border border-border rounded-lg p-10 text-center">
        <p className="text-text-primary font-medium mb-2">No pending invitations</p>
        <p className="text-text-secondary mb-6 text-sm">All invitations have been accepted or expired</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-text-secondary uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left font-medium text-text-secondary uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left font-medium text-text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left font-medium text-text-secondary uppercase tracking-wider">Expires</th>
              <th className="px-6 py-3 text-right font-medium text-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invites.map(inv => (
              <tr key={inv.id} className="hover:bg-secondary-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-secondary-100 rounded-full flex items-center justify-center">
                      <Icon name="Mail" size={14} />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-text-primary">{inv.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{inv.role}</td>
                <td className="px-6 py-4 capitalize">{inv.status}</td>
                <td className="px-6 py-4">{inv.expires_at ? new Date(inv.expires_at).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onResend(inv.id)}
                      className="px-3 py-1 text-primary border border-primary rounded-lg hover:bg-primary-50 flex items-center"
                    >
                      <Icon name="RefreshCw" size={12} className="mr-1" />
                      Resend
                    </button>
                    {inv.token && (
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}/accept-invite?token=${inv.token}`;
                          navigator.clipboard.writeText(link);
                          alert('Link copied to clipboard');
                        }}
                        className="px-3 py-1 ml-2 text-secondary-600 border border-secondary-300 rounded-lg hover:bg-secondary-50 flex items-center"
                        title="Copy Link (Dev)"
                      >
                        <Icon name="Link" size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => onRevoke(inv.id)}
                      className="px-3 py-1 text-error border border-error rounded-lg hover:bg-error-50 flex items-center"
                    >
                      <Icon name="X" size={12} className="mr-1" />
                      Revoke
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden divide-y divide-border">
        {invites.map(inv => (
          <div key={inv.id} className="p-4">
            <div className="flex items-center mb-3">
              <div className="h-8 w-8 bg-secondary-100 rounded-full flex items-center justify-center">
                <Icon name="Mail" size={14} />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">{inv.email}</div>
                <div className="text-xs text-text-secondary">{inv.role}</div>
              </div>
            </div>
            <div className="flex justify-between text-xs mb-3">
              <span>Status: {inv.status}</span>
              <span>Exp: {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString() : '-'}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onResend(inv.id)}
                className="flex-1 py-2 text-primary border border-primary rounded-lg text-xs"
              >
                Resend
              </button>
              <button
                onClick={() => onRevoke(inv.id)}
                className="flex-1 py-2 text-error border border-error rounded-lg text-xs"
              >
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingInvitations;