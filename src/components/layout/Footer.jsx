import Logo from '../ui/Logo';
import { FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { useUser } from '@clerk/clerk-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isSignedIn } = useUser();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Logo & About */}
          <div className="col-span-1">
            <Logo />
            <p className="mt-4 text-gray-600">
              Bring your thoughts to life in the enchanting Studio Ghibli style using our AI-powered tool.
            </p>
            <div className="flex mt-4 space-x-4">
              <a
                href="https://www.linkedin.com/in/adadasaivenkat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/saivenkatadada?igsh=NXUwY3R2MGxpdzEy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/adadasaivenkat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links - Only show when not signed in */}
          {!isSignedIn && (
            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Platform
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Contact Info */}
          <div className="col-span-1 md:ml-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-600">
                Email: adadasaivenkat0109@gmail.com
              </li>
              <li className="text-gray-600">
                Location: Andhra Pradesh, India
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            &copy; {currentYear} Ghiblyze. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;