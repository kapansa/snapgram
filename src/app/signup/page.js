"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const { error } = await authClient.signUp.email({
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
      return;
    }

    router.push("/");
    router.refresh();
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
          <h1 className="text-2xl font-bold">Create account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            required
            className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-brand-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-brand-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min 8 characters)"
            required
            minLength={8}
            className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-brand-500"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
