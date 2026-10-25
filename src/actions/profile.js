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
};
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function deleteOldAvatar(url) {
  const key = url ? keyFromUrl(url) : null;
  if (!key) return;
  try {
    await deleteFromR2(key);
  } catch (err) {
    console.error("Failed to delete old avatar:", err);
  }
}

export async function updateAvatar(formData) {
  const session = await getSession();
  if (!session) {
    return { error: "You must be logged in." };
  }

  const file = formData.get("avatar");
  if (!file || typeof file === "string" || file.size === 0) {
    return { error: "Please choose an image." };
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { error: "Only JPG, PNG or WebP images are allowed." };
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return { error: "Image must be 2 MB or smaller." };
  }

  const userId = session.user.id;

  try {
    const current = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `avatars/${userId}/${crypto.randomUUID()}.${extension}`;
    const imageUrl = await uploadToR2({
      key,
      body: buffer,
      contentType: file.type,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    await deleteOldAvatar(current?.image);
  } catch (err) {
    console.error("updateAvatar failed:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function removeAvatar() {
  const session = await getSession();
  if (!session) {
    return { error: "You must be logged in." };
  }

  const userId = session.user.id;

  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { image: true },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { image: null },
  });

  await deleteOldAvatar(current?.image);

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateName(name) {
  const session = await getSession();
  if (!session) {
    return { error: "You must be logged in." };
  }

  const clean = (name || "").toString().trim().replace(/\s+/g, " ");
  if (clean.length < 2) {
    return { error: "Name must be at least 2 characters." };
  }
  if (clean.length > 50) {
    return { error: "Name must be 50 characters or fewer." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: clean },
  });

  revalidatePath("/", "layout");
  return { success: true };
}
