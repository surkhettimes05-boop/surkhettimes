import React from 'react';
import { client } from '@/sanity/client';
import styles from './page.module.css';

interface Notice {
  _id: string;
  title: string;
  issuedBy: string;
  date: string;
  content: string;
  attachmentUrl?: string;
}

export const revalidate = 60;

export default async function NoticesPage() {
  let notices: Notice[] = [];
  try {
    notices = await client.fetch<Notice[]>(`
      *[_type == "notice"] | order(date desc) {
        _id,
        title,
        issuedBy,
        date,
        content,
        "attachmentUrl": attachment.asset->url
      }
    `);
  } catch (err) {
    console.warn("Could not fetch Sanity notices. Falling back to empty array.");
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Public Notices</h1>
        <p className={styles.subtitle}>Official announcements and government notices</p>
      </div>

      {notices.length === 0 ? (
        <div className={styles.emptyState}>
          No public notices available at this time.
        </div>
      ) : (
        <div className={styles.noticeList}>
          {notices.map((notice) => (
            <div key={notice._id} className={styles.noticeCard}>
              <h2 className={styles.noticeTitle}>{notice.title}</h2>
              <div className={styles.noticeMeta}>
                <span className={styles.issuedBy}>{notice.issuedBy}</span>
                <span className={styles.date}>
                  {new Date(notice.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className={styles.noticeContent}>
                {notice.content}
              </div>
              {notice.attachmentUrl && (
                <a
                  href={notice.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.attachmentLink}
                >
                  📄 View Attachment
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
