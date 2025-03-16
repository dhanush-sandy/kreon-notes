import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useAuth,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50  backdrop-blur-sm border-b border-gray-200">
      <nav className="container mx-auto max-w-7xl py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Kreon Notes</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-amber-500 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-amber-500 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-amber-500 transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-gray-600 hover:text-amber-500 transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center justify-center gap-2">
                <Link to="/dashboard">
                  <button className="bg-amber-500 px-4 py-2 text-sm rounded-lg font-medium text-white hover:bg-amber-600 transition-colors cursor-pointer">
                    Dashboard
                  </button>
                </Link>
                <div className="text-gray-600 hover:text-amber-500 transition-colors px-4 py-2 cursor-pointer">
                  <SignOutButton />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <div className="text-gray-600 hover:text-amber-500 transition-colors px-4 py-2 cursor-pointer">
                  <SignInButton afterSignInUrl="/dashboard" />
                </div>
                <div className="bg-amber-500 px-4 py-2 text-sm rounded-lg font-medium text-white hover:bg-amber-600 transition-colors cursor-pointer">
                  <SignUpButton afterSignUpUrl="/dashboard" />
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-amber-500 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-amber-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-amber-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-amber-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-amber-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>

              <div className="pt-4 border-t border-gray-100">
                {isSignedIn ? (
                  <div className="flex flex-col space-y-4">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full bg-amber-500 px-4 py-2 text-sm rounded-lg font-medium text-white hover:bg-amber-600 transition-colors cursor-pointer">
                        Dashboard
                      </button>
                    </Link>
                    <div className="text-gray-600 hover:text-amber-500 transition-colors py-2 cursor-pointer">
                      <SignOutButton />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <div className="text-gray-600 hover:text-amber-500 transition-colors py-2 cursor-pointer">
                      <SignInButton afterSignInUrl="/dashboard" />
                    </div>
                    <div className="bg-amber-500 px-4 py-2 text-sm rounded-lg font-medium text-white hover:bg-amber-600 transition-colors cursor-pointer text-center">
                      <SignUpButton afterSignUpUrl="/dashboard" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default LandingHeader;
