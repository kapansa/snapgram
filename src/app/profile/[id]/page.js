import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import Avatar from "@/components/Avatar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FadeIn from "@/components/FadeIn";

export default async function ProfilePage({ params }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      image: true,
      posts: {
        orderBy: { createdAt: "desc" },
        select: { id: true, imageUrl: true, caption: true },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const isOwnProfile = session.user.id === user.id;
  const joined = user.createdAt.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-600"
      >
        <ArrowLeft size={16} />
        Back to feed
      </Link>

      <header className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <Avatar name={user.name} image={user.image} size={80} />
        <div>
          <h1 className="text-2xl font-bold">
            {user.name}
            {isOwnProfile && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                (you)
              </span>
            )}
          </h1>
          {isOwnProfile && (
            <Link
              href="/settings"
              className="mt-1 inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
            >
              <Settings size={12} />
              Edit profile
            </Link>
          )}
          <p className="text-sm text-gray-600">
            {user.posts.length} {user.posts.length === 1 ? "post" : "posts"} ·
            Joined {joined}
          </p>
        </div>
      </header>

      {user.posts.length === 0 ? (
        <p className="text-center text-gray-500">
          {isOwnProfile ? "You haven't posted yet." : "No posts yet."}
        </p>
      ) : (
        <section className="grid grid-cols-3 gap-1 overflow-hidden rounded-2xl">
          {user.posts.map((post, i) => (
            <FadeIn key={post.id} delay={Math.min(i, 8) * 0.04}>
              <Image
                src={post.imageUrl}
                alt={post.caption || `Photo by ${user.name}`}
                width={400}
                height={400}
                unoptimized
                className="aspect-square w-full bg-gray-100 object-cover transition hover:opacity-90"
              />
            </FadeIn>
          ))}
        </section>
      )}
    </main>
  );
}
