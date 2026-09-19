"use client";

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Film, 
  BookOpen, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { data, error, isLoading } = useSWR('admin_stats', () => api.get('/admin/stats').then(res => res.data));

  const stats = [
    { label: 'Tổng người dùng', value: data?.totalUsers?.toLocaleString() || '0', change: '+12%', trend: 'up', icon: Users, color: 'text-blue-500' },
    { label: 'Tổng lượt xem', value: data?.totalViews?.toLocaleString() || '0', change: '+24%', trend: 'up', icon: Eye, color: 'text-primary-container' },
    { label: 'Nội dung', value: data?.totalContents?.toLocaleString() || '0', change: '+5%', trend: 'up', icon: Film, color: 'text-purple-500' },
    { label: 'Băng thông', value: '750 Gbps', change: 'Mục tiêu', trend: 'up', icon: BookOpen, color: 'text-emerald-500' },
  ];

  const recentTranscodes = data?.recentTranscodes || [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight italic">Tổng quan hệ thống</h1>
          <p className="text-on-surface/40 font-bold mt-1 uppercase text-xs tracking-widest">Chào mừng trở lại, đây là những gì đang diễn ra hôm nay.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-outline/10 transition-all">
            Xuất báo cáo
          </button>
          <Link 
            href="/admin/content/new"
            className="bg-primary-container hover:bg-red-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20"
          >
            Thêm nội dung mới
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container/30 p-6 rounded-3xl border border-outline/10 space-y-4 hover:border-primary-container/30 transition-all group">
            <div className="flex items-center justify-between">
              <div className={cn("p-3 rounded-2xl bg-surface-container", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg",
                stat.trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <div>
              <p className="text-on-surface/40 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-on-surface mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transcodes */}
        <div className="lg:col-span-2 bg-surface-container/30 rounded-3xl border border-outline/10 overflow-hidden">
          <div className="p-6 border-b border-outline/10 flex items-center justify-between bg-surface-container/50">
            <h3 className="font-black uppercase tracking-tight text-on-surface flex items-center gap-2 italic">
              <Clock className="w-5 h-5 text-primary-container" />
              Xử lý Video gần đây
            </h3>
            <button className="text-[10px] font-black uppercase text-on-surface/40 hover:text-on-surface">Xem tất cả</button>
          </div>
          <div className="divide-y divide-outline/10">
            {recentTranscodes.map((item: any) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-surface-container/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface/40">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface group-hover:text-primary-container transition-colors">Tập {item.episodeNum} - {item.contentTitle}</h4>
                    <p className="text-[10px] font-bold text-on-surface/40 uppercase mt-1">Status: {item.status} • {item.quality}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-black text-on-surface">{item.progress}%</p>
                    <div className="w-32 h-1 bg-surface-container rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary-container transition-all" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase italic",
                    item.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                  )}>{item.status}</span>
                </div>
              </div>
            ))}
            {recentTranscodes.length === 0 && (
              <div className="py-20 text-center text-on-surface/20 font-black uppercase tracking-widest text-[10px]">
                Chưa có tiến trình xử lý nào
              </div>
            )}
          </div>
        </div>

        {/* Trending Content */}
        <div className="bg-surface-container/30 rounded-3xl border border-outline/10 overflow-hidden">
          <div className="p-6 border-b border-outline/10 bg-surface-container/50">
            <h3 className="font-black uppercase tracking-tight text-on-surface flex items-center gap-2 italic">
              <TrendingUp className="w-5 h-5 text-primary-container" />
              Top xu hướng
            </h3>
          </div>
          <div className="p-6 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-16 h-20 rounded-xl overflow-hidden flex-none border border-outline/10 group-hover:border-primary-container/50 transition-all">
                  <img src={`https://picsum.photos/seed/${i + 50}/200/300`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-on-surface truncate group-hover:text-primary-container transition-colors">Nội dung đề xuất {i}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500">
                      <Star className="w-3 h-3 fill-current" /> 9.5
                    </div>
                    <span className="text-[10px] font-bold text-on-surface/40">• 1.2M views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
