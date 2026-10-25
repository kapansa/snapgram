"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { updateName } from "@/actions/profile";

export default function NameForm({ initialName, email }) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const result = await updateName(name);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setMessage("Name updated.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required
          className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          value={email}
          disabled
          className="w-full rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-500"
        />
        <p className="text-xs text-gray-400">
          Email changes aren&apos;t available yet.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      <button
        disabled={loading || name.trim() === initialName}
        className="flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
