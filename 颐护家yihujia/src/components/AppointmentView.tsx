import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Home, 
  Stethoscope, 
  Activity, 
  HeartPulse, 
  Plus, 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Info,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface AppointmentViewProps {
  onBack: () => void;
}

export default function AppointmentView({ onBack }: AppointmentViewProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [otherService, setOtherService] = useState('');
  const [timeOption, setTimeOption] = useState<'immediate' | 'future' | null>(null);
  const [address, setAddress] = useState('上海市浦东新区张江路888弄12号302室');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [contactName, setContactName] = useState('王小明');
  const [contactPhone, setContactPhone] = useState('13812345678');
  const [elderlyName, setElderlyName] = useState('');
  const [elderlyAge, setElderlyAge] = useState('');
  const [elderlyGender, setElderlyGender] = useState<'male' | 'female'>('male');
  const [elderlyHealth, setElderlyHealth] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const services = [
    { id: 'basic', label: '基础生活照护', desc: '如：助浴、翻身、喂食', icon: Home },
    { id: 'medical', label: '专业医疗护理', desc: '如：打针、换药、导管护理', icon: Stethoscope },
    { id: 'rehab', label: '康复理疗指导', desc: '如：关节活动、按摩', icon: Activity },
    { id: 'monitor', label: '健康监测评估', desc: '如：测血压、血糖、健康咨询', icon: HeartPulse },
    { id: 'other', label: '其他', desc: '点击后填写具体需求', icon: Plus },
  ];

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selectedServices.length === 0) {
      toast.error('请选择服务类型');
      return;
    }
    if (!timeOption) {
      toast.error('请选择预约时间');
      return;
    }
    
    toast.success('预约申请已提交！', {
      description: '我们正在为您安排专业人员，请保持电话畅通。',
    });
    setTimeout(onBack, 2000);
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
        <h1 className="text-xl font-bold tracking-tight">一键预约上门护理</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-10">
        {/* 1. Service Type */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            <h2 className="text-lg font-bold">您需要什么服务？<span className="text-error ml-1">*</span></h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                  selectedServices.includes(service.id)
                    ? "border-primary bg-primary/5"
                    : "border-outline-variant/10 bg-white"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  selectedServices.includes(service.id) ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant"
                )}>
                  <service.icon size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{service.label}</p>
                  <p className="text-xs text-on-surface-variant/70">{service.desc}</p>
                </div>
                {selectedServices.includes(service.id) && (
                  <CheckCircle2 className="text-primary" size={20} />
                )}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {selectedServices.includes('other') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <textarea
                  placeholder="请简述您的其他需求..."
                  value={otherService}
                  onChange={(e) => setOtherService(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white border-2 border-outline-variant/10 focus:border-primary outline-none transition-all resize-none h-24"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 2. Appointment Time */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            <h2 className="text-lg font-bold">希望何时开始服务？<span className="text-error ml-1">*</span></h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => setTimeOption('immediate')}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                timeOption === 'immediate' ? "border-primary bg-primary/5" : "border-outline-variant/10 bg-white"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                timeOption === 'immediate' ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant"
              )}>
                <Clock size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold">立即预约</p>
                <p className="text-xs text-primary font-bold">极速响应，2小时内上门</p>
              </div>
            </button>
            <button
              onClick={() => setTimeOption('future')}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                timeOption === 'future' ? "border-primary bg-primary/5" : "border-outline-variant/10 bg-white"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                timeOption === 'future' ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant"
              )}>
                <Calendar size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold">预约未来时间</p>
                <p className="text-xs text-on-surface-variant/70">可选择未来3天内的服务时间</p>
              </div>
            </button>
          </div>
        </section>

        {/* 3. Service Address */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            <h2 className="text-lg font-bold">服务地址<span className="text-error ml-1">*</span></h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-2xl border-2 border-outline-variant/10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="text-primary" size={20} />
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">详细地址</span>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="请输入详细服务地址（省市区、街道、门牌号等）"
                className="w-full p-3 bg-surface-container-low rounded-xl outline-none font-bold text-sm resize-none h-24 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button 
              onClick={() => setShowAddressForm(true)}
              className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-2xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span className="font-bold">从地址簿选择</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* 4. Elderly & Contact Info */}
        <section className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              <h2 className="text-lg font-bold">为哪位老人预约？<span className="text-error ml-1">*</span></h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="老人姓名" 
                value={elderlyName}
                onChange={(e) => setElderlyName(e.target.value)}
                className="p-4 rounded-2xl bg-white border-2 border-outline-variant/10 focus:border-primary outline-none" 
              />
              <div className="flex p-1 bg-surface-container-low rounded-2xl">
                <button 
                  onClick={() => setElderlyGender('male')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all",
                    elderlyGender === 'male' ? "bg-white shadow-sm" : "text-on-surface-variant"
                  )}
                >
                  男
                </button>
                <button 
                  onClick={() => setElderlyGender('female')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all",
                    elderlyGender === 'female' ? "bg-white shadow-sm" : "text-on-surface-variant"
                  )}
                >
                  女
                </button>
              </div>
            </div>
            <input 
              type="number" 
              placeholder="老人年龄" 
              value={elderlyAge}
              onChange={(e) => setElderlyAge(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white border-2 border-outline-variant/10 focus:border-primary outline-none" 
            />
            <textarea 
              placeholder="主要健康状况/病史简述 (如高血压、糖尿病、行动不便等，有助于护士提前准备)" 
              value={elderlyHealth}
              onChange={(e) => setElderlyHealth(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white border-2 border-outline-variant/10 focus:border-primary outline-none resize-none h-24"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              <h2 className="text-lg font-bold">联系人信息 (监护人/本人)<span className="text-error ml-1">*</span></h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-outline-variant/10">
                <User size={20} className="text-on-surface-variant" />
                <input 
                  type="text" 
                  placeholder="联系人姓名" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="flex-1 outline-none font-bold" 
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-outline-variant/10">
                <Phone size={20} className="text-on-surface-variant" />
                <input 
                  type="tel" 
                  placeholder="手机号" 
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="flex-1 outline-none font-bold" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Special Requirements */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            <h2 className="text-lg font-bold">其他需要说明的情况 (选填)</h2>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-outline-variant/10">
            <Info size={20} className="text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="例如：需要自带药品、宠物情况、特殊注意事项等" 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-6">
          <button 
            onClick={handleSubmit}
            className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-lg shadow-xl active:scale-95 transition-all"
          >
            立即提交预约
          </button>
          <p className="text-center text-xs text-on-surface-variant/50 mt-4">
            提交即代表您同意《颐护家服务协议》与《隐私政策》
          </p>
        </div>
      </div>

      {/* Address Form Modal (Simplified) */}
      <AnimatePresence>
        {showAddressForm && (
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
              className="w-full bg-surface rounded-t-3xl p-6 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">新增服务地址</h3>
                <button onClick={() => setShowAddressForm(false)} className="p-2 hover:bg-surface-container-low rounded-full">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <select className="p-4 rounded-xl bg-surface-container-low border-none outline-none font-bold"><option>上海市</option></select>
                  <select className="p-4 rounded-xl bg-surface-container-low border-none outline-none font-bold"><option>浦东新区</option></select>
                  <select className="p-4 rounded-xl bg-surface-container-low border-none outline-none font-bold"><option>张江镇</option></select>
                </div>
                <input type="text" placeholder="街道/弄/号" className="w-full p-4 rounded-xl bg-surface-container-low border-none outline-none font-bold" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="楼层" className="p-4 rounded-xl bg-surface-container-low border-none outline-none font-bold" />
                  <div className="flex p-1 bg-surface-container-low rounded-xl">
                    <button className="flex-1 py-3 rounded-lg bg-white shadow-sm font-bold">有电梯</button>
                    <button className="flex-1 py-3 rounded-lg text-on-surface-variant font-bold">无电梯</button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowAddressForm(false)}
                className="w-full py-4 rounded-full bg-primary text-white font-bold"
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
