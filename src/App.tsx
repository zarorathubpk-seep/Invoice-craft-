import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { CookieConsent } from './components/common/CookieConsent.tsx';
import { HomePage } from './components/pages/HomePage.tsx';
import { ToolsPage } from './components/pages/ToolsPage.tsx';
import { InvoiceEditor } from './components/generator/InvoiceEditor.tsx';
import { DashboardPage } from './components/dashboard/DashboardPage.tsx';
import { AuthPage } from './components/auth/AuthPage.tsx';
import { QuotationGenerator } from './components/tools/QuotationGenerator.tsx';
import { ReceiptGenerator } from './components/tools/ReceiptGenerator.tsx';
import { ProFormaGenerator } from './components/tools/ProFormaGenerator.tsx';
import { CreditNoteGenerator } from './components/tools/CreditNoteGenerator.tsx';
import { TaxCalculator } from './components/tools/TaxCalculator.tsx';
import { ProfitMarginCalculator } from './components/tools/ProfitMarginCalculator.tsx';
import { DiscountCalculator } from './components/tools/DiscountCalculator.tsx';
import { PaymentTermsCalculator } from './components/tools/PaymentTermsCalculator.tsx';
import { ExpenseTracker } from './components/tools/ExpenseTracker.tsx';
import { TemplateLibrary } from './components/templates/TemplateLibrary.tsx';
import { BlogList } from './components/blog/BlogList.tsx';
import { BlogPost } from './components/blog/BlogPost.tsx';
import { AboutPage } from './components/pages/AboutPage.tsx';
import { ContactPage } from './components/pages/ContactPage.tsx';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './components/pages/TermsPage.tsx';
import { DisclaimerPage } from './components/pages/DisclaimerPage.tsx';
import { CookiePolicyPage } from './components/pages/CookiePolicyPage.tsx';
import { EditorialPolicyPage } from './components/pages/EditorialPolicyPage.tsx';
import { FaqPage } from './components/pages/FaqPage.tsx';
import { SitemapPage } from './components/pages/SitemapPage.tsx';
import { BrandAssetsPage } from './components/pages/BrandAssetsPage.tsx';
import { InvoiceData } from './types/invoice.ts';

function AppContent() {
  const { currentUser, loading, setPendingAction, pendingAction } = useAuth();

  // Read route from window hash or default to 'home'
  const getInitialRoute = (): string => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) {
      const path = window.location.pathname.replace(/^\//, '');
      if (path) return path;
      return 'home';
    }
    return hash;
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [selectedInvoiceDraft, setSelectedInvoiceDraft] = useState<InvoiceData | undefined>(undefined);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      setCurrentRoute(hash || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = `#${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Protected route action handler
  const handleProtectedAction = (targetRoute: string, payload?: any) => {
    if (!currentUser) {
      setPendingAction({ route: targetRoute, payload });
      navigate('login');
      return;
    }
    if (payload) {
      setSelectedInvoiceDraft(payload);
    }
    navigate(targetRoute);
  };

  const handleSelectTemplate = (invoiceData: InvoiceData) => {
    if (!currentUser) {
      setPendingAction({ route: 'generator', payload: invoiceData });
      navigate('login');
      return;
    }
    setSelectedInvoiceDraft(invoiceData);
    navigate('generator');
  };

  const handleConvertToInvoice = (invoiceData: InvoiceData) => {
    if (!currentUser) {
      setPendingAction({ route: 'generator', payload: invoiceData });
      navigate('login');
      return;
    }
    setSelectedInvoiceDraft(invoiceData);
    navigate('generator');
  };

  const handleEditInvoiceFromDashboard = (invoiceData: InvoiceData) => {
    setSelectedInvoiceDraft(invoiceData);
    navigate('generator');
  };

  // Structured Data (Schema.org) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'InvoiceCraft',
    url: 'https://zarorathub.shop',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Free online invoice generator, business document tools, and invoice templates for freelancers and small businesses.',
  };

  // Render view based on route
  const renderContent = () => {
    // Show clean spinner while Firebase restores session to prevent UI flashing
    if (loading && (currentRoute === 'generator' || currentRoute === 'dashboard')) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Restoring secure session...</p>
        </div>
      );
    }

    // Auth Routes
    if (currentRoute === 'login') {
      return (
        <AuthPage
          initialMode="login"
          onNavigate={navigate}
          onSuccess={() => {
            if (pendingAction) {
              const target = pendingAction.route;
              if (pendingAction.payload) setSelectedInvoiceDraft(pendingAction.payload);
              setPendingAction(null);
              navigate(target);
            } else {
              navigate('dashboard');
            }
          }}
        />
      );
    }

    if (currentRoute === 'signup') {
      return (
        <AuthPage
          initialMode="signup"
          onNavigate={navigate}
          onSuccess={() => {
            if (pendingAction) {
              const target = pendingAction.route;
              if (pendingAction.payload) setSelectedInvoiceDraft(pendingAction.payload);
              setPendingAction(null);
              navigate(target);
            } else {
              navigate('dashboard');
            }
          }}
        />
      );
    }

    // Protected Route: Dashboard
    if (currentRoute === 'dashboard') {
      if (!currentUser) {
        return (
          <AuthPage
            initialMode="login"
            onNavigate={navigate}
            onSuccess={() => navigate('dashboard')}
          />
        );
      }
      return (
        <DashboardPage
          onNavigate={navigate}
          onEditInvoice={handleEditInvoiceFromDashboard}
          onSelectTemplate={handleSelectTemplate}
        />
      );
    }

    // Protected Route: Generator
    if (currentRoute === 'generator' || currentRoute === 'tools/invoice-generator') {
      if (!currentUser) {
        return (
          <AuthPage
            initialMode="login"
            onNavigate={navigate}
            onSuccess={() => navigate('generator')}
          />
        );
      }
      return (
        <InvoiceEditor
          initialInvoice={selectedInvoiceDraft}
          onNavigate={navigate}
        />
      );
    }

    // Public Route: Home
    if (currentRoute === 'home' || currentRoute === '') {
      return (
        <HomePage
          onNavigate={(target) => {
            if (target === 'generator' && !currentUser) {
              handleProtectedAction('generator');
            } else {
              navigate(target);
            }
          }}
          onSelectTemplate={handleSelectTemplate}
        />
      );
    }

    // Public Route: Business Suite Hub
    if (currentRoute === 'tools') {
      return <ToolsPage onNavigate={navigate} />;
    }

    if (currentRoute === 'tools/quotation') {
      return <QuotationGenerator onConvertToInvoice={handleConvertToInvoice} />;
    }

    if (currentRoute === 'tools/receipt') {
      return <ReceiptGenerator />;
    }

    if (currentRoute === 'tools/pro-forma') {
      return <ProFormaGenerator />;
    }

    if (currentRoute === 'tools/credit-note') {
      return <CreditNoteGenerator />;
    }

    if (currentRoute === 'tools/tax-calculator') {
      return <TaxCalculator />;
    }

    if (currentRoute === 'tools/profit-margin') {
      return <ProfitMarginCalculator />;
    }

    if (currentRoute === 'tools/discount-calculator') {
      return <DiscountCalculator />;
    }

    if (currentRoute === 'tools/payment-terms') {
      return <PaymentTermsCalculator />;
    }

    if (currentRoute === 'tools/expenses') {
      return <ExpenseTracker />;
    }

    if (currentRoute === 'templates') {
      return <TemplateLibrary onSelectTemplate={handleSelectTemplate} />;
    }

    if (currentRoute === 'blog') {
      return <BlogList onSelectArticle={(slug) => navigate(`blog/${slug}`)} />;
    }

    if (currentRoute.startsWith('blog/')) {
      const slug = currentRoute.replace('blog/', '');
      return (
        <BlogPost
          slug={slug}
          onBackToBlog={() => navigate('blog')}
          onSelectArticle={(newSlug) => navigate(`blog/${newSlug}`)}
          onNavigateToTool={(path) => navigate(path.replace(/^\//, ''))}
        />
      );
    }

    if (currentRoute === 'about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (currentRoute === 'contact') {
      return <ContactPage />;
    }

    if (currentRoute === 'privacy') {
      return <PrivacyPolicyPage />;
    }

    if (currentRoute === 'terms') {
      return <TermsPage />;
    }

    if (currentRoute === 'disclaimer') {
      return <DisclaimerPage />;
    }

    if (currentRoute === 'cookie-policy') {
      return <CookiePolicyPage />;
    }

    if (currentRoute === 'editorial-policy') {
      return <EditorialPolicyPage />;
    }

    if (currentRoute === 'faq') {
      return <FaqPage onNavigate={navigate} />;
    }

    if (currentRoute === 'sitemap') {
      return <SitemapPage onNavigate={navigate} />;
    }

    if (currentRoute === 'brand' || currentRoute === 'favicon') {
      return <BrandAssetsPage />;
    }

    // 404 Fallback
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
        <p className="text-base text-slate-600">The requested page or document could not be found.</p>
        <button
          onClick={() => navigate('home')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
        >
          Return to Homepage
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* JSON-LD Script for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header currentRoute={currentRoute} navigate={navigate} />

      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer navigate={navigate} />
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
