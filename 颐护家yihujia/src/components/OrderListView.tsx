import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Calendar, Clock, MapPin, CheckCircle2, Wallet, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';

interface OrderListViewProps {
  onBack: () => void;
}

export default function OrderListView({ onBack }: OrderListViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');

  const orders = [
    {
      id: 'ORD20260331001',
      service: '基础生活照护',
      time: '2026-04-01 09:00',
      address: '上海市浦东新区张江路888弄12号302室',
      status: 'pending',
      statusLabel: '待支付',
      price: '¥ 198.00',
      icon: Calendar,
      color: 'text-[#735c00]',
      bg: 'bg-[#fed65b]/10'
    },
    {
      id: 'ORD20260328005',
      service: '专业医疗护理',
      time: '2026-03-28 14:30',
      address: '上海市浦东新区张江路888弄12号302室',
      status: 'completed',
      statusLabel: '已完成',
      price: '¥ 258.00',
      icon: CheckCircle2,
      color: 'text-[#006d37]',
      bg: 'bg-[#006d37]/5'
    },
    {
      id: 'ORD20260325012',
      service: '康复理疗指导',
      time: '2026-03-25 10:00',
      address: '上海市浦东新区张江路888弄12号302室',
      status: 'completed',
      statusLabel: '已完成',
      price: '¥ 320.00',
      icon: CheckCircle2,
      color: 'text-[#006d37]',
      bg: 'bg-[#006d37]/5'
    }
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

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
        <h1 className="text-xl font-bold tracking-tight">预约订单管理</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Tabs */}
        <div className="flex p-1 bg-surface-container-low rounded-2xl">
          {[
            { id: 'all', label: '全部', icon: ClipboardList },
            { id: 'pending', label: '待支付', icon: Wallet },
            { id: 'completed', label: '已完成', icon: CheckCircle2 },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                activeTab === tab.id ? "bg-white shadow-sm" : "text-on-surface-variant"
              )}
            >
              <tab.icon size={18} />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-3xl border-2 border-outline-variant/10 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/5">
                  <span className="text-[10px] font-bold text-on-surface-variant/50 tracking-widest uppercase">订单号: {order.id}</span>
                  <span className={cn(
                    "text-xs font-bold px-3 py-1 rounded-full",
                    order.status === 'completed' ? "bg-success/10 text-success" : "bg-[#fed65b]/20 text-[#735c00]"
                  )}>
                    {order.statusLabel}
                  </span>
                </div>
                
                <div className="flex gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", order.bg, order.color)}>
                    <order.icon size={24} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-lg">{order.service}</h3>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant/70">
                      <Clock size={14} />
                      <span>{order.time}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-on-surface-variant/70">
                      <MapPin size={14} className="shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{order.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-black text-primary">{order.price}</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-full border border-outline-variant/20 text-xs font-bold hover:bg-surface-container-low transition-colors">
                      查看详情
                    </button>
                    {order.status === 'pending' && (
                      <button className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-lg active:scale-95 transition-all">
                        立即支付
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto text-on-surface-variant/20">
                <ClipboardList size={40} />
              </div>
              <p className="text-on-surface-variant/50 font-bold">暂无相关订单</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
