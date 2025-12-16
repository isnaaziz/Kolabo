// src/pages/team-management/index.jsx
import React, { useState, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CommandPalette from '../../components/ui/CommandPalette';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/AppIcon';
import MemberTable from './components/MemberTable';
import PendingInvitations from './components/PendingInvitations';
import InviteMemberModal from './components/InviteMemberModal';
import WorkspaceSettings from './components/WorkspaceSettings';
import IntegrationSettings from './components/IntegrationSettings';
import ActivityLog from './components/ActivityLog';
import { useTeam } from '../../hooks/useTeam';
import TeamStats from './components/TeamStats';

const TeamManagement = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');
  const {
    members,
    invites,
    loadingMembers,
    loadingInvites,
    submitting,
    inviteMember,
    revokeInvite,
    updateRole,
    removeMember,
    refreshMembers,
    refreshInvites,
    resendInvite
  } = useTeam();

  // Hitung jumlah yang dipakai stats agar tidak dihitung berulang
  const stats = useMemo(() => {
    const total = members.length;
    const admins = members.filter(m => m.role === 'admin').length;
    return { total, admins, invites: invites.length };
  }, [members, invites]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <CommandPalette />
      <main className="pt-16 lg:pl-60">
        <div className="p-6 space-y-6">
          <PageHeader
            title="Team Management"
            subtitle="Kelola anggota tim, undangan, serta aktivitas workspace Anda"
            actions={
              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 w-60 text-sm rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="h-10 px-4 bg-primary text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 shadow-sm transition"
                >
                  <Icon name="UserPlus" size={16} />
                  <span className="hidden sm:inline">Invite Member</span>
                </button>
                <button
                  onClick={() => { refreshMembers(); refreshInvites(); }}
                  className="h-10 w-10 flex items-center justify-center border border-border rounded-lg hover:bg-secondary-100 transition"
                  title="Refresh"
                >
                  <Icon name="RefreshCw" size={16} />
                </button>
              </div>
            }
          />

          <TeamStats stats={stats} loadingMembers={loadingMembers} loadingInvites={loadingInvites} />

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border/70">
            {[
              { id: 'members', label: 'Team Members', badge: null },
              { id: 'pending', label: 'Pending Invitations', badge: invites.length },
              { id: 'activity', label: 'Activity', badge: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-t-lg text-sm font-medium transition-colors group ${activeTab === tab.id
                  ? 'text-primary bg-primary-50'
                  : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className={`ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[11px] rounded-full font-medium ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-secondary-200 text-secondary-700'}`}>{tab.badge}</span>
                ) : null}
                {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {activeTab === 'members' && (
              <MemberTable
                members={members}
                loading={loadingMembers}
                onUpdateRole={updateRole}
                onRemove={removeMember}
                searchQuery={searchQuery}
              />
            )}
            {activeTab === 'pending' && (
              <PendingInvitations
                invites={invites}
                loading={loadingInvites}
                onRevoke={revokeInvite}
                onResend={resendInvite}
              />
            )}
            {activeTab === 'activity' && <ActivityLog />}
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WorkspaceSettings />
            <IntegrationSettings />
          </div>
        </div>
      </main>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={inviteMember}
        submitting={submitting}
      />
    </div>
  );
};

export default TeamManagement;