"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToR2, deleteFromR2, keyFromUrl } from "@/lib/r2";

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function createPost(formData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "You must be logged in to post." };
  }

  const file = formData.get("image");
  const caption = (formData.get("caption") || "").toString().trim();

  if (!file || typeof file === "string" || file.size === 0) {
    return { error: "Please choose an image." };
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { error: "Only JPG, PNG, WebP or GIF images are allowed." };
  }
  if (file.size > MAX_SIZE) {
    return { error: "Image must be 5 MB or smaller." };
  }
  if (caption.length > 500) {
    return { error: "Caption must be 500 characters or fewer." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `posts/${session.user.id}/${crypto.randomUUID()}.${extension}`;
    const imageUrl = await uploadToR2({
      key,
      body: buffer,
      contentType: file.type,
    });

    await prisma.post.create({
      data: {
        imageUrl,
        caption: caption || null,
        authorId: session.user.id,
      },
    });
  } catch (err) {
    console.error("createPost failed:", err);
    return { error: "Something went wrong while posting. Please try again." };
  }

  revalidatePath("/");
  return { success: true };
}

export async function deletePost(postId) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "You must be logged in." };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true, imageUrl: true },
  });

  if (!post) {
    return { error: "Post not found." };
  }
  if (post.authorId !== session.user.id) {
    return { error: "You can only delete your own posts." };
  }

  await prisma.post.delete({ where: { id: post.id } });

  const key = keyFromUrl(post.imageUrl);
  if (key) {
    try {
      await deleteFromR2(key);
    } catch (err) {
      console.error("Failed to delete image from R2:", err);
    }
  }

  revalidatePath("/");
  revalidatePath(`/profile/${session.user.id}`);
  return { success: true };
}

export async function updateCaption(postId, newCaption) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "You must be logged in." };
  }

  const caption = (newCaption || "").toString().trim();
  if (caption.length > 500) {
    return { error: "Caption must be 500 characters or fewer." };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true },
  });

  if (!post) {
    return { error: "Post not found." };
  }
  if (post.authorId !== session.user.id) {
    return { error: "You can only edit your own posts." };
  }

  await prisma.post.update({
    where: { id: post.id },
    data: { caption: caption || null },
  });

  revalidatePath("/");
  revalidatePath(`/profile/${session.user.id}`);
  return { success: true };
}
