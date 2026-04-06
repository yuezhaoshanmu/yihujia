/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ViewType } from './types';
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
import { Article } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (!isLoggedIn) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article-detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView 
            onStartAppointment={() => setCurrentView('appointment')} 
            onNavigate={(view) => setCurrentView(view)}
            onArticleClick={handleArticleClick}
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
            onLogout={() => setIsLoggedIn(false)}
          />
        );
      case 'appointment':
        return <AppointmentView onBack={() => setCurrentView('home')} />;
      case 'booking':
        return <BookingView onBack={() => setCurrentView('home')} />;
      case 'medication':
        return <MedicationView onBack={() => setCurrentView('home')} />;
      case 'sos':
        return <SOSView onBack={() => setCurrentView('home')} />;
      case 'health':
        return <HealthView onBack={() => setCurrentView('profile')} onArticleClick={handleArticleClick} />;
      case 'treehole':
        return <TreeHoleView onBack={() => setCurrentView('home')} />;
      case 'orders':
        return <OrderListView onBack={() => setCurrentView('profile')} />;
      case 'addresses':
        return <AddressView onBack={() => setCurrentView('profile')} />;
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
            onStartAppointment={() => setCurrentView('appointment')} 
            onNavigate={(view) => setCurrentView(view)}
            onArticleClick={handleArticleClick}
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
      
      {/* Contextual FAB (Only on Home) */}
      {currentView === 'home' && (
        <button className="fixed bottom-28 right-8 w-16 h-16 rounded-full bg-[#005228] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all z-40">
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
