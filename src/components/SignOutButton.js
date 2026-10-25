"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";

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
      className="flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
    >
      <LogOut size={16} />
      Sign out
    </motion.button>
  );
}
