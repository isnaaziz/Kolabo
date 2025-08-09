import React from 'react';
import Icon from '../../../components/AppIcon';

const StatCard = ({ icon, label, value, sub, color }) => (
    <div className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border shadow-sm hover:shadow-md transition group">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white ${color} shadow-inner`}>
            <Icon name={icon} size={22} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-text-secondary font-medium">{label}</p>
            <div className="flex items-end gap-2 mt-1">
                <span className="text-2xl font-semibold text-text-primary leading-none">{value}</span>
                {sub && <span className="text-[11px] px-1.5 py-0.5 rounded bg-secondary-100 text-secondary-600 font-medium">{sub}</span>}
            </div>
        </div>
    </div>
);

const TeamStats = ({ stats, loadingMembers, loadingInvites }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
                icon="Users"
                label="Total Members"
                value={loadingMembers ? '...' : stats.total}
                color="bg-primary-600"
            />
            <StatCard
                icon="Shield"
                label="Admins"
                value={loadingMembers ? '...' : stats.admins}
                sub={stats.total ? `${Math.round((stats.admins / stats.total) * 100)}%` : null}
                color="bg-accent-600"
            />
            <StatCard
                icon="Send"
                label="Pending Invites"
                value={loadingInvites ? '...' : stats.invites}
                color="bg-warning-600"
            />
        </div>
    );
};

export default TeamStats;
