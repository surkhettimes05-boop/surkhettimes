import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styled from "styled-components";

export const metadata = {
  title: "Newsletter Archive | Surkhet Times",
  description: "Read past issues of the Surkhet Times Morning Brief.",
};

export default async function NewsletterArchivePage() {
  const archives = await prisma.newsletterArchive.findMany({
    where: { isPublic: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>Newsletter Archive</h1>
      <p style={{ color: "#666", marginBottom: "40px" }}>
        Read our past Morning Briefs and breaking news alerts.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {archives.map((archive) => (
          <div
            key={archive.id}
            style={{
              padding: "24px",
              border: "1px solid #eaeaea",
              borderRadius: "8px",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "8px" }}>
              <Link
                href={`/newsletter/archive/${archive.slug}`}
                style={{ color: "#d92027", textDecoration: "none" }}
              >
                {archive.title}
              </Link>
            </h2>
            <div style={{ fontSize: "14px", color: "#888", marginBottom: "16px" }}>
              {new Date(archive.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <p style={{ margin: 0, color: "#444" }}>
              {archive.excerpt || "Read this issue to learn more about the latest news in Karnali."}
            </p>
          </div>
        ))}

        {archives.length === 0 && (
          <p>No archives available yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
