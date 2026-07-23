import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Campaign Management</h1>
        <button
          style={{
            backgroundColor: "#d92027",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          + New Campaign
        </button>
      </div>

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Recent Campaigns</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Sent Date</th>
              <th>Stats</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp) => (
              <tr key={camp.id}>
                <td>
                  <strong>{camp.name}</strong>
                </td>
                <td>{camp.subject}</td>
                <td>
                  <span className={`admin-badge ${camp.status.toLowerCase()}`}>
                    {camp.status}
                  </span>
                </td>
                <td>
                  {camp.sentAt
                    ? new Date(camp.sentAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <small>
                    {camp.totalOpens} opens / {camp.totalClicks} clicks
                  </small>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                  No campaigns yet. Click "New Campaign" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
