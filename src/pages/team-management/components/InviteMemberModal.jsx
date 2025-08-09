import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const InviteMemberModal = ({ isOpen, onClose, onInvite, submitting }) => {
  const [emails, setEmails] = useState('');
  const [selectedRole, setSelectedRole] = useState('Member');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const modalRef = useRef(null);

  const roleOptions = [
    { value: 'Admin', label: 'Admin', description: 'Full access' },
    { value: 'Member', label: 'Member', description: 'Standard access' },
    { value: 'Viewer', label: 'Viewer', description: 'Read-only' }
  ];

  const defaultMessage = `Hi there,

I'd like to invite you to join our Kolabo workspace.`;

  useEffect(() => {
    if (isOpen) {
      setMessage(defaultMessage);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmails = (value) => {
    const list = value.split(',').map(e => e.trim()).filter(Boolean);
    if (!list.length) {
      setEmailError('At least one email required');
      return false;
    }
    const invalid = list.filter(e => !emailRegex.test(e));
    if (invalid.length) {
      setEmailError(`Invalid: ${invalid.join(', ')}`);
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmails(emails)) return;

    const list = emails.split(',').map(e => e.trim()).filter(Boolean);
    for (const email of list) {
      await onInvite({
        email,
        role: selectedRole.toLowerCase(),
        note: message,
        redirect_url: window.location.origin + '/login-register'
      });
    }
    setEmails('');
    setSelectedRole('Member');
    setMessage(defaultMessage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-200 flex items-center justify-center p-4">
      <div ref={modalRef} className="w-full max-w-2xl bg-surface rounded-lg shadow-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Invite Team Members</h2>
          <button onClick={onClose} className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg">
            <Icon name="X" size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="emails">Email Addresses</label>
              <input
                id="emails"
                type="text"
                value={emails}
                onChange={(e) => { setEmails(e.target.value); if (emailError) validateEmails(e.target.value); }}
                placeholder="user1@example.com, user2@example.com"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 ${emailError ? 'border-error' : 'border-border'}`}
              />
              {emailError && <p className="mt-2 text-sm text-error">{emailError}</p>}
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Role</p>
              <div className="space-y-3">
                {roleOptions.map(r => (
                  <div
                    key={r.value}
                    className={`p-3 border rounded-lg cursor-pointer ${selectedRole === r.value ? 'border-primary bg-primary-50' : 'border-border hover:bg-secondary-50'}`}
                    onClick={() => setSelectedRole(r.value)}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="role"
                        className="mt-1"
                        checked={selectedRole === r.value}
                        onChange={() => setSelectedRole(r.value)}
                      />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${selectedRole === r.value ? 'text-primary' : ''}`}>{r.label}</p>
                        <p className="text-xs text-text-secondary mt-1">{r.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="message">Invitation Message</label>
              <textarea
                id="message"
                rows={4}
                className="w-full border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-500"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-end p-6 border-t border-border bg-secondary-50 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {submitting && <span className="h-4 w-4 border-2 border-white border-b-transparent rounded-full animate-spin"></span>}
              <span>Send Invitations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;