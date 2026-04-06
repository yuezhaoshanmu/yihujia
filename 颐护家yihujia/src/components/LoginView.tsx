import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Lock, ArrowRight, ShieldCheck, UserPlus, LogIn, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface LoginViewProps {
  onLogin: () => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = () => {
    if (!phone.match(/^1[3-9]\d{9}$/)) {
      toast.error('请输入正确的手机号');
      return;
    }
    setIsSendingCode(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSendingCode(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    toast.success('验证码已发送');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!phone || !code) {
      toast.error('请填写完整信息');
      return;
    }
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: mode === 'login' ? '正在登录...' : '正在注册...',
        success: () => {
          onLogin();
          return mode === 'login' ? '登录成功！欢迎回来' : '注册成功！欢迎加入颐护家';
        },
        error: '操作失败，请稍后重试',
      }
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-surface z-[100] flex flex-col overflow-y-auto no-scrollbar"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/4 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="flex-1 flex flex-col px-8 pt-20 pb-12 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary mb-6">
            <ShieldCheck size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface leading-tight">
            {mode === 'login' ? '欢迎回来' : '开启健康生活'}
          </h1>
          <p className="text-on-surface-variant/60 font-medium">
            {mode === 'login' ? '登录您的颐护家账号，继续享受专业服务' : '注册新账号，为家人提供更贴心的照顾'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                <Phone size={20} />
              </div>
              <input 
                type="tel" 
                placeholder="请输入手机号" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-5 bg-white rounded-2xl border-2 border-outline-variant/10 focus:border-primary outline-none font-bold transition-all shadow-sm"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type="number" 
                placeholder="请输入验证码" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-12 pr-32 py-5 bg-white rounded-2xl border-2 border-outline-variant/10 focus:border-primary outline-none font-bold transition-all shadow-sm"
              />
              <button 
                type="button"
                onClick={handleSendCode}
                disabled={isSendingCode}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  isSendingCode 
                    ? "bg-surface-container-low text-on-surface-variant/40" 
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {isSendingCode ? `${countdown}s后重发` : '获取验证码'}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span>{mode === 'login' ? '立即登录' : '完成注册'}</span>
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between px-2">
            <button 
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              {mode === 'login' ? <UserPlus size={16} /> : <LogIn size={16} />}
              {mode === 'login' ? '注册新账号' : '已有账号？去登录'}
            </button>
            <button type="button" className="text-sm font-bold text-on-surface-variant/40 hover:text-primary transition-colors">
              遇到问题？
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant/10" />
            <span className="text-[10px] font-bold text-on-surface-variant/30 uppercase tracking-widest">其他登录方式</span>
            <div className="flex-1 h-px bg-outline-variant/10" />
          </div>
          
          <div className="flex justify-center gap-6">
            <button className="w-14 h-14 rounded-full bg-white border border-outline-variant/10 flex items-center justify-center text-[#07c160] shadow-sm hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.527 3.659 1.445 5.168L2.05 22l4.985-1.313C8.423 21.507 10.141 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.61 12.872c-.254.71-1.47 1.39-2.02 1.48-.49.08-1.12.14-2.84-.57-2.19-.91-3.61-3.14-3.72-3.29-.11-.15-.91-1.21-.91-2.31 0-1.1.57-1.64.78-1.87.21-.23.46-.29.61-.29.15 0 .3.01.43.01.14 0 .33-.05.51.39.19.46.64 1.56.7 1.68.06.12.1.26.02.42-.08.16-.12.26-.24.41-.12.15-.26.33-.37.44-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.96.16-.25.32-.21.54-.13.22.08 1.39.66 1.63.78.24.12.4.18.46.28.06.1.06.58-.19 1.29z"/></svg>
            </button>
            <button className="w-14 h-14 rounded-full bg-white border border-outline-variant/10 flex items-center justify-center text-[#1296db] shadow-sm hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 15.14c-.21.31-.62.41-.93.21-2.52-1.54-5.7-1.89-9.44-1.03-.35.08-.7-.13-.78-.48-.08-.35.13-.7.48-.78 4.1-.94 7.6-.54 10.46 1.2.31.18.41.59.21.9zm1.34-2.85c-.26.43-.82.57-1.25.31-2.89-1.78-7.29-2.29-10.7-1.25-.49.15-1.01-.13-1.16-.62-.15-.49.13-1.01.62-1.16 3.89-1.18 8.74-.61 12.18 1.48.43.25.57.81.31 1.24zm.12-2.97c-3.46-2.06-9.17-2.25-12.48-1.25-.53.16-1.09-.14-1.25-.67-.16-.53.14-1.09.67-1.25 3.8-1.15 10.11-.93 14.11 1.45.48.28.64.9.36 1.38-.28.48-.9.64-1.41.34z"/></svg>
            </button>
          </div>

          <p className="text-center text-[10px] text-on-surface-variant/40 font-medium px-4 leading-relaxed">
            登录即代表您已阅读并同意《颐护家服务协议》与《隐私政策》，我们将严格保护您的个人隐私与数据安全。
          </p>
        </div>
      </div>
    </motion.div>
  );
}
