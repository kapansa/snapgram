import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import AvatarForm from "@/components/settings/AvatarForm";
import NameForm from "@/components/settings/NameForm";
import PasswordForm from "@/components/settings/PasswordForm";

function Section({ title, children }) {
  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-600"
      >
        <ArrowLeft size={16} />
        Back to feed
      </Link>

      <h1 className="text-2xl font-bold">Settings</h1>

      <Section title="Profile picture">
        <AvatarForm name={user.name} image={user.image} />
      </Section>

      <Section title="Details">
        <NameForm initialName={user.name} email={user.email} />
      </Section>

      <Section title="Password">
        <PasswordForm />
      </Section>
    </main>
  );
}
