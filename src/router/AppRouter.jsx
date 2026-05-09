import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
const LandingPage = lazy(() => import('../pages/public/LandingPage'));
const LoginPage = lazy(() => import('../pages/public/LoginPage'));
const SignupPage = lazy(() => import('../pages/public/SignupPage'));
const PricingPage = lazy(() => import('../pages/public/PricingPage'));
const BotEmbedView = lazy(() => import('../pages/public/BotEmbedView'));
const AuthCallback = lazy(() => import('../pages/AuthCallback'));
const DemoPage = lazy(() => import('../pages/DemoPage'));

// Dashboard Pages
const DashboardLayout = lazy(() => import('../components/layout/DashboardLayout'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const BotList = lazy(() => import('../pages/dashboard/BotList'));
const CreateBot = lazy(() => import('../pages/dashboard/CreateBot'));
const BotEmbed = lazy(() => import('../pages/dashboard/BotEmbed'));
const Analytics = lazy(() => import('../pages/dashboard/Analytics'));
const ChatLogs = lazy(() => import('../pages/dashboard/ChatLogs'));
const Settings = lazy(() => import('../pages/dashboard/Settings'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a16]">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(4px)' }}
    animate={{ opacity: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, filter: 'blur(2px)' }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname.split('/')[1]}>
          {/* Public Routes */}
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
          <Route path="/pricing" element={<PageWrapper><PricingPage /></PageWrapper>} />
          <Route path="/embed/:botId" element={<BotEmbedView />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/demo" element={<PageWrapper><DemoPage /></PageWrapper>} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="bots" element={<BotList />} />
            <Route path="bots/new" element={<CreateBot />} />
            <Route path="bots/:botId/embed" element={<BotEmbed />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="logs" element={<ChatLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default AppRouter;
