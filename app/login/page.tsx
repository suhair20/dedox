"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <Link href="/" className="text-3xl font-bold text-[#0f3d3e] tracking-tighter mb-4 block">
            Dedox Perfume
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Enter your details to access your exclusive account.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2 px-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="block w-full pl-11 pr-4 py-4 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#0f3d3e] focus:border-transparent transition-all outline-none"
                placeholder="style@dedox.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2 px-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-11 pr-4 py-4 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#0f3d3e] focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link href="#" className="text-sm font-bold text-[#0f3d3e] hover:underline uppercase tracking-tight">
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-[#0f3d3e] text-white py-5 flex items-center justify-center space-x-3 hover:bg-black transition-all duration-300 shadow-xl group">
            <span className="font-bold uppercase tracking-widest text-sm">Login</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-100 pt-8">
          Don&apos;t have an account?{" "}
          <Link href="#" className="font-bold text-[#0f3d3e] hover:underline uppercase tracking-tight ml-1">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
