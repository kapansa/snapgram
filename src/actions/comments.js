"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export async function createComment(postId, text) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "You must be logged in." };
  }

  const clean = (text || "").toString().trim();
  if (!clean) {
    return { error: "Comment can't be empty." };
  }
  if (clean.length > 300) {
    return { error: "Comment must be 300 characters or fewer." };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) {
    return { error: "Post not found." };
  }

  const created = await prisma.comment.create({
    data: { text: clean, postId, authorId: session.user.id },
  });

  return {
    comment: {
      id: created.id,
      text: created.text,
      date: formatDate(created.createdAt),
      authorId: session.user.id,
      authorName: session.user.name,
      authorImage: session.user.image ?? null,
    },
  };
}

export async function deleteComment(commentId) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "You must be logged in." };
  }

  const userId = session.user.id;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      authorId: true,
      post: { select: { authorId: true } },
    },
  });
  if (!comment) {
    return { error: "Comment not found." };
  }

  const allowed =
    comment.authorId === userId || comment.post.authorId === userId;
  if (!allowed) {
    return { error: "You can't delete this comment." };
  }

  await prisma.comment.delete({ where: { id: comment.id } });
  return { success: true };
}
