import { useCallback, useEffect, useState } from 'react';
import { teamService } from '../services/team/teamService';
import { useToast } from '../contexts/ToastContext';

export const useTeam = () => {
    const { showSuccessToast, showErrorToast, showLoadingToast, removeToast } = useToast();
    const [members, setMembers] = useState([]);
    const [invites, setInvites] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [loadingInvites, setLoadingInvites] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchMembers = useCallback(async () => {
        setLoadingMembers(true);
        try {
            const data = await teamService.listMembers();
            setMembers(data);
        } catch (e) {
            showErrorToast(e.message || 'Failed to load members');
        } finally {
            setLoadingMembers(false);
        }
    }, [showErrorToast]);

    const fetchInvites = useCallback(async () => {
        setLoadingInvites(true);
        try {
            const data = await teamService.listInvites({ status: 'pending' });
            setInvites(data);
        } catch (e) {
            showErrorToast(e.message || 'Failed to load invites');
        } finally {
            setLoadingInvites(false);
        }
    }, [showErrorToast]);

    const inviteMember = async (payload) => {
        let toastId = showLoadingToast('Sending invitation...');
        setSubmitting(true);
        try {
            const res = await teamService.inviteMember(payload);
            removeToast(toastId);
            if (res.directAssigned) {
                showSuccessToast('User role assigned directly');
            } else {
                showSuccessToast('Invitation sent');
            }
            fetchInvites();
            fetchMembers(); // role changes possible
            return res;
        } catch (e) {
            removeToast(toastId);
            showErrorToast(e.message || 'Invitation failed');
            throw e;
        } finally {
            setSubmitting(false);
        }
    };

    const revokeInvite = async (inviteId) => {
        let toastId = showLoadingToast('Revoking invite...');
        try {
            await teamService.revokeInvite(inviteId);
            removeToast(toastId);
            showSuccessToast('Invite revoked');
            setInvites(prev => prev.filter(i => i.id !== inviteId));
        } catch (e) {
            removeToast(toastId);
            showErrorToast(e.message || 'Failed to revoke');
        }
    };

    const updateRole = async (userId, role) => {
        let toastId = showLoadingToast('Updating role...');
        try {
            await teamService.updateRole(userId, role);
            removeToast(toastId);
            showSuccessToast('Role updated');
            setMembers(prev => prev.map(m => m.id === userId ? { ...m, role } : m));
        } catch (e) {
            removeToast(toastId);
            showErrorToast(e.message || 'Role update failed');
        }
    };

    const removeMember = async (userId) => {
        let toastId = showLoadingToast('Removing member...');
        try {
            await teamService.removeMember(userId);
            removeToast(toastId);
            showSuccessToast('Member removed');
            setMembers(prev => prev.filter(m => m.id !== userId));
        } catch (e) {
            removeToast(toastId);
            showErrorToast(e.message || 'Remove failed');
        }
    };

    useEffect(() => {
        fetchMembers();
        fetchInvites();
    }, [fetchMembers, fetchInvites]);

    return {
        members,
        invites,
        loadingMembers,
        loadingInvites,
        submitting,
        inviteMember,
        revokeInvite,
        updateRole,
        removeMember,
        resendInvite: async (inviteId) => {
            let toastId = showLoadingToast('Resending invite...');
            try {
                const res = await teamService.resendInvite(inviteId);
                removeToast(toastId);
                showSuccessToast('Invite resent (new token generated)');
                fetchInvites(); // Token changes
                return res;
            } catch (e) {
                removeToast(toastId);
                showErrorToast(e.message || 'Resend failed');
            }
        },
        refreshMembers: fetchMembers,
        refreshInvites: fetchInvites
    };
};