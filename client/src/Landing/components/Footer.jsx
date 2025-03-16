import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Kreon Notes</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-xs">
              Your all-in-one solution for notes, reminders, and creative drawing. Stay organized and boost productivity.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:contact@kreonnotes.com"
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-amber-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-amber-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-600 hover:text-amber-500 transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-amber-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-amber-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-amber-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-gray-600 hover:text-amber-500 transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-gray-600 hover:text-amber-500 transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-amber-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-amber-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-amber-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-amber-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Kreon Notes. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm flex items-center">
              Made with <Heart size={14} className="mx-1 text-amber-500" /> by the Kreon Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
