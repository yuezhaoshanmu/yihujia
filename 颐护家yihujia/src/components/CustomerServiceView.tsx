import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Send, Headphones, User, Phone, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface CustomerServiceViewProps {
  onBack: () => void;
}

export default function CustomerServiceView({ onBack }: CustomerServiceViewProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'agent', text: '您好，颐护家在线客服为您服务。请问有什么可以帮您的？', time: '09:00' },
    { id: 2, sender: 'user', text: '我想咨询一下居家护理的具体流程。', time: '09:01' },
    { id: 3, sender: 'agent', text: '好的，我们的居家护理流程主要包括：1. 在线预约；2. 专业评估；3. 制定方案；4. 上门服务。您可以点击首页的“一键预约”开始。', time: '09:02' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage = { id: Date.now(), sender: 'user', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse = { id: Date.now() + 1, sender: 'agent', text: '收到您的咨询，我们的客服专员正在处理，请稍候。', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatHistory(prev => [...prev, agentResponse]);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 bg-surface z-[60] flex flex-col"
    >
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-3xl px-6 py-4 flex items-center gap-4 z-10 border-b border-outline-variant/10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Headphones size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">在线客服咨询</h1>
            <p className="text-[10px] text-success font-bold">● 客服在线中</p>
          </div>
        </div>
      </header>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {chatHistory.map((chat) => (
          <div key={chat.id} className={cn("flex flex-col", chat.sender === 'user' ? "items-end" : "items-start")}>
            <div className={cn(
              "max-w-[80%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
              chat.sender === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-white text-on-surface rounded-tl-none border border-outline-variant/5"
            )}>
              {chat.text}
            </div>
            <span className="text-[10px] text-on-surface-variant/40 mt-2 font-bold">{chat.time}</span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-surface border-t border-outline-variant/10 pb-10">
        <div className="flex items-center gap-3 p-2 bg-white rounded-full border-2 border-outline-variant/10 shadow-sm focus-within:border-primary transition-all">
          <button className="p-3 text-on-surface-variant/50 hover:text-primary transition-colors">
            <MessageSquare size={20} />
          </button>
          <input 
            type="text" 
            placeholder="输入您想咨询的问题..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent outline-none font-bold text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              message.trim() ? "bg-primary text-white shadow-lg" : "bg-surface-container-low text-on-surface-variant/30"
            )}
          >
            <Send size={18} />
          </button>
        </div>
        
        <div className="flex justify-center gap-8 mt-6">
          <button className="flex flex-col items-center gap-1 text-on-surface-variant/50 hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
              <Phone size={18} />
            </div>
            <span className="text-[10px] font-bold">电话咨询</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-on-surface-variant/50 hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
              <User size={18} />
            </div>
            <span className="text-[10px] font-bold">专属管家</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
