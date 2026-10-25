"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Loader2, Plus, Send } from "lucide-react";
import { createPost } from "@/actions/posts";

export default function CreatePostForm() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggle() {
    if (open) {
      setPreview(null);
      setError("");
    }
    setOpen((o) => !o);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await createPost(new FormData(e.currentTarget));

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    // Success: close the form. Reopening it gives a fresh, empty one.
    setPreview(null);
    setOpen(false);
  }

  return (
    <div>
      <motion.button
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.97 }}
        aria-expanded={open}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus size={20} className="text-brand-500" />
        </motion.span>
        {open ? "Close" : "Create a post"}
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="mt-3 space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-6 text-gray-500 transition hover:border-brand-500 hover:text-brand-600">
                {preview ? (
                  <motion.img
                    key={preview}
                    src={preview}
                    alt="Preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="max-h-64 rounded-lg"
                  />
                ) : (
                  <>
                    <ImagePlus size={32} />
                    <span className="text-sm">Click to choose a photo</span>
                  </>
                )}
                <input
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              <textarea
                name="caption"
                placeholder="Write a caption..."
                maxLength={500}
                rows={3}
                className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-brand-500"
              />

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {loading ? "Posting..." : "Post"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
