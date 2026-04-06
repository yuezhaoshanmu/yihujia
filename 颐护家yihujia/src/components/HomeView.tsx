import { Calendar, Pill, HeartPulse, Activity, ArrowRight, Verified, Utensils, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ViewType, Article } from '../types';
import { MOCK_ARTICLES } from '../constants';

interface HomeViewProps {
  onStartAppointment?: () => void;
  onNavigate?: (view: ViewType) => void;
  onArticleClick?: (article: Article) => void;
}

export default function HomeView({ onStartAppointment, onNavigate, onArticleClick }: HomeViewProps) {
  const handleServiceClick = (label: string) => {
    if (onNavigate) {
      switch (label) {
        case '预约挂号': onNavigate('booking'); break;
        case '用药提醒': onNavigate('medication'); break;
        case 'SOS紧急呼叫': onNavigate('sos'); break;
        case '健康体检': onNavigate('health'); break;
        default:
          toast.success(`已进入${label}功能`, {
            description: "正在为您跳转或加载数据...",
          });
      }
    } else {
      toast.success(`已进入${label}功能`, {
        description: "正在为您跳转或加载数据...",
      });
    }
  };

  const handleAppointment = () => {
    if (onStartAppointment) {
      onStartAppointment();
    } else {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)),
        {
          loading: '正在为您匹配最近的专业护士...',
          success: '预约请求已发送！医护人员将在5分钟内与您联系。',
          error: '预约失败，请检查网络连接或拨打紧急热线。',
        }
      );
    }
  };

  const services = [
    { label: '预约挂号', icon: Calendar, color: 'text-primary', bg: 'bg-primary/5' },
    { label: '用药提醒', icon: Pill, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'SOS紧急呼叫', icon: PhoneCall, color: 'text-error', bg: 'bg-error/10' },
    { label: '健康体检', icon: HeartPulse, color: 'text-primary', bg: 'bg-primary/5' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 px-6 max-w-7xl mx-auto space-y-10 pb-32"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl h-[420px] flex flex-col justify-end p-8 bg-gradient-to-br from-[#005228] to-[#006d37] shadow-2xl">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoNGd0PViMtLUhIGN52gRQMna2B0NhAXI9BnVA_rFdFItZZXqhEKvhBKH6ku4CA1E44W-pOfH0Wj1tj8zo6DP3_iXGoE-npSHvMdLIl480xFTpOCdfHYPWNtOZ7_z4j92cBkKzvPfqH8h57yizso1bj3xbeCQtYlZjik05Qr5M7a_oioq0GJ3E_LmBiSpNUWmZpeG07ZcWC_sGLux-e97VwsJ1saKpa4mWeyuKOhCZwakDzVmYDtYd7hWbDCycdManGmWkF7pmx64"
            referrerPolicy="no-referrer"
            alt="Hero Background"
          />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              为您提供最专业的<br/>居家照顾
            </h1>
            <p className="text-white/80 font-medium tracking-wide">
              专业护士 · 极速响应 · 安全保障
            </p>
          </div>
          <button 
            onClick={handleAppointment}
            className="w-full md:w-max px-8 py-5 rounded-full bg-[#fed65b] text-[#745c00] font-bold text-lg flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(254,214,91,0.3)] active:scale-95 transition-all hover:brightness-105"
          >
            <span>一键预约上门护理</span>
            <ArrowRight size={20} />
          </button>
        </div>
        
        {/* Glassmorphic floating element */}
        <div className="absolute top-8 right-8 bg-white/70 backdrop-blur-2xl p-4 rounded-2xl hidden md:block border border-white/20">
          <div className="flex items-center gap-4">
            <div className="bg-[#005228]/10 p-3 rounded-full">
              <Verified className="text-[#005228]" size={24} />
            </div>
            <div>
              <div className="text-[#1a1c19] font-bold">100% 资质认证</div>
              <div className="text-[#3f4940] text-sm">所有医护人员持证上岗</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Grid */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">便捷服务</h2>
          <span 
            onClick={() => handleServiceClick('全部服务')}
            className="text-secondary font-semibold text-sm cursor-pointer hover:underline"
          >
            查看全部
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              onClick={() => handleServiceClick(service.label)}
              className="bg-white p-6 rounded-2xl flex flex-col items-center text-center space-y-4 hover:bg-[#f4f4ef] transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <div className={`w-16 h-16 rounded-full ${service.bg} flex items-center justify-center ${service.color}`}>
                <service.icon size={32} />
              </div>
              <span className="font-bold text-lg">{service.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Reads */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">每日健康必读</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {MOCK_ARTICLES.map(article => (
            <ArticleCard 
              key={article.id}
              article={article}
              onClick={() => onArticleClick?.(article)}
            />
          ))}
        </div>
      </section>

      {/* Bento Layout Highlight */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-[#795900] to-[#5b4300] p-8 rounded-3xl flex flex-col justify-between text-white overflow-hidden relative min-h-[200px]">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Activity size={200} />
          </div>
          <div className="z-10">
            <h3 className="text-2xl font-bold mb-2">心情树洞</h3>
            <p className="opacity-80 max-w-sm">专业的心理疏导与陪伴，让长辈的心声被温柔聆听。</p>
          </div>
          <div className="mt-8 z-10">
            <button 
              onClick={() => onNavigate?.('treehole')}
              className="bg-white text-[#5b4300] px-6 py-3 rounded-full font-bold active:scale-95 transition-transform"
            >
              开始倾诉
            </button>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl flex flex-col justify-between items-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#fed65b] flex items-center justify-center mb-4">
            <Utensils className="text-[#745c00]" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">定制食谱</h3>
            <p className="text-[#3f4940] text-sm">根据体检结果<br/>每周更新健康方案</p>
          </div>
          <button 
            onClick={() => onNavigate?.('recipes')}
            className="mt-6 text-[#005228] font-bold"
          >
            查看详情
          </button>
        </div>
      </section>
    </motion.div>
  );
}

function ArticleCard({ article, onClick }: { article: Article; onClick: () => void }) {
  return (
    <article 
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          src={article.image} 
          referrerPolicy="no-referrer"
          alt={article.title}
        />
      </div>
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#ffe088] text-[#574500] text-xs font-bold rounded-full">{article.category}</span>
          <span className="text-[#3f4940] text-sm font-medium">{article.readTime}</span>
        </div>
        <h3 className="text-2xl font-bold leading-snug group-hover:text-[#005228] transition-colors">{article.title}</h3>
        <p className="text-[#3f4940] line-clamp-2">{article.summary}</p>
      </div>
    </article>
  );
}

function PhoneCallIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
