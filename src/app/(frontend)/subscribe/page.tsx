import React from "react";
import { NewsletterHero } from "@/components/Newsletter";

export const metadata = {
  title: "Subscribe to the Morning Brief | Surkhet Times",
  description:
    "Get the most important Nepal and Karnali news delivered directly to your inbox every morning.",
  openGraph: {
    title: "Subscribe to the Morning Brief",
    description: "Join thousands of smart readers getting daily news.",
  },
};

export default function SubscribePage() {
  return (
    <main>
      <NewsletterHero />
    </main>
  );
}
