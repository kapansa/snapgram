"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toggleLike } from "@/actions/likes";

export default function LikeButton({ postId, initialLiked, initialCount }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) return;

    const nextLiked = !liked;

    // Update the screen immediately, before the server answers
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));
    setPending(true);

    const result = await toggleLike(postId);

    setPending(false);

    // If the server refused, undo the change
    if (result?.error) {
      setLiked(!nextLiked);
      setCount((c) => c + (nextLiked ? -1 : 1));
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
    >
      <motion.span
        key={liked ? "liked" : "unliked"}
        initial={{ scale: liked ? 0.6 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <Heart
          size={22}
          className={liked ? "fill-brand-500 text-brand-500" : "text-gray-500"}
        />
      </motion.span>
      {count > 0 && <span>{count}</span>}
    </motion.button>
  );
}
