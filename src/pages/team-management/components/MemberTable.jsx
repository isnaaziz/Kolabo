import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const roleColors = {
  admin: 'bg-primary-100 text-primary-700',
  member: 'bg-secondary-100 text-secondary-700',
  viewer: 'bg-accent-100 text-accent-700'
};

const MemberTable = ({
  members = [],
  loading = false,
  onUpdateRole,
  onRemove,
  searchQuery = ''
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'ascending'
  });

  // Hapus / tidak gunakan mock teamMembers agar tidak membingungkan (data asli datang via props)
  // const teamMembers = [...];

  // Helper avatar & status
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  // User profile memakai prefix http://localhost:3000 + path avatar_url
  const PROFILE_PREFIX = (API_BASE.replace(/\/api$/, '')) || 'http://localhost:3000';
  const DEFAULT_AVATAR = '/assets/images/no_image.png';
  const getAvatar = (m) => {
    const raw = m.avatar_url || m.avatar || m.photo_url || m.photo; // variasi kemungkinan
    if (!raw) return DEFAULT_AVATAR;
    if (raw.startsWith('http')) return raw;
    // Pastikan ada leading slash
    const path = raw.startsWith('/') ? raw : `/${raw}`;
    return `${PROFILE_PREFIX}${path}`;
  };
  const getStatusDotClass = (status) => {
    if (!status) return 'bg-secondary-300';
    const s = status.toString().toLowerCase();
    if (['online', 'active'].includes(s)) return 'bg-success';
    if (['away', 'idle'].includes(s)) return 'bg-warning';
    return 'bg-secondary-300';
  };

  // Ganti blok/filter lama yang memakai searchQuery (hapus yang lama jika ada)
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMembers = (members || []).filter(m => {
    if (!normalizedQuery) return true;
    return (
      (m.full_name && m.full_name.toLowerCase().includes(normalizedQuery)) ||
      (m.username && m.username.toLowerCase().includes(normalizedQuery)) ||
      (m.name && m.name.toLowerCase().includes(normalizedQuery)) ||
      (m.email && m.email.toLowerCase().includes(normalizedQuery))
    );
  });

  // Sort members based on sort config
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <Icon name="ArrowUpDown" size={14} className="ml-1 opacity-50" />;
    }
    return sortConfig.direction === 'ascending'
      ? <Icon name="ArrowUp" size={14} className="ml-1" />
      : <Icon name="ArrowDown" size={14} className="ml-1" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online': return 'bg-success';
      case 'Away': return 'bg-warning';
      case 'Offline': return 'bg-secondary-300';
      default: return 'bg-secondary-300';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-primary-100 text-primary-700';
      case 'Member': return 'bg-secondary-100 text-secondary-700';
      case 'Viewer': return 'bg-accent-100 text-accent-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-sm text-text-secondary">
        Loading members...
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className="p-10 text-center text-sm text-text-secondary bg-surface border border-border rounded-lg">
        No members found.
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="hidden md:block relative">
        <table className="w-full text-sm">
          <thead className="bg-secondary-50 border-b border-border sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-text-secondary uppercase tracking-wider w-1/3">
                <div className="flex items-center cursor-pointer select-none" onClick={() => requestSort('name')}>
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="px-6 py-3 text-left font-medium text-text-secondary uppercase tracking-wider w-40">
                <div className="flex items-center cursor-pointer select-none" onClick={() => requestSort('role')}>
                  <span>Role</span>
                  {getSortIcon('role')}
                </div>
              </th>
              <th className="px-6 py-3 text-left font-medium text-text-secondary uppercase tracking-wider w-40">
                <div className="flex items-center cursor-pointer select-none" onClick={() => requestSort('department')}>
                  <span>Department</span>
                  {getSortIcon('department')}
                </div>
              </th>
              <th className="px-6 py-3 text-left font-medium text-text-secondary uppercase tracking-wider w-32">
                <div className="flex items-center cursor-pointer select-none" onClick={() => requestSort('lastActive')}>
                  <span>Last Active</span>
                  {getSortIcon('lastActive')}
                </div>
              </th>
              <th className="px-6 py-3 text-left font-medium text-text-secondary uppercase tracking-wider w-28">
                <div className="flex items-center cursor-pointer select-none" onClick={() => requestSort('status')}>
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="px-4 py-3 text-right font-medium text-text-secondary uppercase tracking-wider w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m, idx) => {
              const initials = (m.full_name || m.username || m.name || '?')
                .split(' ')
                .map(p => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
              const match = searchQuery.toLowerCase();
              const displayName = m.full_name || m.username || m.name || '';
              const highlightedName = match
                ? displayName.replace(new RegExp(`(${match})`, 'ig'), '<mark class="bg-primary-100 text-primary-700 rounded px-0.5">$1</mark>')
                : displayName;
              const avatar = getAvatar(m);
              return (
                <tr key={m.id} className={`group transition-colors ${idx % 2 ? 'bg-secondary-50/40' : 'bg-white'} hover:bg-primary-50/60`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10">
                        {avatar ? (
                          <img src={avatar} alt={displayName} className="h-10 w-10 rounded-full object-cover ring-1 ring-primary-200 shadow-inner" onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR }} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center ring-1 ring-primary-200 shadow-inner">
                            {initials}
                          </div>
                        )}
                        <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${getStatusDotClass(m.status)}`}></span>
                      </div>
                      <div>
                        <div className="font-medium text-text-primary" dangerouslySetInnerHTML={{ __html: highlightedName }} />
                        {m.username && <div className="text-xs text-text-secondary">@{m.username}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="text-xs px-2 py-1 border border-border rounded bg-white focus:ring-primary-500 focus:border-primary-500"
                      value={m.role}
                      onChange={(e) => onUpdateRole(m.id, e.target.value)}
                    >
                      <option value="admin">admin</option>
                      <option value="member">member</option>
                      <option value="viewer">viewer</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-secondary-100 text-secondary-700 capitalize`}> {m.role}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-text-secondary">{m.last_active || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className={`h-2.5 w-2.5 rounded-full ${getStatusDotClass(m.status)} shadow`} />
                      {m.status || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onRemove(m.id)}
                        className="px-2 py-1 text-error border border-error/50 rounded-lg hover:bg-error-50 text-xs flex items-center gap-1 hover:shadow-sm"
                      >
                        <Icon name="Trash" size={12} />
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {sortedMembers.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Users" size={48} color="#CBD5E1" className="mx-auto mb-4" />
            <p className="text-text-secondary">No team members found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedMembers.map((member) => {
              const avatar = getAvatar(member);
              return (
                <div key={member.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {avatar ? (
                          <img src={avatar} alt={member.name || member.username} className="h-10 w-10 rounded-full object-cover" onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR }} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center">
                            {(member.full_name || member.username || '?').slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusDotClass(member.status)}`}></div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-text-primary">{member.full_name || member.username || member.name}</div>
                        {(member.email || member.username) && <div className="text-xs text-text-secondary">{member.email || '@' + member.username}</div>}
                      </div>
                    </div>
                    <button className="p-1 text-secondary-600 hover:text-primary transition-colors duration-200">
                      <Icon name="MoreVertical" size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-text-secondary">Role</span>
                      <span className={`mt-1 px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full w-fit ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-secondary">Department</span>
                      <span className="text-text-primary">{member.department}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-secondary">Last Active</span>
                      <span className="text-text-primary">{member.lastActive}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-secondary">Status</span>
                      <div className="flex items-center mt-1">
                        <div className={`h-2 w-2 rounded-full ${getStatusDotClass(member.status)} mr-1.5`}></div>
                        <span className="text-text-primary">{member.status || '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="p-1.5 text-secondary-600 hover:text-primary transition-colors duration-200 bg-secondary-50 rounded-full">
                      <Icon name="Edit" size={14} />
                    </button>
                    <button className="p-1.5 text-secondary-600 hover:text-primary transition-colors duration-200 bg-secondary-50 rounded-full">
                      <Icon name="Shield" size={14} />
                    </button>
                    <button className="p-1.5 text-error-600 hover:text-error transition-colors duration-200 bg-error-50 rounded-full">
                      <Icon name="UserMinus" size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} color="#CBD5E1" className="mx-auto mb-4" />
          <p className="text-text-primary font-medium mb-2">No team members found</p>
          <p className="text-text-secondary mb-6">Try adjusting your search or filter criteria</p>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberTable;