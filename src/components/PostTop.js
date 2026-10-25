"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { deletePost, updateCaption } from "@/actions/posts";
import Avatar from "@/components/Avatar";

export default function PostTop({
  postId,
  authorId,
  authorName,
  authorImage,
  date,
  caption,
  canEdit,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [value, setValue] = useState(caption ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef(null);

  // Close the menu when clicking outside it or pressing Escape
  useEffect(() => {
    if (!menuOpen) return;

    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  function startEditing() {
    setValue(caption ?? "");
    setError("");
    setMenuOpen(false);
    setEditing(true);
  }

  function startDelete() {
    setError("");
    setMenuOpen(false);
    setConfirmingDelete(true);
  }

  async function handleSave() {
    setLoading(true);
    setError("");

    const result = await updateCaption(postId, value);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setEditing(false);
  }

  async function handleDelete() {
    setLoading(true);
    setError("");

    const result = await deletePost(postId);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // On success the post disappears from the feed, so there's nothing to reset.
  }

  return (
    <>
      <div className="flex items-center gap-3 p-3">
        <Avatar name={authorName} image={authorImage} size={36} />
        <div className="leading-tight">
          <Link
            href={`/profile/${authorId}`}
            className="font-semibold hover:underline"
          >
            {authorName}
          </Link>
          <time className="block text-xs text-gray-500">{date}</time>
        </div>

        {canEdit && (
          <div ref={menuRef} className="relative ml-auto">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Post options"
              aria-expanded={menuOpen}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
            >
              <MoreHorizontal size={20} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 z-10 mt-1 w-44 origin-top-right overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                >
                  <button
                    onClick={startEditing}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
                  >
                    <Pencil size={16} />
                    {caption ? "Edit caption" : "Add caption"}
                  </button>
                  <button
                    onClick={startDelete}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {confirmingDelete && (
        <div className="mx-3 mb-3 space-y-2 rounded-xl bg-red-50 p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-red-700">
              Delete this post? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setConfirmingDelete(false);
                  setError("");
                }}
                disabled={loading}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      )}

      {editing ? (
        <div className="space-y-2 px-3 pb-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={500}
            rows={3}
            autoFocus
            className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-brand-500"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{value.length}/500</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setError("");
                }}
                disabled={loading}
                className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-100"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1 text-sm text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                Save
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        caption && (
          <p className="whitespace-pre-wrap break-words px-3 pb-3 text-[15px] leading-relaxed">
            {caption}
          </p>
        )
      )}
    </>
  );
}
