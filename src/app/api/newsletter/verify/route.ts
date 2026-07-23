import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is missing" },
        { status: 400 }
      );
    }

    // 1. Find subscriber by token
    const subscriber = await prisma.subscriber.findUnique({
      where: { verificationToken: token },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    if (subscriber.status === "ACTIVE") {
      // Already verified
      // Redirect to a success page
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      return NextResponse.redirect(`${baseUrl}/subscribe/success?alreadyVerified=true`);
    }

    // 2. Update subscriber status
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "ACTIVE",
        verified: true,
        verificationToken: null, // clear token after use
      },
    });

    // 3. Send Welcome Email
    if (subscriber.unsubscribeToken) {
      await sendWelcomeEmail(subscriber.email, subscriber.unsubscribeToken);
    }

    // 4. Redirect to success page
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/subscribe/success`);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
