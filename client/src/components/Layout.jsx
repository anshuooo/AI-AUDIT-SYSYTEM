import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-white">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4">

          {/* Top Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

            {/* Brand */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-black tracking-tight"
              >
                AUDIT<span className="text-blue-500">AI</span>
              </motion.div>

              <p className="text-slate-400 leading-relaxed text-sm">
                Redefining AI cost management for modern startups and teams.
                Save more, build faster with intelligent AI spend optimization.
              </p>

              {/* Simple Social Buttons */}
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sm transition-all">
                  Twitter
                </button>

                <button className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sm transition-all">
                  GitHub
                </button>

                <button className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sm transition-all">
                  LinkedIn
                </button>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">
                Product
              </h4>

              <ul className="space-y-4 text-sm text-slate-400">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Audit Engine
                </li>

                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Analytics
                </li>

                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Team Plans
                </li>

                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Integrations
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">
                Resources
              </h4>

              <ul className="space-y-4 text-sm text-slate-400">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Documentation
                </li>

                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  API Reference
                </li>

                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Blog
                </li>

                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Community
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">
                Support
              </h4>

              <ul className="space-y-4 text-sm text-slate-400">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Contact Us
                </li>

                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Status
                </li>

                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Privacy Policy
                </li>

                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="text-slate-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} AuditAI Systems Inc.
              All rights reserved.
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Mail size={16} />
              hello@auditai.com
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;