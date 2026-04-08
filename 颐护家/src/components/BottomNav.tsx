import { Home, Utensils, MessageCircle, User } from 'lucide-react';
import { ViewType } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'recipes', label: '食谱', icon: Utensils },
    { id: 'treehole', label: '树洞', icon: MessageCircle },
    { id: 'profile', label: '我的', icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md rounded-[48px] bg-white/90 backdrop-blur-2xl z-50 flex justify-around items-center px-4 py-3 shadow-[0_20px_50px_rgba(0,109,55,0.12)]">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "relative flex flex-col items-center justify-center transition-all duration-300 ease-out",
              isActive 
                ? "bg-gradient-to-br from-[#005228] to-[#006d37] text-white rounded-full px-6 py-2 shadow-inner scale-105" 
                : "text-[#1a1c19]/50 hover:bg-[#f4f4ef] rounded-full px-4 py-2"
            )}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
            {isActive && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-0 bg-gradient-to-br from-[#005228] to-[#006d37] rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
