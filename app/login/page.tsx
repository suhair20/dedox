"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();

  // ✅ Helper for safe error handling
  const getErrorMessage = (err: unknown) =>
    err instanceof Error ? err.message : "An unexpected error occurred";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: { error?: string } = await res.json();

      if (res.ok) {
        setStep(2);
        setSuccess("OTP sent to your email!");
        setResendTimer(60);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data: { error?: string } = await res.json();

      if (res.ok) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: { error?: string } = await res.json();

      if (res.ok) {
        setSuccess("A new OTP has been sent!");
        setResendTimer(60);
      } else {
        setError(data.error || "Failed to resend OTP");
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <Link
            href="/"
            className="text-3xl font-bold text-[#0f3d3e] tracking-tighter mb-4 block"
          >
            Dedox Perfume
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {step === 1 ? "Welcome Back" : "Verify Identity"}
          </h2>
          <p className="text-gray-500 mt-2">
            {step === 1
              ? "Enter your email to receive a secure login code."
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
              onSubmit={handleSendOtp}
            >
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2 px-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#0f3d3e] focus:border-transparent transition-all outline-none"
                    placeholder="name@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 text-sm animate-pulse">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0f3d3e] text-white py-5 flex items-center justify-center space-x-3 hover:bg-black transition-all duration-300 shadow-xl group disabled:opacity-70"
              >
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="font-bold uppercase tracking-widest text-sm">
                      Send Secure Code
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
              onSubmit={handleVerifyOtp}
            >
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2 px-1">
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    className="block w-full pl-11 pr-4 py-4 border border-gray-200 bg-gray-50 text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-[#0f3d3e] focus:border-transparent transition-all outline-none"
                    placeholder="000000"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{success}</span>
                </div>
              )}

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-[#0f3d3e] text-white py-5 flex items-center justify-center space-x-3 hover:bg-black transition-all duration-300 shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span className="font-bold uppercase tracking-widest text-sm">
                        Verify & Login
                      </span>
                      <ShieldCheck className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className="text-sm font-bold text-[#0f3d3e] hover:underline uppercase tracking-tight disabled:opacity-50"
                  >
                    {resendTimer > 0
                      ? `Resend Code in ${resendTimer}s`
                      : "Resend Code"}
                  </button>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                      setSuccess("");
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors font-bold"
                  >
                    ← Back to Email
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-100 pt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="#"
            className="font-bold text-[#0f3d3e] hover:underline uppercase tracking-tight ml-1"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
