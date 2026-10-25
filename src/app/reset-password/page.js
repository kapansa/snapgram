import Link from "next/link";
import { Camera } from "lucide-react";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({ searchParams }) {
  const { token, error } = await searchParams;
  const invalid = !token || error;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {invalid ? (
          <div className="space-y-4 text-center">
            <Camera size={32} className="mx-auto text-brand-500" />
            <h1 className="text-2xl font-bold">Link not valid</h1>
            <p className="text-sm text-gray-600">
              This reset link is invalid or has expired. Reset links work once
              and last 1 hour.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <ResetPasswordForm token={token} />
        )}
      </div>
    </main>
  );
}
