"use client";

import { useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";
import { getStripeClient } from "@/lib/stripe/client";

type StripePaymentSectionProps = {
  clientSecret: string;
  amountLabel: string;
  isSubmitting: boolean;
  onSubmittingChange: (value: boolean) => void;
  onSuccess: (paymentIntentId: string) => Promise<void>;
  onError: (message: string) => void;
};

function CheckoutPaymentForm({
  amountLabel,
  isSubmitting,
  onSubmittingChange,
  onSuccess,
  onError,
}: Omit<StripePaymentSectionProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const [elementReady, setElementReady] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) {
      onError("Payment system is still loading. Please wait a moment.");
      return;
    }

    onSubmittingChange(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      onSubmittingChange(false);
      onError(result.error.message || "Payment failed. Please try again.");
      return;
    }

    const paymentIntentId = result.paymentIntent?.id;
    if (!paymentIntentId || result.paymentIntent.status !== "succeeded") {
      onSubmittingChange(false);
      onError("Payment was not completed. Please try again.");
      return;
    }

    try {
      await onSuccess(paymentIntentId);
    } catch (error) {
      onSubmittingChange(false);
      onError(
        error instanceof Error ? error.message : "Failed to finalize your order."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <Lock className="h-3.5 w-3.5 text-[#7a0c0c]" />
          Secured by Stripe (test mode)
        </div>
        <PaymentElement
          onReady={() => setElementReady(true)}
          options={{ layout: "tabs" }}
        />
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || !elements || !elementReady || isSubmitting}
        className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl px-8 btn-primary text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {isSubmitting ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        ) : (
          <span>Pay {amountLabel}</span>
        )}
      </button>

      <p className="text-[10px] leading-relaxed text-gray-400">
        Test card: <span className="font-mono">4242 4242 4242 4242</span> • any future
        expiry • any CVC
      </p>
    </div>
  );
}

export default function StripePaymentSection({
  clientSecret,
  amountLabel,
  isSubmitting,
  onSubmittingChange,
  onSuccess,
  onError,
}: StripePaymentSectionProps) {
  const stripePromise = useMemo(() => getStripeClient(), []);

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorPrimary: "#7a0c0c",
          borderRadius: "16px",
        },
      },
    }),
    [clientSecret]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutPaymentForm
        amountLabel={amountLabel}
        isSubmitting={isSubmitting}
        onSubmittingChange={onSubmittingChange}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
