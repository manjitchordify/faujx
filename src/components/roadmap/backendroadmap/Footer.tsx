import React from 'react';
import { Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => (
  <footer className="w-full bg-[#13261B] text-white rounded-t-2xl">
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex space-x-4">
          <a
            href="#"
            className="p-2 rounded-full hover:bg-emerald-800 transition-colors duration-200"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
          <a
            href="#"
            className="p-2 rounded-full hover:bg-emerald-800 transition-colors duration-200"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className="p-2 rounded-full hover:bg-emerald-800 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
        </div>

        <div className="flex space-x-6 text-sm">
          <a
            href="/privacy-policy"
            className="hover:text-emerald-200 transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-conditions"
            className="hover:text-emerald-200 transition-colors duration-200"
          >
            Terms & Conditions
          </a>
        </div>
      </div>

      <div className="border-t border-emerald-700 mt-6 pt-6">
        <div className="text-center text-sm text-emerald-200">
          © {new Date().getFullYear()} faujx. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
