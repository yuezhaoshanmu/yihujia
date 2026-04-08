import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, MapPin, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess?: () => void;
}

const SERVICES = [
  { id: '1', name: '基础生活照护', price: '¥ 198.00', duration: '2小时', icon: '🏠' },
  { id: '2', name: '专业医疗护理', price: '¥ 298.00', duration: '1.5小时', icon: '🏥' },
  { id: '3', name: '康复训练指导', price: '¥ 358.00', duration: '1小时', icon: '💪' },
  { id: '4', name: '心理慰藉陪伴', price: '¥ 158.00', duration: '2小时', icon: '❤️' },
];

export default function AppointmentModal({ isOpen, onClose, user, onSuccess }: AppointmentModalProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [address, setAddress] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`/api/addresses/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
        const defaultAddr = data.find((a: any) => a.is_default);
        if (defaultAddr) setAddress(defaultAddr.address);
        else if (data.length > 0) setAddress(data[0].address);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          service: selectedService.name,
          time: `${date} ${time}`,
          address: address || '请在个人中心设置地址',
          status: 'pending',
          statusLabel: '待支付',
          price: selectedService.price
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess?.();
          onClose();
          // Reset state
          setStep(1);
          setIsSuccess(false);
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Appointment submission failed:', errorData);
        toast.error(`预约失败: ${errorData.error || '请稍后再试'}`);
      }
    } catch (error) {
      toast.error('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="relative w-full max-w-lg bg-surface rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-8 py-6 flex items-center justify-between border-b border-outline-variant/10 shrink-0">
            <h2 className="text-xl font-bold tracking-tight">预约上门护理</h2>
            <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
            {isSuccess ? (
              <div className="py-12 flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">预约成功！</h3>
                  <p className="text-on-surface-variant">医护人员将在5分钟内与您联系确认详情。</p>
                </div>
              </div>
            ) : (
              <>
                {/* Progress Indicator */}
                <div className="flex items-center gap-4 mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 flex items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                        step >= i ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"
                      )}>
                        {i}
                      </div>
                      {i < 3 && <div className={cn("flex-1 h-1 rounded-full", step > i ? "bg-primary" : "bg-surface-container-high")} />}
                    </div>
                  ))}
                </div>

                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-bold">选择服务项目</h3>
                    <div className="grid gap-4">
                      {SERVICES.map((s) => (
                        <div 
                          key={s.id}
                          onClick={() => setSelectedService(s)}
                          className={cn(
                            "p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4",
                            selectedService.id === s.id ? "border-primary bg-primary/5" : "border-outline-variant/10 hover:border-primary/30"
                          )}
                        >
                          <span className="text-3xl">{s.icon}</span>
                          <div className="flex-1">
                            <div className="font-bold">{s.name}</div>
                            <div className="text-xs text-on-surface-variant">{s.duration}</div>
                          </div>
                          <div className="text-primary font-black">{s.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-bold">选择预约时间</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface-variant ml-1">日期</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                          <input 
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-surface-container-low border-2 border-outline-variant/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-primary font-medium"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface-variant ml-1">时间</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                          <select 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-surface-container-low border-2 border-outline-variant/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-primary font-medium appearance-none"
                          >
                            {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-bold">确认服务地址</h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-on-surface-variant" size={20} />
                        <textarea 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="请输入详细的上门服务地址..."
                          rows={4}
                          className="w-full bg-surface-container-low border-2 border-outline-variant/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-primary font-medium resize-none"
                        />
                      </div>
                      {addresses.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-on-surface-variant ml-1">常用地址</p>
                          <div className="flex flex-wrap gap-2">
                            {addresses.map((addr, i) => (
                              <button 
                                key={i}
                                onClick={() => setAddress(addr.address)}
                                className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-bold hover:bg-primary/10 transition-colors"
                              >
                                {addr.label || '地址' + (i+1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!isSuccess && (
            <div className="px-8 py-6 border-t border-outline-variant/10 shrink-0 flex gap-4">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-4 rounded-2xl bg-surface-container-high font-bold active:scale-95 transition-all"
                >
                  上一步
                </button>
              )}
              <button 
                onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>{step === 3 ? '确认预约' : '下一步'}</span>
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
