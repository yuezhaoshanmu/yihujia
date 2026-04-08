/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ViewType } from './types';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import RecipeView from './components/RecipeView';
import ProfileView from './components/ProfileView';
import AppointmentView from './components/AppointmentView';
import BookingView from './components/BookingView';
import MedicationView from './components/MedicationView';
import SOSView from './components/SOSView';
import HealthView from './components/HealthView';
import TreeHoleView from './components/TreeHoleView';
import OrderListView from './components/OrderListView';
import AddressView from './components/AddressView';
import CustomerServiceView from './components/CustomerServiceView';
import LoginView from './components/LoginView';
import ArticleDetailView from './components/ArticleDetailView';
import AppointmentModal from './components/AppointmentModal';
import { Article } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Avoid logging if the reason is null or undefined
      if (!event.reason) return;
      
      console.error('Unhandled Rejection Details:', {
        reason: event.reason,
        promise: event.promise
      });
      
      let message = '';
      if (event.reason instanceof Error) {
        message = event.reason.message;
      } else if (typeof event.reason === 'string') {
        message = event.reason;
      } else if (event.reason && typeof event.reason === 'object' && 'message' in event.reason) {
        message = (event.reason as any).message;
      } else {
        try {
          message = JSON.stringify(event.reason);
        } catch (e) {
          message = String(event.reason);
        }
      }
      
      if (!message || message === '{}' || message === '[object Object]') {
        message = '未知异步错误';
      }
      
      if (message.includes('fetch') || message.includes('NetworkError') || message.includes('Failed to fetch')) {
        toast.error('网络连接失败，请检查您的网络设置或刷新页面');
      } else if (message.includes('Supabase') || message.includes('auth')) {
        console.warn('Auth-related unhandled rejection:', message);
        toast.error(`身份验证错误: ${message}`);
      } else {
        toast.error(`系统错误: ${message}`);
      }
    };

    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global Error:', event.error);
      toast.error(`系统错误: ${event.message}`);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);
    
    // Check active sessions and sets the user
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to get session:', err);
        setLoading(false);
        // If it's a network error, the global handler will also catch it
      });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else if (!session) {
        // Only clear if no session is present (and not in mock mode)
        // We'll handle mock mode by not clearing if user is already set manually
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginView onLogin={(mockUser?: any) => {
      if (mockUser) {
        setUser(mockUser);
      }
    }} />;
  }

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article-detail');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setCurrentView('home');
      toast.success('已成功退出登录');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if signOut fails on server, we should clear local state
      setUser(null);
      setCurrentView('home');
      toast.error('退出登录时出现问题，已为您清除本地会话');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView 
            onStartAppointment={() => setIsAppointmentModalOpen(true)} 
            onNavigate={(view) => setCurrentView(view)}
            onArticleClick={handleArticleClick}
            user={user}
          />
        );
      case 'recipes':
        return <RecipeView />;
      case 'companion':
        return <TreeHoleView />;
      case 'profile':
        return (
          <ProfileView 
            onNavigate={(view) => setCurrentView(view)} 
            onLogout={handleLogout}
            user={user}
          />
        );
      case 'appointment':
        return <AppointmentView onBack={() => setCurrentView('home')} />;
      case 'booking':
        return <BookingView onBack={() => setCurrentView('home')} />;
      case 'medication':
        return <MedicationView onBack={() => setCurrentView('home')} user={user} />;
      case 'sos':
        return <SOSView onBack={() => setCurrentView('home')} />;
      case 'health':
        return <HealthView onBack={() => setCurrentView('profile')} onArticleClick={handleArticleClick} user={user} />;
      case 'treehole':
        return <TreeHoleView onBack={() => setCurrentView('home')} />;
      case 'orders':
        return <OrderListView onBack={() => setCurrentView('profile')} user={user} />;
      case 'addresses':
        return <AddressView onBack={() => setCurrentView('profile')} user={user} />;
      case 'customer-service':
        return <CustomerServiceView onBack={() => setCurrentView('profile')} />;
      case 'article-detail':
        return selectedArticle ? (
          <ArticleDetailView 
            article={selectedArticle} 
            onBack={() => {
              setSelectedArticle(null);
              setCurrentView('home');
            }} 
            onNavigateToArticle={(article) => {
              setSelectedArticle(article);
              // No need to change view, just update selectedArticle
            }}
          />
        ) : null;
      default:
        return (
          <HomeView 
            onStartAppointment={() => setIsAppointmentModalOpen(true)} 
            onNavigate={(view) => setCurrentView(view)}
            onArticleClick={handleArticleClick}
            user={user}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopBar />
      
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
      
      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
        user={user}
        onSuccess={() => setCurrentView('orders')}
      />
      
      {/* Contextual FAB (Only on Home) */}
      {currentView === 'home' && (
        <button 
          onClick={() => setIsAppointmentModalOpen(true)}
          className="fixed bottom-28 right-8 w-16 h-16 rounded-full bg-[#005228] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all z-40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            <line x1="12" y1="7" x2="12" y2="11" />
            <line x1="10" y1="9" x2="14" y2="9" />
          </svg>
        </button>
      )}
    </div>
  );
}
