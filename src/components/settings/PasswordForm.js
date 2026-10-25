"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-brand-500";

export default function PasswordForm() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const form = new FormData(e.currentTarget);
    const currentPassword = form.get("currentPassword");
    const newPassword = form.get("newPassword");
    const confirm = form.get("confirm");

    if (newPassword !== confirm) {
      setError("New passwords don't match.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Could not change password.");
      return;
    }

    formRef.current.reset();
    setMessage("Password changed. You've been signed out of other devices.");
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <input
        name="currentPassword"
        type="password"
        placeholder="Current password"
        required
        className={inputClass}
      />
      <input
        name="newPassword"
        type="password"
        placeholder="New password (min 8 characters)"
        required
        minLength={8}
        className={inputClass}
      />
      <input
        name="confirm"
        type="password"
        placeholder="Confirm new password"
        required
        minLength={8}
        className={inputClass}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      <button
        disabled={loading}
        className="flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Changing..." : "Change password"}
      </button>

      <p className="text-xs text-gray-400">
        Forgot your current password? Log out and use &quot;Forgot
        password?&quot; on the login page.
      </p>
    </form>
  );
}
