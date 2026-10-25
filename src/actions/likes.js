"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleLike(postId) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "You must be logged in." };
  }

  const userId = session.user.id;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) {
    return { error: "Post not found." };
  }

  const removed = await prisma.like.deleteMany({ where: { userId, postId } });

  if (removed.count === 0) {
    try {
      await prisma.like.create({ data: { userId, postId } });
    } catch (err) {
      // P2002 = the like already exists (a double click raced us). That's fine.
      if (err.code !== "P2002") {
        console.error("toggleLike failed:", err);
        return { error: "Could not update like." };
      }
    }
  }

  return { success: true };
}
