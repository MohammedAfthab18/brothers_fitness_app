import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Member, PlanType } from '@shared/types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  editMember?: Member | null;
}

export default function AddMemberModal({ isOpen, onClose, onSubmit, editMember }: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    dob: '',
    plan: '1month' as PlanType,
    trainee: false,
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMember) {
      setFormData({
        name: editMember.name,
        age: editMember.age.toString(),
        address: editMember.address,
        dob: new Date(editMember.dob).toISOString().split('T')[0],
        plan: editMember.plan as PlanType,
        trainee: editMember.trainee,
        joinDate: new Date(editMember.joinDate).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        name: '',
        age: '',
        address: '',
        dob: '',
        plan: '1month',
        trainee: false,
        joinDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [editMember, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...(editMember && { id: editMember.id }),
        name: formData.name,
        age: parseInt(formData.age),
        address: formData.address,
        dob: new Date(formData.dob),
        plan: formData.plan,
        trainee: formData.trainee,
        joinDate: new Date(formData.joinDate),
      };

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white/90 backdrop-blur-apple rounded-3xl shadow-apple-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {editMember ? 'Edit Member' : 'Add New Member'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 outline-none transition-all"
              required
            />
          </div>

          {/* Age & DOB Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 outline-none transition-all"
                min="1"
                max="120"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 outline-none transition-all resize-none"
              rows={3}
              required
            />
          </div>

          {/* Plan & Join Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Plan *
              </label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value as PlanType })}
                className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 outline-none transition-all"
                required
              >
                <option value="1day">1 Day</option>
                <option value="1week">1 Week</option>
                <option value="1month">1 Month</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Join Date *
              </label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Trainee Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="trainee"
              checked={formData.trainee}
              onChange={(e) => setFormData({ ...formData, trainee: e.target.checked })}
              className="w-5 h-5 text-apple-blue border-gray-300 rounded focus:ring-apple-blue focus:ring-2"
            />
            <label htmlFor="trainee" className="text-sm font-medium text-gray-700">
              This member is a trainer
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-apple-blue text-white rounded-full font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-apple"
            >
              {loading ? 'Saving...' : editMember ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}