import { Resend } from "resend";
import { VerifyEmail } from "@/emails/VerifyEmail";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { render } from "@react-email/components";

// Provide a fallback for local development if no API key is present
const resend = new Resend(process.env.RESEND_API_KEY || "re_fallback_key");

const FROM_EMAIL = "Surkhet Times <newsletter@surkhettimes.com>";

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const verificationLink = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/api/newsletter/verify?token=${verificationToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Confirm your subscription to Surkhet Times",
      react: VerifyEmail({ verificationLink }),
    });

    if (error) {
      console.error("Error sending verification email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
};

export const sendWelcomeEmail = async (
  email: string,
  unsubscribeToken: string
) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const unsubscribeLink = `${baseUrl}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
  const preferencesLink = `${baseUrl}/subscribe/preferences?token=${unsubscribeToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Surkhet Times!",
      react: WelcomeEmail({ unsubscribeLink, preferencesLink }),
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
};
