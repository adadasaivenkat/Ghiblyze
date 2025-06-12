import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk, UserButton } from '@clerk/clerk-react';
import { FiMenu, FiX } from 'react-icons/fi';
import Logo from '../ui/Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isSignedIn } = useUser();
  const { openSignIn, openSignUp } = useClerk();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (isSignedIn && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [isSignedIn, location.pathname, navigate]);

  const appearanceOptions = {
    elements: {
      // footer: 'hidden',   
      // ⚠️ Hiding (Clerk branding) the footer symbol violates Clerk's Terms of Service.
      footer: {
        display: 'flex',
      },
    },
  };

  const scrollToElement = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    scrollToElement(sectionId);
  };

  // New function specifically for mobile menu navigation
  const handleMobileNavClick = (sectionId) => {
    // Close the mobile menu first
    setMobileMenuOpen(false);

    // Add a delay to ensure menu closes before scrolling
    setTimeout(() => {
      if (location.pathname !== '/') {
        window.location.href = `/#${sectionId}`;
      } else {
        scrollToElement(sectionId);
      }
    }, 300); // Delay matches the animation duration
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1);
      setTimeout(() => {
        scrollToElement(sectionId);
      }, 100);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const sections = ['home', 'features', 'how-it-works'];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (mobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const isActive = (section) => activeSection === section;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container-custom max-w-full">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {!isSignedIn && (
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'features', 'how-it-works'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-ghibli-night hover:text-primary-600 transition-colors font-medium relative ${isActive(section) ? 'text-primary-600' : ''}`}
                >
                  {section.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  {isActive(section) && (
                    <motion.div layoutId="activeSection" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600" />
                  )}
                </button>
              ))}

              <button
                onClick={() => openSignIn({ appearance: appearanceOptions, redirectUrl: '/dashboard' })}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => openSignUp({ appearance: appearanceOptions, redirectUrl: '/dashboard' })}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Sign Up
              </button>
            </div>
          )}

          {!isSignedIn ? (
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100/50 transition-colors mobile-menu-container"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6 text-ghibli-night" /> : <FiMenu className="w-6 h-6 text-ghibli-night" />}
            </button>
          ) : (
            <div className="md:hidden">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-11 h-11',
                    userButtonPopoverCard: 'shadow-xl rounded-xl',
                    userButtonPopoverActionButton: 'hover:bg-primary-50 rounded-lg',
                    userButtonPopoverActionButtonText: 'text-gray-700 font-medium',
                    userButtonPopoverFooter: 'hidden',
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && !isSignedIn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 mobile-menu-container"
          >
            <div className="container-custom max-w-5xl py-6 space-y-5 flex flex-col">
              {['home', 'features', 'how-it-works'].map((section) => (
                <button
                  key={section}
                  onClick={() => handleMobileNavClick(section)}
                  className={`py-2.5 text-ghibli-night hover:text-primary-600 transition-colors font-medium text-left ${isActive(section) ? 'text-primary-600' : ''}`}
                >
                  {section.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}

              <div className="flex flex-col space-y-4 pt-2">
                <button
                  onClick={() => openSignIn({ appearance: appearanceOptions, redirectUrl: '/dashboard' })}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openSignUp({ appearance: appearanceOptions, redirectUrl: '/dashboard' })}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show UserButton on desktop when signed in */}
      {isSignedIn && (
        <div className="hidden md:flex absolute right-4 top-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-11 h-11',
                userButtonPopoverCard: 'shadow-xl rounded-xl',
                userButtonPopoverActionButton: 'hover:bg-primary-50 rounded-lg',
                userButtonPopoverActionButtonText: 'text-gray-700 font-medium',
                userButtonPopoverFooter: 'hidden',
              },
            }}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;