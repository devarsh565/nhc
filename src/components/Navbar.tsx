import React, { useState } from 'react';
import { Home, Calendar, Phone, Menu, X, MessageSquare, Landmark, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'listings' | 'my-tours' | 'about' | 'faqs' | 'ai-assistant';
  setActiveTab: (tab: 'listings' | 'my-tours' | 'about' | 'faqs' | 'ai-assistant') => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'listings', label: 'Housing Directory', icon: Home },
    { id: 'my-tours', label: 'My Booked Tours', icon: Calendar },
    { id: 'ai-assistant', label: 'Nyumbani AI Assistant', icon: Sparkles },
    { id: 'about', label: 'About NHC', icon: Landmark },
    { id: 'faqs', label: 'Knowledge Base', icon: Phone },
  ] as const;

  const handleNavClick = (tabId: 'listings' | 'my-tours' | 'about' | 'faqs' | 'ai-assistant') => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Keyboard Accessibility: Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-amber-500 focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
      >
        Skip to main content
      </a>

      <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-3 cursor-pointer select-none group" onClick={() => setActiveTab('listings')}>
              <div className="relative bg-emerald-700 p-2.5 rounded-xl text-white shadow-md border border-emerald-500/30 flex items-center justify-center transition-all duration-200 group-hover:bg-emerald-600 group-hover:border-amber-400/50">
                <Landmark className="h-5.5 w-5.5 text-amber-300" aria-hidden="true" />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-900 rounded-full p-0.5 text-[8px] font-bold border border-emerald-800">
                  🏠
                </div>
              </div>
              <div>
                <span className="font-sans text-lg font-black tracking-tight block leading-none text-white group-hover:text-amber-300 transition-colors">
                  NHC <span className="text-amber-400">KENYA</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block mt-0.5 font-semibold">
                  National Housing Corp
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isActive 
                        ? 'bg-emerald-800 text-white shadow-sm' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    style={{ minHeight: '44px' }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Floating AI Assist button on Navbar */}
              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="flex items-center space-x-2 ml-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-400"
                style={{ minHeight: '44px' }}
              >
                <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300 animate-pulse" />
                <span>Nyumbani AI</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="bg-emerald-800 text-emerald-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center"
                aria-label="Open Nyumbani AI Chatbot"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-4 space-y-1 sm:px-3 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-md text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isActive 
                      ? 'bg-emerald-800 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveTab('ai-assistant');
              }}
              className="flex items-center justify-center space-x-2 w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-4 py-3 rounded-md font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              style={{ minHeight: '48px' }}
            >
              <Sparkles className="h-5 w-5 text-amber-300 fill-amber-300" />
              <span>Ask Nyumbani AI Assistant</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
