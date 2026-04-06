import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Activity, 
  HeartPulse, 
  Thermometer, 
  Scale, 
  Plus, 
  FileUp, 
  Bluetooth, 
  TrendingUp, 
  TrendingDown, 
  List, 
  BarChart3, 
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Article } from '../types';
import { MOCK_ARTICLES } from '../constants';

interface HealthViewProps {
  onBack: () => void;
  onArticleClick?: (article: Article) => void;
}

export default function HealthView({ onBack, onArticleClick }: HealthViewProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'chart' | 'reports'>('list');
  const [showAddForm, setShowAddForm] = useState(false);
  const [reports, setReports] = useState([
    { name: '2026年度体检报告.pdf', date: '2026-01-15', size: '2.4MB' },
    { name: '心电图检查结果.jpg', date: '2026-02-20', size: '1.1MB' },
  ]);

  const stats = [
    { label: '血压', value: '128/82', unit: 'mmHg', trend: 'normal', icon: Activity, color: 'text-primary' },
    { label: '血糖', value: '6.2', unit: 'mmol/L', trend: 'up', icon: HeartPulse, color: 'text-error' },
    { label: '体重', value: '68.5', unit: 'kg', trend: 'down', icon: Scale, color: 'text-secondary' },
  ];

  const records = [
    { date: '2026-03-31 08:30', type: '血压', value: '128/82', status: '正常' },
    { date: '2026-03-30 20:00', type: '血糖', value: '6.5', status: '偏高' },
    { date: '2026-03-30 08:00', type: '血压', value: '132/85', status: '正常' },
    { date: '2026-03-29 08:00', type: '体重', value: '68.8', status: '正常' },
  ];

  const [showArticles, setShowArticles] = useState(false);

  const articles = [
    { title: '老年人高血压日常护理指南', category: '高血压', date: '2026-03-25', reads: '1.2k' },
    { title: '糖尿病患者如何科学饮食？', category: '糖尿病', date: '2026-03-20', reads: '2.5k' },
    { title: '春季流感预防小贴士', category: '流行病', date: '2026-03-15', reads: '800' },
  ];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 2000)),
        {
          loading: `正在上传 ${file.name}...`,
          success: () => {
            setReports(prev => [{ name: file.name, date: new Date().toISOString().split('T')[0], size: `${(file.size / 1024 / 1024).toFixed(1)}MB` }, ...prev]);
            return '报告上传成功！已自动提取关键指标。';
          },
          error: '上传失败',
        }
      );
    }
  };

  const handleUploadClick = () => {
    document.getElementById('report-upload-input')?.click();
  };

  const handleDeviceSync = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 3000)),
      {
        loading: '正在搜索附近的蓝牙设备...',
        success: '已同步：鱼跃血压计 (YE660D)。数据已更新。',
        error: '未找到设备，请确保蓝牙已开启。',
      }
    );
  };

  const dailyReadings = [
    { id: 1, author: '健康管家', content: '早起一杯温开水，可以帮助唤醒肠胃，促进代谢哦！💧 #晨间养生', time: '08:00', likes: 156 },
    { id: 2, author: '营养师小王', content: '中老年人要注意优质蛋白的摄入，鱼肉和豆制品是不错的选择。🐟 #健康饮食', time: '10:30', likes: 89 },
    { id: 3, author: '运动达人', content: '饭后百步走，活到九十九。建议餐后半小时进行适度散步。🚶‍♂️ #日常运动', time: '13:15', likes: 234 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 bg-surface z-[60] overflow-y-auto no-scrollbar pb-32"
    >
      <input 
        type="file" 
        id="report-upload-input" 
        className="hidden" 
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      {/* Header */}
      <header className="sticky top-0 bg-surface/80 backdrop-blur-3xl px-6 py-4 flex items-center gap-4 z-10 border-b border-outline-variant/10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">健康档案 / 体检记录</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Data Overview */}
        <section className="grid grid-cols-1 gap-4">
          <div className="bg-white p-6 rounded-[32px] border-2 border-outline-variant/10 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-on-surface-variant/50">最近一次记录</h2>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">3月31日 08:30</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className={cn("w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center", stat.color)}>
                    <stat.icon size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold opacity-50">{stat.label}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-black">{stat.value}</span>
                      {stat.trend === 'up' && <TrendingUp size={14} className="text-error" />}
                      {stat.trend === 'down' && <TrendingDown size={14} className="text-secondary" />}
                    </div>
                    <p className="text-[10px] opacity-40">{stat.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Function Entry */}
        <section className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-2 border-outline-variant/10"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Plus size={24} />
            </div>
            <span className="text-xs font-bold">手动记录</span>
          </button>
          <button 
            onClick={handleUploadClick}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-2 border-outline-variant/10"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <FileUp size={24} />
            </div>
            <span className="text-xs font-bold">报告上传</span>
          </button>
          <button 
            onClick={handleDeviceSync}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-2 border-outline-variant/10"
          >
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
              <Bluetooth size={24} />
            </div>
            <span className="text-xs font-bold">设备同步</span>
          </button>
        </section>

        {/* Daily Health Reading (Articles) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              <h3 className="font-bold text-lg">每日健康必读</h3>
            </div>
          </div>
          <div className="space-y-4">
            {MOCK_ARTICLES.map((article) => (
              <div 
                key={article.id} 
                onClick={() => onArticleClick?.(article)}
                className="bg-white p-4 rounded-2xl border-2 border-outline-variant/10 shadow-sm flex gap-4 cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <h4 className="font-bold text-sm line-clamp-2 leading-snug">{article.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant/50">
                    <span className="text-primary">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tracking Tabs */}
        <section className="space-y-6">
          <div className="flex p-1 bg-surface-container-low rounded-2xl">
            {[
              { id: 'list', label: '列表视图', icon: List },
              { id: 'chart', label: '图表视图', icon: BarChart3 },
              { id: 'reports', label: '体检报告', icon: FileUp },
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

          <div className="space-y-4">
            {activeTab === 'list' && (
              <div className="space-y-3">
                {records.map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
                        {record.type === '血压' ? <Activity className="text-primary" /> : record.type === '血糖' ? <HeartPulse className="text-error" /> : <Scale className="text-secondary" />}
                      </div>
                      <div>
                        <p className="font-bold">{record.type}: {record.value}</p>
                        <p className="text-xs opacity-40">{record.date}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded-full",
                      record.status === '正常' ? "bg-success/10 text-success" : "bg-error/10 text-error"
                    )}>
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'chart' && (
              <div className="bg-white p-6 rounded-3xl border-2 border-outline-variant/10 h-64 flex items-center justify-center text-on-surface-variant/30">
                <div className="text-center space-y-2">
                  <BarChart3 size={48} className="mx-auto opacity-20" />
                  <p className="font-bold">血压趋势图表 (示例)</p>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-3">
                {reports.map((report, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
                        <FileUp className="text-secondary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{report.name}</p>
                        <p className="text-xs opacity-40">{report.date} · {report.size}</p>
                      </div>
                    </div>
                    <button className="text-primary font-bold text-xs">查看</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Reports & Suggestions */}
        <section className="bg-white p-6 rounded-3xl border-2 border-outline-variant/10 space-y-4">
          <div className="flex items-center gap-2">
            <Info size={20} className="text-primary" />
            <h3 className="font-bold">健康建议</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              近期血压有上升趋势，请注意监测。建议保持低盐饮食，按时服药。
            </p>
            <button 
              onClick={() => setShowArticles(true)}
              className="flex items-center gap-2 text-primary font-bold text-sm"
            >
              <span>查看相关科普文章</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>

      {/* Science Articles Modal */}
      <AnimatePresence>
        {showArticles && (
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
              className="w-full bg-surface rounded-t-[40px] p-8 space-y-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">健康科普</h3>
                <button onClick={() => setShowArticles(false)} className="p-2 hover:bg-surface-container-low rounded-full">
                  <Plus className="rotate-45" size={28} />
                </button>
              </div>

              <div className="space-y-4">
                {MOCK_ARTICLES.map((article) => (
                  <div 
                    key={article.id} 
                    onClick={() => {
                      setShowArticles(false);
                      onArticleClick?.(article);
                    }}
                    className="p-5 bg-white rounded-3xl border-2 border-outline-variant/10 shadow-sm space-y-3 cursor-pointer hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs opacity-40">{article.date}</span>
                    </div>
                    <h4 className="font-bold text-lg leading-tight">{article.title}</h4>
                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/5">
                      <span className="text-xs opacity-40">{article.readTime}</span>
                      <button className="text-primary font-bold text-sm">阅读全文</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Record Modal */}
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
                <h3 className="text-2xl font-bold">手动记录指标</h3>
                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-surface-container-low rounded-full">
                  <Plus className="rotate-45" size={28} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-3">
                  {['血压', '血糖', '心率', '体温'].map(type => (
                    <button key={type} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-surface-container-low hover:bg-primary hover:text-white transition-all">
                      <span className="text-xs font-bold">{type}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="输入数值" className="w-full p-5 rounded-2xl bg-surface-container-low border-none outline-none font-bold text-xl text-center" />
                  <input type="datetime-local" className="w-full p-4 rounded-2xl bg-surface-container-low border-none outline-none font-bold" />
                </div>
              </div>

              <button 
                onClick={() => setShowAddForm(false)}
                className="w-full py-5 rounded-full bg-primary text-white font-bold text-lg shadow-xl"
              >
                保存记录
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
