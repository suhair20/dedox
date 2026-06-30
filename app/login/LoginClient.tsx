"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type LoginClientProps = {
  redirectTo: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginClient({ redirectTo }: LoginClientProps) {
  const router = useRouter();
  const { refreshSession } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = window.setInterval(() => {
      setResendTimer((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendTimer]);

  const getErrorMessage = (err: unknown) =>
    err instanceof Error ? err.message : "An unexpected error occurred.";

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: trimmedEmail, email: trimmedEmail }),
      });
      const data: { error?: string; message?: string } = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send code.");
        return;
      }

      setEmail(trimmedEmail);
      setStep(2);
      setOtp("");
      setResendTimer(60);
      setSuccess("");
    } catch (err) {
      setError(getErrorMessage(err));
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
        body: JSON.stringify({ identifier: email, otp }),
      });
      const data: { error?: string; message?: string } = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid code.");
        return;
      }

      const session = await refreshSession();
      if (!session) {
        setError("Sign-in could not be completed. Please try again.");
        return;
      }

      setSuccess(data.message || "Welcome back.");
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
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
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, email }),
      });
      const data: { error?: string; message?: string } = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend code.");
        return;
      }

      setResendTimer(60);
      setSuccess("A new code has been sent.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-4 py-10 sm:px-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-left">
          <Link href="/" className="inline-block">
            <div className="relative h-10 w-36 sm:h-11 sm:w-40">
              <Image
                src="/dedox-perfume-logo.svg"
                alt="Dedox Perfume"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.65rem]">
            {step === 1 ? "Welcome back!" : "Almost there"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-[15px]">
            {step === 1
              ? "Please enter your details."
              : `We sent a code to ${email}.`}
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_40px_rgba(15,23,42,0.08)] sm:rounded-[32px] sm:p-8">
          {step === 1 ? (
            <form className="space-y-5" onSubmit={handleSendOtp}>
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  className="h-12 w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#7a0c0c]/30 focus:bg-white focus:ring-2 focus:ring-[#7a0c0c]/10"
                  disabled={loading}
                  required
                />
              </div>

              {error && <Alert message={error} variant="error" />}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#7a0c0c] text-sm font-semibold text-white transition hover:bg-[#981212] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div>
                <label
                  htmlFor="login-otp"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400"
                >
                  Verification code
                </label>
                <input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  className="h-12 w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 text-center text-lg font-semibold tracking-[0.4em] text-gray-900 outline-none transition placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400 focus:border-[#7a0c0c]/30 focus:bg-white focus:ring-2 focus:ring-[#7a0c0c]/10"
                  autoComplete="one-time-code"
                  disabled={loading}
                  required
                />
              </div>

              {error && <Alert message={error} variant="error" />}
              {success && <Alert message={success} variant="success" />}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#7a0c0c] text-sm font-semibold text-white transition hover:bg-[#981212] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex flex-col items-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || resendTimer > 0}
                  className="text-sm font-medium text-[#7a0c0c] transition hover:text-[#981212] disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Resend code"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                  className="inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Use a different email
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-8 text-left text-sm text-gray-500">
          New to Dedox?{" "}
          <Link
            href="/shop"
            className="font-semibold text-[#7a0c0c] hover:text-[#981212]"
          >
            Start shopping
          </Link>
        </p>
      </div>
    </div>
  );
}

function Alert({
  message,
  variant,
}: {
  message: string;
  variant: "error" | "success";
}) {
  const isError = variant === "error";

  return (
    <div
      className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${
        isError
          ? "bg-red-50 text-red-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}
