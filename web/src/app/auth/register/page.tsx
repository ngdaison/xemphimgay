"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', { email, username, password });
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-['Be_Vietnam_Pro'] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      
      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-surface-container/40 backdrop-blur-3xl border border-outline/10 rounded-[40px] p-10 md:p-12 shadow-2xl">
          <div className="text-center mb-10 space-y-2">
             <div className="w-16 h-16 bg-primary-container/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-container/30">
                <UserPlus className="w-8 h-8 text-primary-container" />
             </div>
             <h1 className="text-3xl font-black uppercase italic tracking-tighter text-on-surface">Tham Gia</h1>
             <p className="text-on-surface/40 font-bold uppercase tracking-widest text-[10px]">Trở thành một phần của cộng đồng CineStream</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-6 text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 ml-4">Username</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface/30 group-focus-within:text-primary-container transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface-container/50 border border-outline/10 focus:border-primary-container/50 focus:bg-surface-container outline-none rounded-2xl py-4 pl-14 pr-5 text-sm font-bold text-on-surface transition-all"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface/30 group-focus-within:text-primary-container transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container/50 border border-outline/10 focus:border-primary-container/50 focus:bg-surface-container outline-none rounded-2xl py-4 pl-14 pr-5 text-sm font-bold text-on-surface transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 ml-4">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface/30 group-focus-within:text-primary-container transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container/50 border border-outline/10 focus:border-primary-container/50 focus:bg-surface-container outline-none rounded-2xl py-4 pl-14 pr-14 text-sm font-bold text-on-surface transition-all"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/30 hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container hover:bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  TẠO TÀI KHOẢN <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-outline/10 text-center">
             <p className="text-on-surface/40 text-xs font-bold uppercase tracking-widest">
                Đã có tài khoản? {" "}
                <Link href="/auth/login" className="text-primary-container hover:underline">Đăng nhập</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
