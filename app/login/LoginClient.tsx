"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Mail,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type LoginClientProps = {
  redirectTo: string;
};

export default function LoginClient({ redirectTo }: LoginClientProps) {
  const router = useRouter();
  const { refreshSession } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendTimer((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendTimer]);

  const getErrorMessage = (err: unknown) =>
    err instanceof Error ? err.message : "An unexpected error occurred.";

  const isEmail = identifier.includes("@");
  const identifierLabel = isEmail ? "email address" : "phone number";

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data: { error?: string; message?: string } = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send OTP.");
        return;
      }

      setStep(2);
      setOtp("");
      setResendTimer(60);
      setSuccess(
        data.message || "Your OTP is on the way. Enter it below to continue."
      );
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp }),
      });
      const data: { error?: string; message?: string } = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid OTP.");
        return;
      }

      const session = await refreshSession();
      if (!session) {
        setError("OTP was verified, but the session could not be restored.");
        return;
      }

      setSuccess(data.message || "Authentication successful. Redirecting...");
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data: { error?: string; message?: string } = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend OTP.");
        return;
      }

      setResendTimer(60);
      setSuccess(data.message || "A new OTP has been sent.");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7fb] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[36px] border border-white/70 bg-[#2E073F] px-8 py-10 text-white shadow-[0_30px_80px_rgba(46,7,63,0.24)] sm:px-12 sm:py-14">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-white/60">
            Secure Customer Access
          </p>
          <h1 className="mt-5 font-serif-luxury text-4xl font-bold tracking-tight sm:text-5xl">
            OTP login and signup built into your real session flow.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
            Use your email address or mobile number to receive a one-time passcode.
            Once verified, your Dedox session stays active across refreshes until
            you sign out.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/8 p-6">
              <Mail className="h-5 w-5 text-white/80" />
              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.24em] text-white/60">
                Email OTP
              </p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Enter any valid email and we will issue a secure one-time code.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/8 p-6">
              <Smartphone className="h-5 w-5 text-white/80" />
              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.24em] text-white/60">
                Phone OTP
              </p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Use your international number with country code for SMS-based
                verification.
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[36px] border border-gray-100 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10"
        >
          <Link
            href="/"
            className="text-[11px] font-black uppercase tracking-[0.32em] text-[#2E073F]/70 transition-colors hover:text-[#2E073F]"
          >
            Dedox Perfume
          </Link>

          <div className="mt-8">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-gray-400">
              {step === 1 ? "Step 1 of 2" : "Step 2 of 2"}
            </p>
            <h2 className="mt-3 font-serif-luxury text-3xl font-bold tracking-tight text-gray-900">
              {step === 1 ? "Access your account" : "Verify your OTP"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              {step === 1
                ? "Sign up or log in with a one-time passcode. Use an email address or an international mobile number."
                : `Enter the 6-digit code sent to your ${identifierLabel}.`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="identifier-step"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className="mt-10 space-y-6"
                onSubmit={handleSendOtp}
              >
                <div>
                  <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.28em] text-gray-500">
                    Email or phone number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400">
                      {isEmail ? (
                        <Mail className="h-5 w-5" />
                      ) : (
                        <Smartphone className="h-5 w-5" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                      placeholder="name@example.com or +971501234567"
                      className="h-16 w-full rounded-[22px] border border-gray-200 bg-[#fcfbfd] pl-14 pr-5 text-sm font-medium text-gray-900 outline-none transition focus:border-[#2E073F] focus:bg-white"
                      autoComplete="username"
                      disabled={loading}
                      required
                    />
                  </div>
                  <p className="mt-3 text-xs leading-6 text-gray-400">
                    Phone logins should include the country code so OTP delivery
                    works correctly.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 rounded-[22px] border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-16 w-full items-center justify-center gap-3 rounded-[22px] bg-[#2E073F] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="otp-step"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className="mt-10 space-y-6"
                onSubmit={handleVerifyOtp}
              >
                <div>
                  <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.28em] text-gray-500">
                    Enter 6-digit OTP
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, ""))
                      }
                      placeholder="000000"
                      className="h-16 w-full rounded-[22px] border border-gray-200 bg-[#fcfbfd] pl-14 pr-5 text-center text-2xl font-black tracking-[0.48em] text-gray-900 outline-none transition focus:border-[#2E073F] focus:bg-white"
                      autoComplete="one-time-code"
                      disabled={loading}
                      required
                    />
                  </div>
                  <p className="mt-3 text-xs leading-6 text-gray-400">
                    This code expires in 5 minutes. Resend is available after 60
                    seconds.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 rounded-[22px] border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-3 rounded-[22px] border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="flex h-16 w-full items-center justify-center gap-3 rounded-[22px] bg-[#2E073F] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>Verify OTP</span>
                        <ShieldCheck className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || resendTimer > 0}
                    className="w-full text-center text-[11px] font-black uppercase tracking-[0.28em] text-[#2E073F] transition hover:text-black disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                      setSuccess("");
                    }}
                    className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-gray-400 transition hover:text-[#2E073F]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to details
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
