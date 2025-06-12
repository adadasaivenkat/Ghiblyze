import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  ClerkLoaded,
  ClerkLoading,
} from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-ghibli-cream">
    <div className="w-16 h-16 relative">
      <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-primary-200 rounded-full"></div>
      <motion.div
        className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-primary-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      ></motion.div>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

function App() {
  const location = useLocation();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Set page title based on current route
  useEffect(() => {
    const path = location.pathname;

    let title = 'Ghiblyze';

    if (path.includes('dashboard')) {
      title = 'Dashboard | Ghiblyze';
    }

    document.title = title;
  }, [location]);

  // Remove first load state after initial render
  useEffect(() => {
    setIsFirstLoad(false);
  }, []);

  return (
    <>
      <ClerkLoading>
        <LoadingSpinner />
      </ClerkLoading>

      <ClerkLoaded>
        <AnimatePresence mode="wait">
          {isFirstLoad ? (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoadingSpinner />
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AnimatePresence>
          )}
        </AnimatePresence>
      </ClerkLoaded>
    </>
  );
}

export default App;