"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Activity,
  ShieldCheck,
  LayoutGrid,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] flex">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-surface-container border-r border-outline/10 hidden lg:flex flex-col sticky top-0 h-screen z-[60]">
        <div className="p-8 border-b border-outline/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
              <span className="text-white font-black text-xl italic">C</span>
            </div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-on-surface">Admin CP</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {[
            { label: 'Tổng quan', icon: LayoutGrid, path: '/admin' },
            { label: 'Phim & Video', icon: Film, path: '/admin/movies' },
            { label: 'Truyện tranh', icon: BookOpen, path: '/admin/manga' },
            { label: 'Truyện chữ', icon: FileText, path: '/admin/story' },
            { label: 'Người dùng', icon: Users, path: '/admin/users' },
            { label: 'Hệ thống', icon: Settings, path: '/admin/settings' },
          ].map((item) => {
            const isActive = item.path === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  isActive
                    ? "bg-primary-container text-white shadow-lg shadow-red-900/20"
                    : "text-on-surface/40 hover:text-on-surface hover:bg-surface-container-high"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-outline/10">
           <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all">
             <LogOut className="w-4 h-4" /> Đăng xuất
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-outline/10 bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-end px-12 gap-6">
           <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Super Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center font-black text-white shadow-lg">
                AD
              </div>
            </div>
          </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
