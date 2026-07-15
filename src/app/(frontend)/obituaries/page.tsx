import React from 'react';
import { client } from '@/sanity/client';
import styles from './page.module.css';

interface Obituary {
  _id: string;
  name: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  description?: string;
  imageUrl?: string;
}

export const revalidate = 60; // Revalidate every minute

export default async function ObituariesPage() {
  let obituaries: Obituary[] = [];
  try {
    obituaries = await client.fetch<Obituary[]>(`
      *[_type == "obituary"] | order(dateOfDeath desc) {
        _id,
        name,
        dateOfBirth,
        dateOfDeath,
        description,
        "imageUrl": image.asset->url
      }
    `);
  } catch (err) {
    console.warn("Could not fetch Sanity obituaries. Falling back to empty array.");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Obituaries</h1>
      <p className={styles.subtitle}>In loving memory of those we have lost</p>

      {obituaries.length === 0 ? (
        <div className={styles.emptyState}>
          No obituaries found at this time.
        </div>
      ) : (
        <div className={styles.grid}>
          {obituaries.map((obituary) => (
            <div key={obituary._id} className={styles.card}>
              {obituary.imageUrl && (
                <div className={styles.imageWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={obituary.imageUrl}
                    alt={obituary.name}
                    className={styles.image}
                  />
                </div>
              )}
              <div className={styles.content}>
                <h2 className={styles.name}>{obituary.name}</h2>
                {(obituary.dateOfBirth || obituary.dateOfDeath) && (
                  <div className={styles.dates}>
                    {obituary.dateOfBirth ? new Date(obituary.dateOfBirth).toLocaleDateString() : '?'} -{' '}
                    {obituary.dateOfDeath ? new Date(obituary.dateOfDeath).toLocaleDateString() : '?'}
                  </div>
                )}
                {obituary.description && (
                  <p className={styles.description}>{obituary.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
