import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface AddressViewProps {
  onBack: () => void;
}

export default function AddressView({ onBack }: AddressViewProps) {
  const [addresses, setAddresses] = useState([
    { id: '1', name: '王小明', phone: '13812345678', address: '上海市浦东新区张江路888弄12号302室', isDefault: true },
    { id: '2', name: '王大强', phone: '13987654321', address: '上海市徐汇区漕河泾开发区桂平路481号20楼', isDefault: false },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success('地址已删除');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('默认地址已更新');
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
        <h1 className="text-xl font-bold tracking-tight">服务地址管理</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white p-5 rounded-3xl border-2 border-outline-variant/10 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", addr.isDefault ? "bg-primary/10 text-primary" : "bg-surface-container-low text-on-surface-variant")}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{addr.name}</span>
                      <span className="text-sm text-on-surface-variant/70">{addr.phone}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed mt-1">{addr.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/5">
                <button 
                  onClick={() => handleSetDefault(addr.id)}
                  className="flex items-center gap-2 text-xs font-bold"
                >
                  <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", addr.isDefault ? "border-primary bg-primary text-white" : "border-outline-variant/20")}>
                    {addr.isDefault && <CheckCircle2 size={14} />}
                  </div>
                  <span className={addr.isDefault ? "text-primary" : "text-on-surface-variant/50"}>默认地址</span>
                </button>
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-xs font-bold text-on-surface-variant/70 hover:text-primary transition-colors">
                    <Edit2 size={14} />
                    <span>编辑</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="flex items-center gap-1 text-xs font-bold text-on-surface-variant/70 hover:text-error transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>删除</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={24} />
          <span>新增服务地址</span>
        </button>
      </div>

      {/* Add Form Modal (Simplified) */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[70] flex items-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-surface rounded-t-[40px] p-8 space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">新增服务地址</h3>
                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-surface-container-low rounded-full">
                  <Plus className="rotate-45" size={28} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="联系人姓名" className="p-4 rounded-2xl bg-surface-container-low border-none outline-none font-bold" />
                  <input type="tel" placeholder="手机号" className="p-4 rounded-2xl bg-surface-container-low border-none outline-none font-bold" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select className="p-4 rounded-xl bg-surface-container-low border-none outline-none font-bold"><option>上海市</option></select>
                  <select className="p-4 rounded-xl bg-surface-container-low border-none outline-none font-bold"><option>浦东新区</option></select>
                  <select className="p-4 rounded-xl bg-surface-container-low border-none outline-none font-bold"><option>张江镇</option></select>
                </div>
                <input type="text" placeholder="街道/弄/号" className="w-full p-4 rounded-xl bg-surface-container-low border-none outline-none font-bold" />
                <input type="text" placeholder="楼层/门牌号" className="w-full p-4 rounded-xl bg-surface-container-low border-none outline-none font-bold" />
              </div>
              <button 
                onClick={() => setShowAddForm(false)}
                className="w-full py-5 rounded-full bg-primary text-white font-bold text-lg shadow-xl"
              >
                保存地址
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
