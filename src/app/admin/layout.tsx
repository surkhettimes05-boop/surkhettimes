import React from "react";
import Link from "next/link";
import styled from "styled-components";
import "./admin.css"; // Basic styles for admin

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">Surkhet Times Admin</div>
        <nav className="admin-nav">
          <Link href="/admin/newsletter" className="admin-nav-link">
            Newsletter
          </Link>
          <Link href="/admin/campaigns" className="admin-nav-link">
            Campaigns
          </Link>
          <Link href="/admin/analytics" className="admin-nav-link">
            Analytics
          </Link>
          <Link href="/" className="admin-nav-link">
            Back to Site
          </Link>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
