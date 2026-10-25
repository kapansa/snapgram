import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail({ to, subject, text, html }) {
  // No API key? Print the email to the terminal instead (handy in development).
  if (!resend) {
    console.log(
      `\n[email not sent: no RESEND_API_KEY]\nTo: ${to}\nSubject: ${subject}\n${text}\n`,
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "Snapgram <onboarding@resend.dev>",
    to,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Failed to send email:", error);
  }
}
