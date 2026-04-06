import { Apple, Clock, TrendingUp, Flame, Heart, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function RecipeView() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const categories = ['全部', '高血压', '糖尿病', '康复期', '易消化'];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 px-6 max-w-5xl mx-auto pb-32"
    >
      {/* Header Section */}
      <section className="mb-10 p-8 rounded-3xl bg-gradient-to-br from-[#005228]/10 to-[#f4f4ef] relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-[#1a1c19] mb-2 tracking-tight">今日推荐食谱</h1>
          <p className="text-lg text-[#3f4940] max-w-md mb-6 leading-relaxed">
            王奶奶，根据您本周的健康数据，我们为您定制了营养均衡的餐食建议。
          </p>
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm">
            <Apple className="text-[#735c00]" size={24} />
            <div>
              <p className="text-xs text-[#735c00] font-bold">建议摄入量</p>
              <p className="text-sm font-extrabold text-[#005228]">1800 - 2100 千卡</p>
            </div>
          </div>
        </div>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#005228]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-32 h-32 bg-[#735c00]/10 rounded-full blur-2xl"></div>
      </section>

      {/* Category Tabs */}
      <nav className="flex gap-3 mb-8 overflow-x-auto no-scrollbar py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-8 py-3 rounded-full font-bold whitespace-nowrap transition-all",
              activeCategory === cat
                ? "bg-gradient-to-br from-[#005228] to-[#006d37] text-white shadow-lg shadow-[#005228]/20"
                : "bg-[#f4f4ef] text-[#3f4940] hover:bg-[#e8e8e3]"
            )}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Featured Recipe Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        <div className="md:col-span-8 group cursor-pointer">
          <div className="relative h-[480px] rounded-3xl overflow-hidden bg-[#f4f4ef]">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbptChA2FRWPzqdmZCLhQq-0nIVxnn4crzT9wcS58thmxIaXCVWDiqZ1a6jKRchohv_7-TRFUTPhOwunyRKsS-Bs1AjwxPzVhb1FdDS3-4n8dPn4388_pcwipR2Ec9_qqztc58vH1RVeHqu6Dbp_U2IzfWJHedUACMUsijNMLxafApPtgYjPdK50dGSK9_xrIRx2nY8buxeQkVWNniS3C0q_iw7upOVeLNP7FcXGXXtRtYFUB_y0SRp5zIYmvYL7jtG734_uVrSL0"
              referrerPolicy="no-referrer"
              alt="Featured Recipe"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-[#fed65b] text-[#745c00] rounded-full text-xs font-bold">本周最火</span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold">低GI</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2">清爽鸡肉牛油果沙拉</h2>
              <p className="text-white/80 text-lg mb-6 max-w-md">富含优质蛋白质与健康油脂，适合追求轻食与心血管健康的人群。</p>
              <div className="flex items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-sm font-medium">15 分钟</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">简单难度</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame size={16} />
                  <span className="text-sm font-medium">342 千卡</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Tips */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-[#fed65b] rounded-3xl p-8 flex-1 flex flex-col justify-between">
            <div>
              <TrendingUp className="text-[#745c00] mb-4" size={40} />
              <h3 className="text-xl font-bold text-[#745c00]">健康达人榜</h3>
              <p className="text-[#745c00]/70 text-sm mt-2">您已连续坚持科学膳食 12 天</p>
            </div>
            <button className="w-full py-4 bg-white text-[#745c00] font-bold rounded-full shadow-sm hover:shadow-md transition-shadow">
              查看勋章
            </button>
          </div>
          <div className="bg-[#f4f4ef] rounded-3xl p-8 flex-1">
            <h3 className="text-lg font-bold text-[#1a1c19] mb-4">营养师贴士</h3>
            <p className="text-[#3f4940] italic leading-relaxed">
              “早起一杯温开水，餐前先喝汤。增加膳食纤维摄入能有效控制血糖波动。”
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#005228]/20 flex items-center justify-center text-[#005228] font-bold text-xs italic">DR</div>
              <span className="text-xs font-bold text-[#3f4940]">陈医生 · 营养学科</span>
            </div>
          </div>
        </div>
      </div>

      {/* More Recipes */}
      <h3 className="text-2xl font-extrabold text-[#1a1c19] mb-8 px-2">更多营养选择</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RecipeListItem 
          title="清蒸深海鳕鱼配时蔬"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuCLwWwzixXC7RD4FkReCgvncxfMqa3KynJrkLSGoHeYR5wBTJNTMiLvN-kWQ6sbxcbItD4yW-MAPHe40zUt-UQcCxSr-cm_PUUN3r4eyeHlzBsbLW2Z9ff0jt1SQDCBf0Pvrv15wDZ5wB_vY5eJ6mig_s_WSOnbfCXL35rY9BcgetVNLVpA3g_xAOZqvnyKHX1fiXiQZooyAiqX9lw1OL7JHBin7d9SjzjM-RozVnDqJRcKm-yKIMRueyQ8_Hd2GYJKKaYGip4lXbw"
          tag="高蛋白"
          labels={['低盐高钾', '无糖']}
          time="20 mins"
          difficulty="中等"
          calories={280}
        />
        <RecipeListItem 
          title="五谷粗粮养生粥"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuCS02EfkjV8anJnVac-zH6bgCUAC7IzHsBUBvI7XTe1mknos_3i3-PSZ0IPKI9xUuu1UaGHh5GGWO6GLaBTkS7_g4PUtHAbsahkigBViHadZ9UCLsuFSSd3WycocmYpYFL7InX1DQQEfVJbzZYWR33NZjIvxuG-Adn0RrhAmlmpBELccaVJ9Dhr46nfwwkCM07lLXNRfggCnWCP_XCNedAQ1Ef6m4Q0aJu4I9RSaJZxSHKt9uYfuPAHrQsnd34Kf2aPxiKZfZ5vDDc"
          tag="暖胃"
          labels={['易消化', '高纤维']}
          time="45 mins"
          difficulty="简单"
          calories={195}
        />
      </div>
    </motion.div>
  );
}

function RecipeListItem({ title, image, tag, labels, time, difficulty, calories }: any) {
  return (
    <div className="group flex flex-col gap-4 bg-white p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="aspect-video rounded-2xl overflow-hidden relative">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={image} 
          referrerPolicy="no-referrer"
          alt={title}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-[#005228]">{tag}</span>
        </div>
      </div>
      <div className="px-2 pb-2">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xl font-bold text-[#1a1c19]">{title}</h4>
          <Heart className="text-[#3f4940]/40 hover:text-red-500 transition-colors" size={20} />
        </div>
        <div className="flex gap-2 mb-4">
          {labels.map((label: string) => (
            <span key={label} className="text-[10px] font-bold uppercase tracking-wider text-[#735c00] bg-[#735c00]/10 px-2 py-0.5 rounded">
              {label}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center text-[#3f4940] text-sm border-t border-[#eeeee9] pt-4 mt-2">
          <span>{time} · {difficulty}</span>
          <span className="font-bold text-[#005228]">{calories} Kcal</span>
        </div>
      </div>
    </div>
  );
}
