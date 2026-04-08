import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  Users, 
  Stethoscope, 
  Play,
  Settings,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface SOSViewProps {
  onBack: () => void;
}

export default function SOSView({ onBack }: SOSViewProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isTriggered, setIsTriggered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    if (isTriggered) return;
    setIsPressing(true);
    setCountdown(3);
    
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          triggerSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePressEnd = () => {
    if (isTriggered) return;
    setIsPressing(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCountdown(3);
  };

  const triggerSOS = () => {
    setIsTriggered(true);
    setIsPressing(false);
    toast.error('紧急呼叫已触发！', {
      description: '正在自动拨打120并通知紧急联系人。',
      duration: 10000,
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#1a1c1e] text-white z-[60] overflow-y-auto no-scrollbar pb-32"
    >
      {/* Header */}
      <header className="sticky top-0 bg-[#1a1c1e]/80 backdrop-blur-3xl px-6 py-4 flex items-center gap-4 z-10 border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">紧急呼叫 / SOS</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh] space-y-12">
        {/* SOS Button Area */}
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter uppercase">SOS</h2>
            <p className="text-white/40 font-bold">长按3秒呼叫求助</p>
          </div>

          <div className="relative flex items-center justify-center">
            {/* Ripple Effects */}
            <AnimatePresence>
              {isPressing && (
                <>
                  <motion.div 
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute w-48 h-48 bg-error/30 rounded-full"
                  />
                  <motion.div 
                    initial={{ scale: 1, opacity: 0.3 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    className="absolute w-48 h-48 bg-error/20 rounded-full"
                  />
                </>
              )}
            </AnimatePresence>

            <button
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              className={cn(
                "relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 shadow-[0_0_80px_rgba(255,68,68,0.2)]",
                isTriggered ? "bg-error-container text-error" : "bg-error text-white",
                isPressing && "scale-110 shadow-[0_0_120px_rgba(255,68,68,0.4)]"
              )}
            >
              <ShieldAlert size={80} className={cn(isPressing && "animate-pulse")} />
              <span className="text-3xl font-black mt-4">
                {isPressing ? countdown : (isTriggered ? '已呼叫' : 'SOS')}
              </span>
            </button>
          </div>

          <AnimatePresence>
            {isTriggered && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 justify-center text-success font-bold">
                  <AlertCircle size={20} />
                  <span>正在自动拨打 120...</span>
                </div>
                <div className="flex items-center gap-3 justify-center text-white/60 text-sm">
                  <MapPin size={16} />
                  <span>位置已发送给紧急联系人</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        {!isTriggered && (
          <div className="w-full grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                <PhoneCall size={24} />
              </div>
              <span className="text-sm font-bold">一键呼叫家人</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center">
                <Users size={24} />
              </div>
              <span className="text-sm font-bold">管理联系人</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-tertiary/20 text-tertiary flex items-center justify-center">
                <Stethoscope size={24} />
              </div>
              <span className="text-sm font-bold">急救信息</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                <Play size={24} />
              </div>
              <span className="text-sm font-bold">功能测试</span>
            </button>
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-8 text-center">
        <p className="text-xs text-white/30">
          紧急状态下，系统将自动开启最高音量并开启定位权限。
        </p>
      </footer>
    </motion.div>
  );
}
