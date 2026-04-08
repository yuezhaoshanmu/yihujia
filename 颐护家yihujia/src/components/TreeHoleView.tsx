import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Phone, User, Bot, ChevronLeft, Loader2, Send, Keyboard, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { getChatResponse } from '../lib/gemini';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isVoice?: boolean;
}

interface TreeHoleViewProps {
  onBack?: () => void;
}

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function TreeHoleView({ onBack }: TreeHoleViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '您好，我是您的 AI 陪伴员小颐。今天心情怎么样？有没有什么想和我分享的小事？',
      sender: 'ai',
    },
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript, true);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          toast.error('请允许麦克风权限以使用语音功能');
        } else {
          toast.error('语音识别失败，请重试或使用文字输入');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string, isVoice = false) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      isVoice
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Prepare history for Gemini
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.text }]
      }));

      const aiResponse = await getChatResponse(text, history);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast.error('AI 暂时无法回应，请稍后再试');
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.error('您的浏览器不支持语音识别，请使用文字输入');
      return;
    }
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recognition:', error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const handleTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

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
        className="flex-1 overflow-y-auto no-scrollbar pt-6 pb-32 px-6 max-w-2xl mx-auto w-full flex flex-col"
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
                  {msg.isVoice ? (
                    <div className="flex items-center gap-3 py-1">
                      <Volume2 size={20} />
                      <div className="flex gap-1 items-center">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="w-1 h-4 bg-white/40 rounded-full" />
                        ))}
                      </div>
                      <span className="text-sm font-bold opacity-80 ml-2">语音消息</span>
                    </div>
                  ) : (
                    <p className="text-lg leading-relaxed">{msg.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <Bot size={24} />
                </div>
                <div className="p-6 rounded-xl bg-white rounded-tl-none shadow-sm border border-outline-variant/10 flex items-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={20} />
                  <span className="text-on-surface-variant font-medium">小颐正在思考...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Interaction Area */}
      <section className="fixed bottom-24 left-0 w-full px-6 py-4 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/10 z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => setInputMode(inputMode === 'voice' ? 'text' : 'voice')}
            className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all active:scale-90"
          >
            {inputMode === 'voice' ? <Keyboard size={24} /> : <Mic size={24} />}
          </button>

          {inputMode === 'text' ? (
            <form onSubmit={handleTextSubmit} className="flex-1 flex items-center gap-3">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="输入您想说的话..."
                className="flex-1 bg-white border-2 border-outline-variant/10 rounded-2xl px-5 py-3 outline-none focus:border-primary font-medium transition-all"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none active:scale-90 transition-all"
              >
                <Send size={20} />
              </button>
            </form>
          ) : (
            <div className="flex-1 relative flex items-center justify-center">
              <button 
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={cn(
                  "w-full py-3 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3",
                  isRecording 
                    ? "bg-error text-white shadow-xl shadow-error/20 scale-[1.02]" 
                    : "bg-primary text-white shadow-lg shadow-primary/20"
                )}
              >
                {isRecording ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>正在倾听...</span>
                  </>
                ) : (
                  <>
                    <Mic size={20} />
                    <span>按住 说话</span>
                  </>
                )}
              </button>
              
              {/* Recording Animation Overlay */}
              <AnimatePresence>
                {isRecording && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed bottom-48 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-8 py-6 rounded-3xl flex flex-col items-center gap-4 text-white z-50 pointer-events-none"
                  >
                    <div className="flex items-center gap-1.5 h-12">
                      {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-primary rounded-full"
                          animate={{ height: [15, 45, 15] }}
                          transition={{ repeat: Infinity, duration: 1, delay, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                    <span className="font-bold tracking-widest">正在识别您的声音...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
