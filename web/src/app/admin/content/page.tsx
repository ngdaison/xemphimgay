"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  FileVideo, 
  BookOpen,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminContentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, error, isLoading, mutate } = useSWR('admin_content', () => api.get('/admin/contents').then(res => res.data));

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa nội dung này?')) {
      try {
        await api.delete(`/admin/contents/${id}`);
        mutate();
      } catch (err) {
        alert('Lỗi khi xóa nội dung');
      }
    }
  };

  return (
    <div className="space-y-8 font-['Be_Vietnam_Pro']">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight italic">Quản lý nội dung</h1>
          <p className="text-zinc-500 font-bold mt-1 uppercase text-xs tracking-widest">Danh sách tất cả phim, anime, truyện và manga.</p>
        </div>
        <button className="bg-primary-container hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-red-900/20 flex items-center gap-3">
          <Plus className="w-5 h-5" />
          THÊM NỘI DUNG
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-primary-container transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tiêu đề, slug..." 
            className="w-full bg-white/5 border border-white/5 focus:border-primary-container/30 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all">
            <Filter className="w-4 h-4" />
            Bộ lọc
          </button>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Nội dung</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Loại</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Trạng thái</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Lượt xem</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary-container" />
                    <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest mt-4">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : data?.data?.map((item: any) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/5 flex-none">
                        <img src={item.posterUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-white truncate group-hover:text-primary-container transition-colors uppercase italic tracking-tighter">{item.title}</h4>
                        <p className="text-[10px] font-bold text-zinc-600 truncate mt-1">Slug: {item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {item.type === 'MOVIE' || item.type === 'ANIME' || item.type === 'VIDEO' ? (
                         <FileVideo className="w-4 h-4 text-blue-500" />
                       ) : (
                         <BookOpen className="w-4 h-4 text-emerald-500" />
                       )}
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      item.status === 'PUBLISHED' ? "bg-emerald-500/10 text-emerald-500" : 
                      item.status === 'DRAFT' ? "bg-zinc-500/10 text-zinc-500" : "bg-red-500/10 text-red-500"
                    )}>
                       {item.status === 'PUBLISHED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                       {item.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs font-bold text-zinc-400">
                    {item.viewCount?.toLocaleString() || 0}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-red-500/10 rounded-xl text-zinc-500 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
