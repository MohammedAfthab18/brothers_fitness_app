import React, { useState, useEffect } from 'react';
import { Users, UserPlus, AlertCircle, Search, Plus } from 'lucide-react';
import StatsCard from './StatsCard';
import MembersTable from './MembersTable';
import AddMemberModal from './AddMemberModal';
import type { Member, DashboardStats } from '@shared/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeTrainers: 0,
    expiringSoon: 0,
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchQuery, members]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, membersData] = await Promise.all([
        window.electronAPI.getDashboardStats(),
        window.electronAPI.getMembers(),
      ]);
      setStats(statsData);
      setMembers(membersData);
      setFilteredMembers(membersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (data: any) => {
    await window.electronAPI.createMember(data);
    await loadData();
    setIsModalOpen(false);
  };

  const handleUpdateMember = async (data: any) => {
    await window.electronAPI.updateMember(data);
    await loadData();
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = async (id: number) => {
    await window.electronAPI.deleteMember(id);
    await loadData();
  };

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-apple-grey">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500">Overview of your gym members</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6">
          <StatsCard
            title="Total Members"
            value={stats.totalMembers}
            icon={<Users />}
            color="blue"
          />
          <StatsCard
            title="Active Trainers"
            value={stats.activeTrainers}
            icon={<UserPlus />}
            color="green"
          />
          <StatsCard
            title="Expiring Soon"
            value={stats.expiringSoon}
            icon={<AlertCircle />}
            color="orange"
          />
        </div>

        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-apple rounded-3xl shadow-apple border border-white/20 p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members by name..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Members Table */}
        <MembersTable
          members={filteredMembers}
          onEdit={handleEditClick}
          onDelete={handleDeleteMember}
        />

        {/* Floating Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-apple-blue text-white rounded-full shadow-apple-lg hover:shadow-apple hover:scale-105 transition-all flex items-center justify-center z-40"
          title="Add new member"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add/Edit Member Modal */}
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={editingMember ? handleUpdateMember : handleAddMember}
        editMember={editingMember}
      />
    </div>
  );
}