"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircle, Send, Trash2 } from "lucide-react";
import Avatar from "@/components/Avatar";
import LikeButton from "@/components/LikeButton";
import { createComment, deleteComment } from "@/actions/comments";

export default function PostFooter({
  postId,
  postAuthorId,
  currentUserId,
  initialLiked,
  initialLikeCount,
  initialComments,
  initialCommentCount,
}) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [count, setCount] = useState(initialCommentCount);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    setError("");

    const result = await createComment(postId, text);

    setSending(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setComments((prev) => [...prev, result.comment]);
    setCount((c) => c + 1);
    setText("");
  }

  async function handleDelete(commentId) {
    setDeletingId(commentId);
    setError("");

    const result = await deleteComment(commentId);

    setDeletingId(null);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setCount((c) => c - 1);
  }

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2">
        <LikeButton
          postId={postId}
          initialLiked={initialLiked}
          initialCount={initialLikeCount}
        />
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle comments"
          className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
        >
          <MessageCircle size={22} className="text-gray-500" />
          {count > 0 && <span>{count}</span>}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-gray-100 px-3 py-3">
              {count > comments.length && (
                <p className="text-xs text-gray-400">
                  Showing the latest {comments.length} comments
                </p>
              )}

              {comments.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No comments yet. Start the conversation!
                </p>
              ) : (
                <ul className="space-y-3">
                  {comments.map((c) => {
                    const canDelete =
                      c.authorId === currentUserId ||
                      postAuthorId === currentUserId;

                    return (
                      <li key={c.id} className="flex items-start gap-2">
                        <Avatar
                          name={c.authorName}
                          image={c.authorImage}
                          size={28}
                        />
                        <div className="min-w-0 flex-1 rounded-2xl bg-gray-100 px-3 py-2">
                          <div className="flex items-baseline gap-2">
                            <Link
                              href={`/profile/${c.authorId}`}
                              className="text-sm font-semibold hover:underline"
                            >
                              {c.authorName}
                            </Link>
                            <span className="text-xs text-gray-400">
                              {c.date}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap break-words text-sm">
                            {c.text}
                          </p>
                        </div>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={deletingId === c.id}
                            aria-label="Delete comment"
                            className="rounded-full p-2.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600 disabled:opacity-50"
                          >
                            {deletingId === c.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={300}
                  placeholder="Write a comment..."
                  className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-brand-500"
                />
                <button
                  disabled={sending || !text.trim()}
                  aria-label="Send comment"
                  className="rounded-full bg-brand-500 p-2.5 text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
