import { Edit2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { Member } from '@shared/types';
import {
  calculateDaysLeft,
  getDaysLeftColor,
  formatDate,
  getPlanDisplayName,
} from '../lib/dateUtils';

interface MembersTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: number) => void;
}

export default function MembersTable({ members, onEdit, onDelete }: MembersTableProps) {
  if (members.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-apple rounded-3xl shadow-apple border border-white/20 p-12 text-center">
        <p className="text-gray-500">No members found. Add your first member to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-apple rounded-3xl shadow-apple border border-white/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Age</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plan</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Join Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Days Left</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trainee</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => {
              const daysLeft = calculateDaysLeft(member.endDate);
              const colors = getDaysLeftColor(daysLeft);

              return (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{member.address}</div>
                  </td>

                  {/* Age */}
                  <td className="px-6 py-4 text-gray-600">{member.age}</td>

                  {/* Plan */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-apple-blue border border-blue-200">
                      {getPlanDisplayName(member.plan as any)}
                    </span>
                  </td>

                  {/* Join Date */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(member.joinDate)}
                  </td>

                  {/* End Date */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(member.endDate)}
                  </td>

                  {/* Days Left */}
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
                        colors.bg,
                        colors.text,
                        colors.border
                      )}
                    >
                      {daysLeft <= 0 ? 'Expired' : `${daysLeft} days`}
                    </span>
                  </td>

                  {/* Trainee */}
                  <td className="px-6 py-4">
                    {member.trainee && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200">
                        Trainer
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(member)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 hover:text-apple-blue"
                        title="Edit member"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${member.name}?`)) {
                            onDelete(member.id);
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded-xl transition-colors text-gray-600 hover:text-apple-red"
                        title="Delete member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}