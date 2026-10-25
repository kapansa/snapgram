"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import Avatar from "@/components/Avatar";
import { removeAvatar, updateAvatar } from "@/actions/profile";

export default function AvatarForm({ name, image }) {
  const formRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
    setError("");
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const result = await updateAvatar(new FormData(e.currentTarget));

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    formRef.current.reset();
    setPreview(null);
    setMessage("Profile picture updated.");
  }

  async function handleRemove() {
    setError("");
    setMessage("");
    setRemoving(true);

    const result = await removeAvatar();

    setRemoving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setMessage("Profile picture removed.");
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <Avatar name={name} image={image} size={80} />
        )}

        <div className="flex flex-wrap gap-2">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-100">
            <Upload size={16} />
            Choose photo
            <input
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          {preview && (
            <button
              disabled={loading}
              className="flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Saving..." : "Save photo"}
            </button>
          )}

          {image && !preview && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {removing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Remove
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400">JPG, PNG or WebP, up to 2 MB.</p>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
}
