import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subscriberId = searchParams.get("s");
    const campaignId = searchParams.get("c");
    const eventType = searchParams.get("type"); // OPEN or CLICK
    const redirectUrl = searchParams.get("url");

    if (!subscriberId || !eventType) {
      return new NextResponse("Missing parameters", { status: 400 });
    }

    // Record the engagement event
    await prisma.engagementEvent.create({
      data: {
        subscriberId,
        campaignId: campaignId || null,
        eventType: eventType.toUpperCase(),
        linkUrl: redirectUrl || null,
      },
    });

    // Update campaign metrics if applicable
    if (campaignId) {
      if (eventType.toUpperCase() === "OPEN") {
        await prisma.campaign.update({
          where: { id: campaignId },
          data: { totalOpens: { increment: 1 } },
        });
      } else if (eventType.toUpperCase() === "CLICK") {
        await prisma.campaign.update({
          where: { id: campaignId },
          data: { totalClicks: { increment: 1 } },
        });
      }
    }

    // Update subscriber score & timestamp
    await prisma.subscriber.update({
      where: { id: subscriberId },
      data: {
        engagementScore: { increment: eventType.toUpperCase() === "CLICK" ? 2 : 1 },
        ...(eventType.toUpperCase() === "OPEN" ? { lastOpenedAt: new Date() } : {}),
        ...(eventType.toUpperCase() === "CLICK" ? { lastClickedAt: new Date() } : {}),
      },
    });

    if (eventType.toUpperCase() === "OPEN") {
      // Return a 1x1 transparent tracking pixel
      const pixel = Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        "base64"
      );
      return new NextResponse(pixel, {
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      });
    }

    if (eventType.toUpperCase() === "CLICK" && redirectUrl) {
      return NextResponse.redirect(redirectUrl);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Tracking error:", error);
    // Even if it fails, return 200 for pixel or redirect to fallback so user experience isn't broken
    return new NextResponse("Error tracking", { status: 200 });
  }
}
