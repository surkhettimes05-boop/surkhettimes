import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

// Basic in-memory rate limiting (for a real app, use Redis)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3;

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting based on IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const rlData = rateLimit.get(ip);
    
    if (rlData && now - rlData.timestamp < RATE_LIMIT_WINDOW) {
      if (rlData.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
      rlData.count += 1;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    // 2. Parse Request
    const body = await req.json();
    const { email, source, userAgent, country, city, honeypot } = body;

    // 3. Honeypot check (Spam prevention)
    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 200 }); // Lie to the bot
    }

    // 4. Validate Email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // 5. Check existing subscriber
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === "ACTIVE") {
        return NextResponse.json(
          { error: "You are already subscribed!" },
          { status: 400 }
        );
      } else if (existingSubscriber.status === "PENDING") {
        // Resend verification email
        await sendVerificationEmail(
          existingSubscriber.email,
          existingSubscriber.verificationToken!
        );
        return NextResponse.json(
          { message: "Verification email resent. Please check your inbox." },
          { status: 200 }
        );
      } else if (existingSubscriber.status === "UNSUBSCRIBED") {
        // Reactivate process
        const verificationToken = crypto.randomBytes(32).toString("hex");
        await prisma.subscriber.update({
          where: { email: email.toLowerCase() },
          data: {
            status: "PENDING",
            verificationToken,
          },
        });
        await sendVerificationEmail(email.toLowerCase(), verificationToken);
        return NextResponse.json(
          { message: "Welcome back! Please check your inbox to verify." },
          { status: 200 }
        );
      }
    }

    // 6. Create new subscriber
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const unsubscribeToken = crypto.randomBytes(32).toString("hex");

    await prisma.subscriber.create({
      data: {
        email: email.toLowerCase(),
        verificationToken,
        unsubscribeToken,
        source: source || "Direct",
        ipAddress: ip !== "unknown" ? ip : undefined,
        userAgent: userAgent || req.headers.get("user-agent"),
        country,
        city,
      },
    });

    // 7. Send Email
    await sendVerificationEmail(email.toLowerCase(), verificationToken);

    return NextResponse.json(
      { message: "Successfully subscribed! Please check your email to verify." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
