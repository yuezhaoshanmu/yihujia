import { CalendarDays, Wallet, CheckCircle2, ClipboardList, ShieldCheck, MapPin, Headphones, ChevronRight, LogOut, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileViewProps {
  onNavigate: (view: any) => void;
  onLogout: () => void;
}

export default function ProfileView({ onNavigate, onLogout }: ProfileViewProps) {
  const menuItems = [
    { label: '预约订单管理', icon: ClipboardList, color: 'text-[#006d37]', bg: 'bg-[#006d37]/5', view: 'orders' },
    { label: '长辈健康档案', icon: ShieldCheck, color: 'text-[#735c00]', bg: 'bg-[#735c00]/5', view: 'health' },
    { label: '服务地址管理', icon: MapPin, color: 'text-[#3f4940]', bg: 'bg-[#3f4940]/5', view: 'addresses' },
    { label: '在线客服咨询', icon: Headphones, color: 'text-[#005228]', bg: 'bg-[#005228]/5', badge: true, view: 'customer-service' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="pt-24 px-6 max-w-md mx-auto pb-32"
    >
      {/* Profile Header Section */}
      <section className="relative mb-10">
        <div className="bg-[#f4f4ef] rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#fed65b] opacity-20 rounded-full blur-3xl"></div>
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <img 
                alt="Avatar" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8PUt2bpbTolKa0K-Fs0CU6L5cS4kYZ6J4jt12YMAfb_VBuyzQf9Pew9Hs0Vn54QkYu9rvhqh0ntmloDr-DyJbjqvC79lwoxk6XpWRldBG9LWCmHAdedFSCxHVivBt7Yk-vAs0im9PVMTEmAWz0iWABb7G-0nmKEJ46xTYfrQ6LMCJC8VieHPgVEmpBsW2v-BnWVCy7GWtrLRmxaRlw3_e-Lvox5pi0lvy9hm39dib8eJHerN1rqRYQUy48xyH1PoT6hE_vi8E6_U"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-[#fed65b] text-[#745c00] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              GOLD
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1a1c19] tracking-tight mb-2">尊贵的颐护家用户</h1>
          <p className="text-[#3f4940]/60 font-medium">加入颐护第 428 天</p>
        </div>
      </section>

      {/* Order Tracking */}
      <section className="mb-10">
        <h2 className="text-[#3f4940] font-bold text-sm uppercase tracking-widest mb-4 ml-2">我的服务进度</h2>
        <div className="grid grid-cols-3 gap-4">
          <ServiceProgressItem 
            icon={CalendarDays} 
            label="我的预约" 
            color="text-[#006d37]" 
            bg="bg-[#006d37]/5" 
            onClick={() => onNavigate('orders')}
          />
          <ServiceProgressItem 
            icon={Wallet} 
            label="待支付" 
            color="text-[#735c00]" 
            bg="bg-[#fed65b]/10" 
            onClick={() => onNavigate('orders')}
          />
          <ServiceProgressItem 
            icon={CheckCircle2} 
            label="已完成" 
            color="text-[#3f4940]" 
            bg="bg-[#1a1c19]/5" 
            onClick={() => onNavigate('orders')}
          />
        </div>
      </section>

      {/* Function List */}
      <section className="mb-12 space-y-4">
        <h2 className="text-[#3f4940] font-bold text-sm uppercase tracking-widest mb-4 ml-2">管理与咨询</h2>
        {menuItems.map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigate(item.view)}
            className="group w-full flex items-center justify-between p-5 bg-[#f4f4ef] rounded-2xl hover:bg-[#e8e8e3] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 flex items-center justify-center bg-white rounded-full ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="font-bold text-[#1a1c19] tracking-tight">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && <span className="bg-[#ba1a1a] w-2 h-2 rounded-full"></span>}
              <ChevronRight className="text-[#becabd] group-hover:translate-x-1 transition-transform" size={20} />
            </div>
          </button>
        ))}
      </section>

      {/* Logout Action */}
      <section className="px-2">
        <button 
          onClick={onLogout}
          className="w-full py-5 rounded-2xl border-2 border-[#becabd]/10 text-[#3f4940] font-bold tracking-widest text-sm hover:bg-[#ba1a1a]/5 hover:text-[#ba1a1a] hover:border-[#ba1a1a]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          退出登录
        </button>
        <p className="text-center text-[10px] text-[#becabd] mt-8 font-medium">版本号 2.4.0 • 隐私协议与服务条款</p>
      </section>
    </motion.div>
  );
}

function ServiceProgressItem({ icon: Icon, label, color, bg, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] active:scale-95 transition-all"
    >
      <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      <span className="text-xs font-bold text-[#1a1c19]/80">{label}</span>
    </button>
  );
}
