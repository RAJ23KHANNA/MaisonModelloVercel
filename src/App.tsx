import { useState } from 'react';
import { Home, User, Briefcase, MessageSquare, Bell, Search, Menu, X } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { ModelProfile } from './components/ModelProfile';
import { DesignerProfile } from './components/DesignerProfile';
import { JobPosting } from './components/JobPosting';
import { Feed } from './components/Feed';
import { Messaging } from './components/Messaging';
import { SearchDiscover } from './components/SearchDiscover';
import { Notifications } from './components/Notifications';

type Page = 'landing' | 'auth' | 'feed' | 'model-profile' | 'designer-profile' | 'job' | 'messaging' | 'search' | 'notifications';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('feed');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />;
      case 'feed':
        return <Feed onNavigate={setCurrentPage} />;
      case 'model-profile':
        return <ModelProfile onNavigate={setCurrentPage} />;
      case 'designer-profile':
        return <DesignerProfile onNavigate={setCurrentPage} />;
      case 'job':
        return <JobPosting onNavigate={setCurrentPage} />;
      case 'messaging':
        return <Messaging onNavigate={setCurrentPage} />;
      case 'search':
        return <SearchDiscover onNavigate={setCurrentPage} />;
      case 'notifications':
        return <Notifications onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  if (!isLoggedIn && currentPage !== 'landing' && currentPage !== 'auth') {
    return <LandingPage onNavigate={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {isLoggedIn && currentPage !== 'landing' && currentPage !== 'auth' && (
        <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setCurrentPage('feed')}
                  className="flex items-center gap-2"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-lg flex items-center justify-center">
                    <span className="text-amber-400">R</span>
                  </div>
                  <span className="text-neutral-800 hidden sm:block">MaisonModello</span>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                  <button
                    onClick={() => setCurrentPage('feed')}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                      currentPage === 'feed' ? 'text-amber-600' : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-xs">Home</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('search')}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                      currentPage === 'search' ? 'text-amber-600' : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <Search className="w-5 h-5" />
                    <span className="text-xs">Discover</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('job')}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                      currentPage === 'job' ? 'text-amber-600' : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="text-xs">Jobs</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('messaging')}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                      currentPage === 'messaging' ? 'text-amber-600' : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-xs">Messages</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('notifications')}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition relative ${
                      currentPage === 'notifications' ? 'text-amber-600' : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="text-xs">Alerts</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('model-profile')}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                      currentPage === 'model-profile' ? 'text-amber-600' : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-xs">Profile</span>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-600 hover:text-neutral-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Upgrade Button */}
              <button className="hidden md:block px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition">
                Upgrade to Pro
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-neutral-200">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setCurrentPage('feed'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700"
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('search'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700"
                  >
                    <Search className="w-5 h-5" />
                    <span>Discover</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('job'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Jobs</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('messaging'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Messages</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('notifications'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('model-profile'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      {renderPage()}
    </div>
  );
}
