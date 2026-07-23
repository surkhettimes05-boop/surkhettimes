import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NewsletterHero } from "@/components/Newsletter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const archive = await prisma.newsletterArchive.findUnique({
    where: { slug },
  });

  if (!archive) {
    return { title: "Not Found" };
  }

  return {
    title: `${archive.title} | Surkhet Times Newsletter`,
    description: archive.excerpt || "Surkhet Times Morning Brief",
  };
}

export default async function ArchiveIssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const archive = await prisma.newsletterArchive.findUnique({
    where: { slug },
  });

  if (!archive || !archive.isPublic) {
    notFound();
  }

  return (
    <main>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px" }}>
        <h1 style={{ fontSize: "40px", marginBottom: "16px", lineHeight: 1.2 }}>
          {archive.title}
        </h1>
        <div
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "40px",
            paddingBottom: "20px",
            borderBottom: "1px solid #eaeaea",
          }}
        >
          Published on{" "}
          {new Date(archive.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        <div
          style={{ fontSize: "18px", lineHeight: 1.8, color: "#333" }}
          dangerouslySetInnerHTML={{ __html: archive.content }}
        />
      </div>
      
      {/* Show the subscribe hero at the bottom of the archive issue */}
      <NewsletterHero />
    </main>
  );
}
