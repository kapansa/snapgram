"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleClick() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      aria-label="Sign out"
      className="flex items-center gap-1.5 rounded-full border border-gray-300 p-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 sm:px-3 sm:py-1.5"
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">Sign out</span>
    </motion.button>
  );
}
