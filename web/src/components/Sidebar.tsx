"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, safeStorage } from '@/lib/utils';

const navItems = [
  { icon: 'home', label: 'Trang chủ', href: '/', fill: true },
  { icon: 'trending_up', label: 'Thịnh hành', href: '/trending' },
  { icon: 'movie', label: 'Phim', href: '/phim' },
  { icon: 'animation', label: 'Anime', href: '/anime' },
  { icon: 'menu_book', label: 'Truyện tranh', href: '/truyen-tranh' },
  { icon: 'auto_stories', label: 'Truyện chữ', href: '/truyen-chu' },
];

const secondaryItems = [
  { icon: 'history', label: 'Lịch sử', href: '/history' },
  { icon: 'favorite', label: 'Đang theo dõi', href: '/following' },
  { icon: 'settings', label: 'Cài đặt', href: '/settings' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(!isOpen);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, [isOpen]);

  // Save current section to sessionStorage whenever we're on a section page
  useEffect(() => {
    const section = navItems.find(
      (item) => item.href !== '/' && (pathname === item.href || pathname.startsWith(item.href + '/'))
    );
    if (section) {
      safeStorage.set('last_section', section.href);
    }
  }, [pathname]);

  const contentPaths = ['/contents/', '/watch/', '/read/', '/truyen-tranh/', '/truyen-chu/'];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (pathname === href) return true;
    if (pathname.startsWith(href + '/')) return true;
    // Fallback: on content pages, use sessionStorage to remember which section we came from
    if (contentPaths.some(p => pathname.startsWith(p))) {
      return safeStorage.get('last_section') === href;
    }
    return false;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-[110] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface border-r border-outline/10 flex flex-col py-4 font-['Be_Vietnam_Pro'] text-sm z-40 overflow-y-auto transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-all duration-200 border-r-4",
                  active
                    ? "text-primary-container bg-primary-container/10 border-primary-container"
                    : "text-on-surface/50 hover:bg-surface-container hover:text-on-surface border-transparent"
                )}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className={cn(active ? "font-bold" : "font-medium")}>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-outline/10">
            {secondaryItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-all duration-200 border-r-4",
                    active
                      ? "text-primary-container bg-primary-container/10 border-primary-container"
                      : "text-on-surface/50 hover:bg-surface-container hover:text-on-surface border-transparent"
                  )}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className={cn(active ? "font-bold" : "font-medium")}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};
