import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  MapPin, 
  Building2, 
  Stethoscope, 
  Star,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface BookingViewProps {
  onBack: () => void;
}

export default function BookingView({ onBack }: BookingViewProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleAction = () => {
    setShowComingSoon(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 bg-surface z-[60] overflow-y-auto no-scrollbar pb-32"
    >
      {/* Header */}
      <header className="sticky top-0 bg-surface/80 backdrop-blur-3xl px-6 py-4 flex items-center gap-4 z-10 border-b border-outline-variant/10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">预约挂号</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Search Bar */}
        <div className="relative" onClick={handleAction}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={20} />
          <input 
            type="text" 
            readOnly
            placeholder="搜索医院/科室/医生" 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-outline-variant/10 outline-none cursor-pointer"
          />
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '附近医院', icon: MapPin, color: 'text-primary' },
            { label: '三甲医院', icon: Building2, color: 'text-secondary' },
            { label: '专科推荐', icon: Stethoscope, color: 'text-tertiary' },
            { label: '我的收藏', icon: Star, color: 'text-warning' },
          ].map((item, idx) => (
            <button key={idx} onClick={handleAction} className="flex flex-col items-center gap-2">
              <div className={cn("w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center", item.color)}>
                <item.icon size={24} />
              </div>
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Hospital List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">选择医院</h2>
          <div className="space-y-3">
            {[
              { name: '上海交通大学医学院附属瑞金医院', level: '三级甲等', distance: '1.2km' },
              { name: '复旦大学附属中山医院', level: '三级甲等', distance: '2.5km' },
              { name: '上海市浦东新区人民医院', level: '三级乙等', distance: '0.8km' },
            ].map((h, idx) => (
              <button 
                key={idx} 
                onClick={handleAction}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-outline-variant/10 hover:border-primary transition-all text-left"
              >
                <div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
                  <Building2 className="text-on-surface-variant" size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{h.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded">{h.level}</span>
                    <span className="text-xs text-on-surface-variant/70">{h.distance}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-on-surface-variant/30" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-surface rounded-[32px] p-8 text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                <Building2 size={40} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">敬请期待</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  平台暂未和医院达成合作，我们将尽我们所能达成合作，敬请期待，感谢您的理解。
                </p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={onBack}
                  className="w-full py-4 rounded-full bg-primary text-white font-bold shadow-lg active:scale-95 transition-all"
                >
                  返回首页
                </button>
                <button 
                  onClick={() => setShowComingSoon(false)}
                  className="w-full py-4 rounded-full bg-surface-container-low font-bold text-on-surface-variant"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/10 text-center">
        <p className="text-xs text-on-surface-variant/60">
          挂号成功后，请按时携带就诊人身份证/医保卡前往医院取号就诊。
        </p>
      </footer>
    </motion.div>
  );
}
