import React, { useState, useRef, useEffect } from 'react';
import { Logo } from '../brand/Logo.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Menu, 
  X, 
  PlusCircle, 
  FolderOpen, 
  FileText, 
  Users, 
  Building2, 
  Settings, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Generator', route: 'generator' },
    { label: 'Business Tools', route: 'tools' },
    { label: 'Templates', route: 'templates' },
    { label: 'Guides & Blog', route: 'blog' },
    { label: 'FAQ', route: 'faq' },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('home');
  };

  const userInitial = (currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U').toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-0.5 text-left shrink-0"
          aria-label="InvoiceCraft Homepage"
        >
          <Logo variant="full" size="md" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isActive = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
                  isActive ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop Auth & Action Zone */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {!currentUser ? (
            /* Logged Out: Log In | Sign Up | Create Invoice */
            <>
              <button
                onClick={() => handleNavClick('login')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Log In
              </button>
              
              <button
                onClick={() => handleNavClick('signup')}
                className="px-3.5 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                Sign Up
              </button>

              <button
                onClick={() => handleNavClick('generator')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>
            </>
          ) : (
            /* Logged In: Create Invoice | Dashboard | Profile Avatar Dropdown */
            <>
              <button
                onClick={() => handleNavClick('generator')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Invoice</span>
              </button>

              <button
                onClick={() => handleNavClick('dashboard')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentRoute === 'dashboard' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
                <span>Dashboard</span>
              </button>

              {/* User Avatar Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  aria-label="User Account Menu"
                  aria-expanded={userDropdownOpen}
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {userInitial}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate hidden xl:inline">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    {/* User Info Header */}
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.displayName || 'InvoiceCraft User'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="py-1 text-xs text-slate-700">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Dashboard</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Invoices</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Drafts</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Customers</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Business Settings</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Account Settings</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser ? (
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs"
              aria-label="Open Dashboard"
            >
              {userInitial}
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-md"
            >
              Log In
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {currentUser ? (
            <div className="p-3 bg-slate-50 rounded-xl mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{currentUser.displayName || 'Logged in'}</p>
                <p className="text-[11px] text-slate-500 font-mono">{currentUser.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavClick('signup')}
                className="w-full py-2 text-center text-xs font-bold text-white bg-blue-600 rounded-lg"
              >
                Sign Up Free
              </button>
            </div>
          )}

          <button
            onClick={() => handleNavClick('generator')}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>

          {currentUser && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>User Dashboard</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick('tools')}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <span>Business Document Tools</span>
          </button>
          
          <button
            onClick={() => handleNavClick('templates')}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <span>Invoice Templates</span>
          </button>
          
          <button
            onClick={() => handleNavClick('blog')}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <span>Guides & Articles</span>
          </button>

          <button
            onClick={() => handleNavClick('faq')}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <span>Frequently Asked Questions</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button onClick={() => handleNavClick('about')} className="hover:text-slate-800">About</button>
            <span>·</span>
            <button onClick={() => handleNavClick('contact')} className="hover:text-slate-800">Contact</button>
            <span>·</span>
            <button onClick={() => handleNavClick('privacy')} className="hover:text-slate-800">Privacy</button>
            <span>·</span>
            <button onClick={() => handleNavClick('terms')} className="hover:text-slate-800">Terms</button>
          </div>
        </div>
      )}
    </header>
  );
};
