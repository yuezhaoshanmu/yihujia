import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Phone, User, Bot, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isVoice?: boolean;
}

interface TreeHoleViewProps {
  onBack?: () => void;
}

export default function TreeHoleView({ onBack }: TreeHoleViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '您好，我是您的 AI 陪伴员。今天心情怎么样？有没有什么想和我分享的小事？',
      sender: 'ai',
    },
    {
      id: '2',
      text: '今天和老伴去公园散步了，看见满园的郁金香都开了，挺开心的。',
      sender: 'user',
      isVoice: true
    },
    {
      id: '3',
      text: '听起来真美好！郁金香确实很漂亮。老两口一起散步是最幸福的事了，您平时也喜欢去那家公园吗？',
      sender: 'ai',
    },
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-surface overflow-hidden relative">
      {onBack && (
        <header className="sticky top-0 bg-surface/80 backdrop-blur-3xl px-6 py-4 flex items-center gap-4 z-30 border-b border-outline-variant/10">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight">心情树洞</h1>
        </header>
      )}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar pt-6 pb-48 px-6 max-w-2xl mx-auto w-full flex flex-col"
      >
        {/* Hero Section */}
        <section className="mb-10 p-8 rounded-xl bg-gradient-to-br from-[#fed65b] to-[#ffdfa0] text-[#745c00] shadow-sm relative overflow-hidden shrink-0">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
          <h1 className="text-2xl font-extrabold mb-4 leading-tight tracking-tight">
            颐护家 AI 陪伴员<br/>全天候倾听您的心声
          </h1>
          <p className="text-base opacity-90 mb-6 font-medium">无论何时，我都在这里陪伴您，像老朋友一样聊天。</p>
          <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-4 rounded-lg w-fit">
            <div className="w-10 h-10 bg-error rounded-full flex items-center justify-center text-white shadow-lg">
              <Phone size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">24H 心理急救热线</p>
              <p className="text-lg font-black">400-123-4567</p>
            </div>
          </div>
        </section>

        {/* Conversation History */}
        <div className="space-y-8 flex-1">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-4",
                  msg.sender === 'user' ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                  msg.sender === 'ai' ? "bg-primary text-white shadow-primary/20" : "bg-secondary-container text-on-secondary-container shadow-sm"
                )}>
                  {msg.sender === 'ai' ? <Bot size={24} /> : <User size={24} />}
                </div>
                <div className={cn(
                  "p-6 rounded-xl shadow-sm max-w-[85%] border border-outline-variant/10",
                  msg.sender === 'ai' ? "bg-white rounded-tl-none" : "bg-primary-container text-white rounded-tr-none"
                )}>
                  {msg.isVoice && (
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                      <Mic size={14} />
                      <span className="text-sm font-bold">语音输入</span>
                    </div>
                  )}
                  <p className="text-lg leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Interaction Area */}
      <section className="fixed bottom-32 left-0 w-full px-6 flex flex-col items-center pointer-events-none z-20">
        <div className={cn(
          "flex items-center gap-1.5 h-10 mb-6 transition-opacity duration-300",
          isRecording ? "opacity-100" : "opacity-0"
        )}>
          {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((delay, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary rounded-full"
              animate={{ height: [10, 35, 10] }}
              transition={{ repeat: Infinity, duration: 1.2, delay, ease: "easeInOut" }}
            />
          ))}
        </div>
        
        <button 
          onMouseDown={() => setIsRecording(true)}
          onMouseUp={() => setIsRecording(false)}
          onTouchStart={() => setIsRecording(true)}
          onTouchEnd={() => setIsRecording(false)}
          className={cn(
            "pointer-events-auto w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex flex-col items-center justify-center shadow-2xl transition-all duration-300 group active:scale-90",
            isRecording && "scale-110 shadow-[0_0_40px_rgba(0,109,55,0.4)]"
          )}
        >
          <Mic size={48} className={cn("mb-1 transition-transform", isRecording && "scale-110")} fill="currentColor" />
          <span className="text-sm font-bold tracking-widest">按住说话</span>
        </button>
        <p className={cn(
          "mt-4 text-on-surface-variant font-bold pointer-events-auto transition-opacity",
          isRecording ? "opacity-100" : "opacity-40"
        )}>
          {isRecording ? "AI 正在倾听您的声音..." : "点击上方按钮开始对话"}
        </p>
      </section>
    </div>
  );
}
