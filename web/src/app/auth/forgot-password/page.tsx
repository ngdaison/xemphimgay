"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Yêu cầu thất bại. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary-container rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20">
              <span className="text-white font-black text-2xl italic">C</span>
            </div>
          </Link>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Quên mật khẩu?</h1>
          <p className="text-zinc-500 font-medium mt-2 text-sm">Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.</p>
        </div>

        {sent ? (
          <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <Mail className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-xl font-black uppercase italic text-white">Đã gửi email!</h2>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <span className="text-white font-bold">{email}</span>. Vui lòng kiểm tra hộp thư của bạn.
            </p>
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-primary-container text-sm font-bold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 space-y-8">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold">{error}</div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-primary-container transition-all text-sm font-bold text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-primary-container text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              GỬI YÊU CẦU
            </button>

            <div className="text-center">
              <Link href="/auth/login" className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                ← Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
