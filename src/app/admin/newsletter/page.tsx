import React from "react";
import { prisma } from "@/lib/prisma";

export default async function AdminNewsletterPage() {
  // In a real app, you would add authentication to protect this page.
  // We'll fetch subscribers directly via Prisma Server Components.

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalSubscribers = await prisma.subscriber.count({
    where: { status: "ACTIVE" },
  });

  const pendingSubscribers = await prisma.subscriber.count({
    where: { status: "PENDING" },
  });

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Audience Management</h1>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div className="admin-card" style={{ flex: 1, margin: 0 }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#666" }}>Active Subscribers</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", margin: 0 }}>{totalSubscribers}</p>
        </div>
        <div className="admin-card" style={{ flex: 1, margin: 0 }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#666" }}>Pending Opt-Ins</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", margin: 0 }}>{pendingSubscribers}</p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Recent Subscribers</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Source</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <strong>{sub.email}</strong>
                </td>
                <td>
                  <span className={`admin-badge ${sub.status.toLowerCase()}`}>
                    {sub.status}
                  </span>
                </td>
                <td>{sub.source || "Unknown"}</td>
                <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
