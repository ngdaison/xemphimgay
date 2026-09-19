"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, safeStorage } from '@/lib/utils';

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Trang chủ', icon: 'home', path: '/' },
    { label: 'Khám phá', icon: 'explore', path: '/search' },
    { label: 'Thư viện', icon: 'video_library', path: '/history' },
    { label: 'Tài khoản', icon: 'person', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full rounded-t-[32px] z-50 bg-surface/80 backdrop-blur-xl border-t border-outline/10 shadow-2xl flex justify-around items-center h-20 pb-2 px-4 lg:hidden">
      {navItems.map((item) => {
        const isActive = item.path === '/'
          ? pathname === '/'
          : pathname === item.path || pathname.startsWith(item.path + '/') || (pathname.startsWith('/contents/') && safeStorage.get('last_section') === item.path);
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-300 tap-highlight-transparent relative",
              isActive ? "text-primary-container scale-110" : "text-zinc-500 hover:text-zinc-200"
            )}
          >
            <span 
              className="material-symbols-outlined mb-1 text-[28px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400" }}
            >
              {item.icon}
            </span>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest transition-all",
              isActive ? "opacity-100" : "opacity-0"
            )}>
              {item.label}
            </span>
            {isActive && (
               <div className="absolute -bottom-2 w-1 h-1 bg-primary-container rounded-full shadow-[0_0_10px_rgba(229,9,20,1)]"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
