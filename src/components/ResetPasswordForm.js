"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm({ token }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const password = form.get("password");
    const confirm = form.get("confirm");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    setLoading(false);

    if (error) {
      setError(
        error.message || "Could not reset password. The link may have expired.",
      );
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <CheckCircle2 size={32} className="mx-auto text-green-600" />
        <h1 className="text-2xl font-bold">Password updated</h1>
        <p className="text-sm text-gray-600">
          You can now log in with your new password.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col items-center gap-2">
        <Camera size={32} className="text-brand-500" />
        <h1 className="text-2xl font-bold">Choose a new password</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="password"
          type="password"
          placeholder="New password (min 8 characters)"
          required
          minLength={8}
          className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          name="confirm"
          type="password"
          placeholder="Confirm new password"
          required
          minLength={8}
          className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-brand-500"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Saving..." : "Reset password"}
        </button>
      </form>
    </>
  );
}
