"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Code,
  Heart,
  ImagePlus,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";

const features = [
  {
    icon: ImagePlus,
    title: "Share a photo",
    text: "Pick a picture, write a caption, and post it in a few clicks. Edit the caption or delete the post whenever you like.",
  },
  {
    icon: Heart,
    title: "Like and comment",
    text: "Show some love with a tap, and join the conversation underneath any post.",
  },
  {
    icon: Users,
    title: "Your own profile",
    text: "Add a profile picture and see everything you've shared in one tidy grid.",
  },
  {
    icon: ShieldCheck,
    title: "Secure accounts",
    text: "Safe sign-in, password reset by email, and settings to update your details anytime.",
  },
];

const steps = [
  {
    title: "Create your account",
    text: "Sign up with your name, email, and a password.",
  },
  {
    title: "Post your first photo",
    text: "Choose an image, add a caption, and share it.",
  },
  {
    title: "Connect with others",
    text: "Browse the feed, like posts, and leave comments.",
  },
];

function PreviewCard() {
  const [liked, setLiked] = useState(false);
  const likes = 24 + (liked ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 2 }}
      whileHover={{ rotate: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
    >
      <span className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-500 shadow-sm">
        Sample post
      </span>

      <div className="flex items-center gap-3 p-3">
        <div
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white"
        >
          A
        </div>
        <div className="leading-tight">
          <p className="font-semibold">Amara</p>
          <p className="text-xs text-gray-500">Just now</p>
        </div>
      </div>

      <p className="px-3 pb-3 text-[15px] leading-relaxed">
        Golden hour at the market. Best light of the whole week.
      </p>

      <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-brand-500 via-orange-300 to-amber-200">
        <Camera size={72} className="text-white/80" aria-hidden="true" />
      </div>

      <div className="flex items-center gap-4 px-3 py-2 text-sm text-gray-600">
        <button
          onClick={() => setLiked((l) => !l)}
          aria-pressed={liked}
          aria-label={liked ? "Unlike sample post" : "Like sample post"}
          className="flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:bg-gray-100"
        >
          <Heart
            size={22}
            className={
              liked ? "fill-brand-500 text-brand-500" : "text-gray-500"
            }
          />
          {likes}
        </button>
        <span className="flex items-center gap-1.5 px-2 py-1">
          <MessageCircle size={22} className="text-gray-500" />6
        </span>
      </div>
    </motion.div>
  );
}

export default function LandingPage({ year }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-brand-500/10 to-transparent"
      />

      {/* Navigation */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 text-xl font-bold">
          <Camera className="text-brand-500" />
          Snapgram
        </span>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 pb-16 pt-8 md:grid-cols-2 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-600">
            <Sparkles size={14} />
            Simple photo sharing
          </span>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Share your moments,{" "}
            <span className="text-brand-500">one photo</span> at a time.
          </h1>

          <p className="max-w-md text-lg text-gray-600">
            Post pictures with captions, follow what everyone is sharing, and
            keep all your memories on a profile that&apos;s yours.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-medium text-white shadow-sm transition active:scale-95 hover:bg-brand-600"
            >
              Create your account
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition active:scale-95 hover:bg-gray-100"
            >
              Log in
            </Link>
          </div>
        </motion.div>

        <PreviewCard />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-3 text-gray-600">
              A focused space for sharing pictures with the people around you.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-xl bg-brand-500/10 p-3 text-brand-600">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">
            How it works
          </h2>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.1}>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <div className="rounded-3xl bg-brand-500 px-6 py-12 text-center text-white shadow-lg">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to share your first photo?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/90">
              It only takes a minute to create an account and post.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-brand-600 transition active:scale-95 hover:bg-gray-100"
            >
              Get started
              <ArrowRight size={18} />
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-500 sm:flex-row">
          <span className="flex items-center gap-2">
            <Camera size={16} className="text-brand-500" />© {year} Snapgram
          </span>
          <div className="flex items-center gap-5">
            <Link href="/login" className="hover:text-brand-600">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-brand-600">
              Sign up
            </Link>
            <a
              href="https://github.com/kapansa/snapgram"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-brand-600"
            >
              <Code size={16} />
              Open source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
