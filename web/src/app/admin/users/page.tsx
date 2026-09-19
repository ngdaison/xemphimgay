"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Search, Loader2, Shield, Ban, CheckCircle, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const { data: users, isLoading, mutate } = useSWR('admin_users', () => api.get('/admin/users').then(res => res.data));

  const filteredUsers = Array.isArray(users) ? users.filter((u: any) =>
    !search || u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const toggleBan = async (userId: string, isBanned: boolean) => {
    try {
      await api.post(`/admin/users/${userId}/ban`, { banned: !isBanned });
      mutate();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Quản lý Người dùng</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-1">Quản lý tài khoản và phân quyền</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm người dùng..."
            className="bg-zinc-900 border border-white/5 rounded-xl pl-12 pr-6 py-3 outline-none focus:border-primary-container text-sm font-bold w-80"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-32 flex justify-center"><Loader2 className="w-12 h-12 text-primary-container animate-spin" /></div>
      ) : (
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Người dùng</th>
                <th className="text-left p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email</th>
                <th className="text-left p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vai trò</th>
                <th className="text-left p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Trạng thái</th>
                <th className="text-right p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 overflow-hidden">
                        <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="font-bold text-sm text-white">{user.displayName || user.username}</span>
                    </div>
                  </td>
                  <td className="p-5 text-sm text-zinc-400 font-medium">{user.email}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role?.name === 'ADMIN' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                      {user.role?.name || 'USER'}
                    </span>
                  </td>
                  <td className="p-5">
                    {user.banned ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-red-500 uppercase tracking-widest"><Ban className="w-3 h-3" /> Bị khóa</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><CheckCircle className="w-3 h-3" /> Hoạt động</span>
                    )}
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => toggleBan(user.id, user.banned)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${user.banned ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                    >
                      {user.banned ? 'Mở khóa' : 'Khóa'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan={5} className="p-20 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">Không tìm thấy người dùng</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
