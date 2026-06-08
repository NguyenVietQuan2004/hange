"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function HeaderAbout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <nav className="relative mx-auto max-w-5xl flex items-center justify-between px-6 pt-12 pb-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1" />
            <circle cx="18" cy="10" r="9" stroke="currentColor" strokeWidth="1" />
          </svg>
          Core
        </a>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">
            About
          </a>
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
            Approach
          </a>
          <a href="#team" className="text-sm text-gray-400 hover:text-white transition-colors">
            Team
          </a>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">
            Contact
          </a>
        </div>

        {/* CTA Button */}
        <a
          href="#contact"
          className="hidden md:inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90 transition-all"
        >
          Talk to us
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black px-6 py-6">
          <div className="flex flex-col gap-6 text-base">
            <a
              href="#about"
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#features"
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Approach
            </a>
            <a
              href="#team"
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Team
            </a>
            <a
              href="#pricing"
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
