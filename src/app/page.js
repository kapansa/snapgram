import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";
import CreatePostForm from "@/components/CreatePostForm";
import PostCard from "@/components/PostCard";
import { Camera, User, Settings } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import Avatar from "@/components/Avatar";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <main className="space-y-4 p-8">
        <h1 className="text-3xl font-bold">Welcome</h1>
        <div className="flex gap-4">
          <Link href="/login" className="underline">
            Log in
          </Link>
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </main>
    );
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
      likes: {
        where: { userId: session.user.id },
        select: { userId: true },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          text: true,
          createdAt: true,
          authorId: true,
          author: { select: { name: true, image: true } },
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Camera className="text-brand-500" />
          Snapgram
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${session.user.id}`}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-600"
          >
            <Avatar
              name={session.user.name}
              image={session.user.image}
              size={28}
            />
            {session.user.name}
          </Link>
          <Link
            href="/settings"
            aria-label="Settings"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <Settings size={18} />
          </Link>
          <SignOutButton />
        </div>
      </header>

      <CreatePostForm />

      <section className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
            No posts yet. Be the first!
          </p>
        ) : (
          posts.map((post, i) => (
            <FadeIn key={post.id} delay={Math.min(i, 4) * 0.08}>
              <PostCard post={post} currentUserId={session.user.id} />
            </FadeIn>
          ))
        )}
      </section>
    </main>
  );
}
