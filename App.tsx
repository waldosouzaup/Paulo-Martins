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
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { PropertyForm } from './pages/admin/PropertyForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';

// Use BrowserRouter instead of HashRouter for SEO benefit
const { BrowserRouter, Routes, Route, useLocation, Navigate } = RouterDom;
const Router = BrowserRouter;

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

                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
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