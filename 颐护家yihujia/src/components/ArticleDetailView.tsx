import { motion, useScroll, useSpring } from 'motion/react';
import { ChevronLeft, Clock, User, Share2, Bookmark, ThumbsUp, Sparkles, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import Markdown from 'react-markdown';
import { useRef } from 'react';
import { MOCK_ARTICLES } from '../constants';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
  onNavigateToArticle?: (article: Article) => void;
}

export default function ArticleDetailView({ article, onBack, onNavigateToArticle }: ArticleDetailViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const relatedArticles = MOCK_ARTICLES.filter(a => a.id !== article.id).slice(0, 2);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 bg-surface z-[100] overflow-y-auto no-scrollbar pb-32"
    >
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[110] origin-left"
        style={{ scaleX }}
      />

      {/* Header */}
      <header className="sticky top-0 bg-surface/80 backdrop-blur-3xl px-6 py-4 flex items-center justify-between z-10 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{article.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant">
            <Bookmark size={20} />
          </button>
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Cover Image */}
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="p-6 space-y-8">
          {/* Title & Meta */}
          <div className="space-y-4">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-on-surface">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-xs text-on-surface-variant/50 font-bold">
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{article.readTime}</span>
              </div>
              <span>{article.date}</span>
            </div>
          </div>

          {/* Quick Take Section (核心干货) */}
          <section className="bg-primary/5 rounded-[32px] p-6 border-2 border-primary/10 space-y-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-primary/10">
              <Sparkles size={80} />
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={20} fill="currentColor" />
              <h2 className="text-lg font-black tracking-tight">核心干货 · 一分钟速览</h2>
            </div>
            <ul className="space-y-3 relative z-10">
              {article.quickTake.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm font-bold text-on-surface leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* Content */}
          <article className="markdown-body text-on-surface leading-loose text-lg font-medium space-y-6">
            <Markdown>{article.content}</Markdown>
          </article>

          {/* Footer Actions */}
          <div className="pt-12 border-t border-outline-variant/10 flex flex-col items-center gap-6">
            <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-surface-container-low text-on-surface font-bold hover:bg-primary/10 hover:text-primary transition-all active:scale-95">
              <ThumbsUp size={20} />
              <span>觉得有用，点个赞</span>
            </button>
            <p className="text-xs text-on-surface-variant/30 text-center leading-relaxed">
              本文内容仅供参考，不作为医疗诊断依据。<br/>如有身体不适，请及时咨询专业医生。
            </p>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="pt-12 space-y-6">
              <h3 className="text-xl font-black tracking-tight">为您推荐</h3>
              <div className="grid grid-cols-1 gap-4">
                {relatedArticles.map(rel => (
                  <div 
                    key={rel.id}
                    onClick={() => onNavigateToArticle?.(rel)}
                    className="flex gap-4 p-4 bg-white rounded-2xl border border-outline-variant/10 hover:bg-surface-container-low transition-colors cursor-pointer group"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                      <img src={rel.image} alt={rel.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <h4 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">{rel.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-primary">
                        <span>阅读全文</span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
}
