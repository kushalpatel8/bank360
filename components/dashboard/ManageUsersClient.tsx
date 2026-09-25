"use client";

import { Users, Search, Filter, MoreVertical, Edit, Shield, Activity, Calendar, X, Trash2, Check, UserCog } from "lucide-react";
import { useState } from "react";

import { updateUserProfile } from "@/app/actions/user";

export function ManageUsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setIsSaving(true);
    
    // Call server action to update Clerk Database
    const res = await updateUserProfile(editingUser.id, {
      name: editingUser.name,
      role: editingUser.role,
      status: editingUser.status
    });

    if (res.success) {
      // Update local state for immediate feedback
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    } else {
      alert("Failed to update user in the database.");
    }
    
    setIsSaving(false);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    setEditingUser(null);
  };

  return (
    <div className="bg-[#EDF2F7] min-h-[calc(100vh-4rem)] p-8 -m-8 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A365D] mb-2">User Management</h1>
            <p className="text-[#4A5568]">Manage internal banking staff, their roles, and access controls.</p>
          </div>
          <button className="bg-[#2B6CB0] hover:bg-[#1A365D] text-[#FFFFFF] px-5 py-2.5 rounded-md text-sm font-bold transition-all shadow-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            Invite Employee
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Total Employees", value: users.length, icon: Users, color: "text-[#2B6CB0]", bg: "bg-[#2B6CB0]/10" },
            { label: "Active Roles", value: "3", icon: Shield, color: "text-[#1A365D]", bg: "bg-[#1A365D]/10" },
            { label: "Pending Invites", value: "0", icon: Calendar, color: "text-[#4A5568]", bg: "bg-[#CBD5E0]/50" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6 flex items-center gap-4 shadow-sm">
              <div className={`w-14 h-14 rounded-md flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[#4A5568] text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-[#FFFFFF] mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#CBD5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#EDF2F7]/50">
            <div className="relative max-w-md w-full">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5568]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employees by name or email..." 
                className="w-full bg-[#FFFFFF] border border-[#CBD5E0] rounded-md pl-10 pr-4 py-2 text-[#FFFFFF] placeholder:text-[#4A5568] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0] transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A365D] border-b border-[#CBD5E0]">
                  <th className="p-4 text-sm font-bold text-[#FFFFFF]">Employee</th>
                  <th className="p-4 text-sm font-bold text-[#FFFFFF]">Role</th>
                  <th className="p-4 text-sm font-bold text-[#FFFFFF]">Status</th>
                  <th className="p-4 text-sm font-bold text-[#FFFFFF] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E0]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#4A5568]">No employees found matching your search.</td>
                  </tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#EDF2F7]/80 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.imageUrl ? (
                          <img src={user.imageUrl} alt={user.name} className="w-10 h-10 rounded-full border border-[#CBD5E0]" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#EDF2F7] border border-[#CBD5E0] flex items-center justify-center text-[#1A365D] font-bold text-sm">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-[#0D1117] font-bold">{user.name}</p>
                          <p className="text-[#4A5568] text-xs font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[#4A5568] text-sm font-bold">{user.role || "No Role"}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        user.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-[#4A5568] border-[#CBD5E0]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-[#4A5568]'}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setEditingUser({ ...user })}
                        className="px-3 py-1.5 text-[#2B6CB0] hover:bg-[#2B6CB0]/10 rounded-md transition-colors flex items-center gap-2 ml-auto border border-transparent hover:border-[#2B6CB0]/20"
                      >
                        <UserCog className="w-4 h-4" />
                        <span className="text-sm font-bold">Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1117]/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6 max-w-md w-full shadow-2xl relative">
              <button 
                onClick={() => setEditingUser(null)}
                className="absolute top-6 right-6 text-[#4A5568] hover:text-[#FFFFFF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-[#1A365D] mb-6">Manage Employee</h3>
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="block text-[#4A5568] text-sm font-bold mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={editingUser.name} 
                    onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full bg-[#FFFFFF] border border-[#CBD5E0] rounded-md px-4 py-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#4A5568] text-sm font-bold mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    value={editingUser.email} 
                    onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full bg-[#FFFFFF] border border-[#CBD5E0] rounded-md px-4 py-2.5 text-[#0D1117] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#4A5568] text-sm font-bold mb-1.5">System Role</label>
                  <select 
                    value={editingUser.role} 
                    onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                    className="w-full bg-[#FFFFFF] border border-[#CBD5E0] rounded-md px-4 py-2.5 text-[#0D1117] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]"
                  >
                    <option value="relationship_manager">Relationship Manager</option>
                    <option value="analyst">Analyst</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#4A5568] text-sm font-bold mb-1.5">Account Status</label>
                  <select 
                    value={editingUser.status} 
                    onChange={e => setEditingUser({...editingUser, status: e.target.value})}
                    className="w-full bg-[#FFFFFF] border border-[#CBD5E0] rounded-md px-4 py-2.5 text-[#0D1117] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3 border-t border-[#CBD5E0] mt-6">
                  <button 
                    type="button" 
                    onClick={() => handleDelete(editingUser.id)}
                    className="px-4 py-2.5 border border-[#CBD5E0] text-[#4A5568] hover:bg-[#EDF2F7] hover:text-[#0D1117] rounded-md font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 bg-[#2B6CB0] hover:bg-[#1A365D] disabled:opacity-50 text-[#FFFFFF] rounded-md font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
