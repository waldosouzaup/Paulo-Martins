
import React from 'react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Properties } from './pages/Properties';
import { Contact } from './pages/Contact';
import { PropertyDetails } from './pages/PropertyDetails';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { AltoSobradinho } from './pages/AltoSobradinho';
import { Login } from './pages/admin/Login';
import { RecoverPassword } from './pages/admin/RecoverPassword';
import { ResetPassword } from './pages/admin/ResetPassword';
import { Dashboard } from './pages/admin/Dashboard';
import { PropertyForm } from './pages/admin/PropertyForm';
import { AboutForm } from './pages/admin/AboutForm';
import { TrackingForm } from './pages/admin/TrackingForm';
import { AltoSobradinhoForm } from './pages/admin/AltoSobradinhoForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { supabase } from './lib/supabase';

const { HashRouter, Routes, Route, useLocation, Navigate } = RouterDom;
const Router = HashRouter;

// Helper to inject raw HTML tracking scripts in <head> or <body> safely
const injectHtmlScripts = (html: string, idPrefix: string) => {
    if (!html) return;
    try {
        const container = document.createElement('div');
        container.innerHTML = html;
        
        const scripts = container.querySelectorAll('script');
        scripts.forEach((script, idx) => {
            const existingId = `${idPrefix}-script-${idx}`;
            if (document.getElementById(existingId)) return;
            
            const newScript = document.createElement('script');
            newScript.id = existingId;
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.innerHTML = script.innerHTML;
            document.head.appendChild(newScript);
        });

        const others = container.querySelectorAll(':not(script)');
        others.forEach((el, idx) => {
            const existingId = `${idPrefix}-other-${idx}`;
            if (document.getElementById(existingId)) return;
            
            const clone = el.cloneNode(true) as HTMLElement;
            clone.id = existingId;
            if (clone.tagName === 'META' || clone.tagName === 'LINK' || clone.tagName === 'STYLE') {
                document.head.appendChild(clone);
            } else {
                document.body.appendChild(clone);
            }
        });
    } catch (e) {
        console.error('Erro ao interpretar bloco de script customizado:', e);
    }
};

// Global Tracking Script Injector
const TrackingLoader: React.FC = () => {
    React.useEffect(() => {
        const loadTracking = async () => {
            try {
                const { data, error } = await supabase
                    .from('tracking_settings')
                    .select('*')
                    .eq('id', 'global-tracking')
                    .maybeSingle();
                
                if (error) {
                    console.warn('Erro ao ler tracking_settings do banco de dados:', error);
                    return;
                }
                if (!data) return;

                // 1. Inject Google Tag Manager / Analytics ID helper
                if (data.google_tag_id) {
                    const tagId = data.google_tag_id.trim();
                    if (tagId && !document.getElementById('gtag-js')) {
                        const s1 = document.createElement('script');
                        s1.id = 'gtag-js';
                        s1.async = true;
                        s1.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
                        document.head.appendChild(s1);

                        const s2 = document.createElement('script');
                        s2.id = 'gtag-init';
                        s2.innerHTML = `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${tagId}');
                        `;
                        document.head.appendChild(s2);
                    }
                }

                // 2. Inject Meta Pixel Helper
                if (data.meta_pixel_id) {
                    const pixelId = data.meta_pixel_id.trim();
                    if (pixelId && !document.getElementById('meta-pixel')) {
                        const s = document.createElement('script');
                        s.id = 'meta-pixel';
                        s.innerHTML = `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '${pixelId}');
                            fbq('track', 'PageView');
                        `;
                        document.head.appendChild(s);
                    }
                }

                // 3. Inject custom Head Scripts
                if (data.head_scripts) {
                    injectHtmlScripts(data.head_scripts, 'custom-head');
                }

                // 4. Inject custom Body/Footer Scripts
                if (data.body_scripts) {
                    injectHtmlScripts(data.body_scripts, 'custom-body');
                }

            } catch (err) {
                console.error('Erro ao injetar scripts de tracking:', err);
            }
        };

        loadTracking();
    }, []);

    return null;
};

// Scroll to top wrapper
const ScrollToTop = () => {
    const { pathname } = useLocation();
  
    React.useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
  };

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="text-gold-400 animate-pulse">Carregando...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-dark-950 font-sans selection:bg-gold-600 selection:text-white flex flex-col">
        <ScrollToTop />
        <TrackingLoader />
        {!isAdminRoute && <Header />}
        <main className="flex-grow">
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/alto-sobradinho" element={<AltoSobradinho />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/recover-password" element={<RecoverPassword />} />
                <Route path="/admin/reset-password" element={<ResetPassword />} />
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/new" 
                    element={
                        <ProtectedRoute>
                            <PropertyForm />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/about" 
                    element={
                        <ProtectedRoute>
                            <AboutForm />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/tags" 
                    element={
                        <ProtectedRoute>
                            <TrackingForm />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/alto-sobradinho" 
                    element={
                        <ProtectedRoute>
                            <AltoSobradinhoForm />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/edit/:id" 
                    element={
                        <ProtectedRoute>
                            <PropertyForm />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </main>
        {!isAdminRoute && <WhatsAppButton />}
        {!isAdminRoute && <Footer />}
    </div>
  );
}

function AppWrapper() {
    return (
        <Router>
            <AuthProvider>
                <PropertyProvider>
                    <App />
                </PropertyProvider>
            </AuthProvider>
        </Router>
    );
}

export default AppWrapper;
