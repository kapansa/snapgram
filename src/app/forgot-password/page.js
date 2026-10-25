"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Loader2, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const { error } = await authClient.requestPasswordReset({
      email: form.get("email"),
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
      return;
    }

    setSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex flex-col items-center gap-2">
          <Camera size={32} className="text-brand-500" />
          <h1 className="text-2xl font-bold">Forgot password</h1>
        </div>

        {sent ? (
          <div className="space-y-3 text-center">
            <Mail size={32} className="mx-auto text-brand-500" />
            <p className="text-sm text-gray-700">
              If an account exists for that email, we&apos;ve sent a link to
              reset the password. It expires in 1 hour.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your email and we&apos;ll send you a link to choose a new
              password.
            </p>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-brand-500"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link
            href="/login"
            className="font-medium text-brand-600 hover:underline"
          >
            Back to log in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
