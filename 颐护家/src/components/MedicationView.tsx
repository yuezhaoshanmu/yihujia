import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Pill, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  Settings,
  Camera,
  ChevronRight,
  Info,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface MedicationViewProps {
  onBack: () => void;
  user: User;
}

export default function MedicationView({ onBack, user }: MedicationViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeView, setActiveView] = useState<'today' | 'history' | 'management'>('today');
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMed, setNewMed] = useState({ name: '', freq: '每日1次', dosage: '每次1片', purpose: '', nextTime: '08:00' });

  useEffect(() => {
    fetchMedications();
  }, [user.id]);

  const fetchMedications = async () => {
    try {
      const response = await fetch(`/api/medications/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setMedications(data);
      }
    } catch (error) {
      console.error('Failed to fetch medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const history = [
    { date: '2026-03-30', taken: 0, total: 0, details: [] },
  ];

  const toggleStatus = (id: string) => {
    setMedications(prev => prev.map(m => 
      m.id === id ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed' } : m
    ));
    toast.success('状态已更新');
  };

  const handleCompleteAll = () => {
    setMedications(prev => prev.map(m => ({ ...m, status: 'completed' })));
    toast.success('今日全部完成！');
  };

  const handleDeleteMed = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    toast.success('药品已从管理库移除');
  };

  const handleAddMed = async () => {
    if (!newMed.name) {
      toast.error('请输入药品名称');
      return;
    }

    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...newMed,
          status: 'pending'
        })
      });

      if (response.ok) {
        toast.success('药品添加成功');
        setShowAddForm(false);
        fetchMedications();
      }
    } catch (error) {
      toast.error('保存失败');
    }
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
        <h1 className="text-xl font-bold tracking-tight">用药提醒</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Today's Overview */}
        <section className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-3xl text-white shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-white/70 text-sm">今天（3月31日 周二）</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-white/60" />
                  <span className="text-lg font-bold">待服：{medications.filter(m => m.status === 'pending').length}种</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-white/60" />
                  <span className="text-lg font-bold">已完成：{medications.filter(m => m.status === 'completed').length}种</span>
                </div>
              </div>
            </div>
            <Pill size={48} className="text-white/20" />
          </div>
          <button 
            onClick={handleCompleteAll}
            className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl font-bold text-lg hover:bg-white/30 transition-all active:scale-95"
          >
            一键确认今日全部完成
          </button>
        </section>

        {/* Action Bar */}
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-2 border-outline-variant/10"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Plus size={24} />
            </div>
            <span className="text-xs font-bold">添加药品</span>
          </button>
          <button 
            onClick={() => setActiveView('history')}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
              activeView === 'history' ? "bg-secondary/10 border-secondary" : "bg-white border-outline-variant/10"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <span className="text-xs font-bold">用药历史</span>
          </button>
          <button 
            onClick={() => setActiveView('management')}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
              activeView === 'management' ? "bg-surface-container-high border-on-surface" : "bg-white border-outline-variant/10"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-surface-container-low text-on-surface-variant flex items-center justify-center">
              <Settings size={24} />
            </div>
            <span className="text-xs font-bold">药品管理</span>
          </button>
        </div>

        {/* Content Area */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">
              {activeView === 'today' ? '今日用药清单' : activeView === 'history' ? '用药历史记录' : '我的药品库'}
            </h3>
            {activeView !== 'today' && (
              <button 
                onClick={() => setActiveView('today')}
                className="text-primary font-bold text-sm"
              >
                返回今日
              </button>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : activeView === 'today' && medications.length > 0 ? (
              medications.map((med) => (
                <div 
                  key={med.id}
                  className="bg-white p-5 rounded-3xl border-2 border-outline-variant/10 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">{med.name}</h3>
                      <p className="text-sm text-on-surface-variant font-medium">{med.dosage}</p>
                    </div>
                    <button 
                      onClick={() => toggleStatus(med.id)}
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                        med.status === 'completed' ? "bg-success/10 text-success" : "bg-error/10 text-error"
                      )}
                    >
                      {med.status === 'completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant/60">
                      <Info size={14} />
                      <span>目的：{med.purpose}</span>
                    </div>
                    <span className="text-xs font-bold text-primary">下次：{med.nextTime}</span>
                  </div>
                </div>
              ))
            ) : activeView === 'today' ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto text-on-surface-variant/20">
                  <Pill size={40} />
                </div>
                <p className="text-on-surface-variant/50 font-bold">今日暂无用药提醒</p>
              </div>
            ) : null}

            {activeView === 'history' && history.map((item, idx) => (
              item.total > 0 && (
                <div key={idx} className="bg-white p-5 rounded-3xl border-2 border-outline-variant/10 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-bold">{item.date}</p>
                        <p className="text-xs text-on-surface-variant/70">完成度: {item.taken}/{item.total}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(item.total)].map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-2 h-2 rounded-full",
                            i < item.taken ? "bg-success" : "bg-outline-variant/30"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/5">
                    {item.details.map((name, i) => (
                      <span key={i} className="px-2 py-1 bg-surface-container-low rounded-lg text-[10px] font-bold text-on-surface-variant/60">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
            {activeView === 'history' && history.every(h => h.total === 0) && (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto text-on-surface-variant/20">
                  <Calendar size={40} />
                </div>
                <p className="text-on-surface-variant/50 font-bold">暂无历史记录</p>
              </div>
            )}

            {activeView === 'management' && medications.length > 0 ? medications.map((med) => (
              <div key={med.id} className="bg-white p-5 rounded-3xl border-2 border-outline-variant/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                      <Pill size={24} />
                    </div>
                    <div>
                      <p className="font-bold">{med.name}</p>
                      <p className="text-xs text-on-surface-variant/70">{med.freq} · {med.dosage}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteMed(med.id)}
                    className="p-3 text-error hover:bg-error/10 rounded-2xl transition-colors"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/5">
                  <button className="flex-1 py-2 bg-surface-container-low rounded-xl text-xs font-bold">修改方案</button>
                  <button className="flex-1 py-2 bg-surface-container-low rounded-xl text-xs font-bold">库存提醒</button>
                </div>
              </div>
            )) : activeView === 'management' ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto text-on-surface-variant/20">
                  <Settings size={40} />
                </div>
                <p className="text-on-surface-variant/50 font-bold">药品库为空</p>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {/* Add Medication Modal */}
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
              className="w-full bg-surface rounded-t-[40px] p-8 space-y-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">添加新药品</h3>
                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-surface-container-low rounded-full">
                  <Plus className="rotate-45" size={28} />
                </button>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => toast.info('正在启动相机识别...', { description: '请对准药盒上的名称或条形码。' })}
                  className="w-full flex items-center justify-center gap-3 py-6 bg-primary/5 border-2 border-dashed border-primary/30 rounded-3xl text-primary font-bold"
                >
                  <Camera size={24} />
                  <span>拍照识别药盒</span>
                </button>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-50 ml-2">药品名称</label>
                    <input 
                      type="text" 
                      placeholder="请输入药品名称" 
                      value={newMed.name}
                      onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-surface-container-low border-none outline-none font-bold" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-50 ml-2">每日次数</label>
                      <select 
                        value={newMed.freq}
                        onChange={(e) => setNewMed({...newMed, freq: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-surface-container-low border-none outline-none font-bold"
                      >
                        <option>每日1次</option>
                        <option>每日2次</option>
                        <option>每日3次</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-50 ml-2">每次剂量</label>
                      <input 
                        type="text" 
                        placeholder="每次1片" 
                        value={newMed.dosage}
                        onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-surface-container-low border-none outline-none font-bold" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-50 ml-2">用药目的</label>
                    <input 
                      type="text" 
                      placeholder="如：降血压" 
                      value={newMed.purpose}
                      onChange={(e) => setNewMed({...newMed, purpose: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-surface-container-low border-none outline-none font-bold" 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAddMed}
                className="w-full py-5 rounded-full bg-primary text-white font-bold text-lg shadow-xl"
              >
                保存方案
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
