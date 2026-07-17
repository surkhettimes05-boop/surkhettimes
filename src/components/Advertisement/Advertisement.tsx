import React from 'react';
import styles from './Advertisement.module.css';
import { urlFor } from '@/sanity/image';

interface AdvertisementData {
  title: string;
  client: string;
  bannerImage: any;
  targetUrl: string;
  startDate: string;
  endDate: string;
}

interface AdvertisementProps {
  ad?: AdvertisementData | null;
}

export default function Advertisement({ ad }: AdvertisementProps) {
  // If there's an active ad passed from Sanity
  if (ad && ad.bannerImage && ad.startDate && ad.endDate) {
    const currentDate = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);

    // Only show if we are within the active campaign date range
    if (currentDate >= start && currentDate <= end) {
      return (
        <div className={styles.advertisementWrapper}>
          <a
            href={ad.targetUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.advertisementLink}
          >
            <span className={styles.advertisementLabel}>Advertisement</span>
            <img
              src={urlFor(ad.bannerImage).url()}
              alt={ad.title}
              className={styles.advertisementImage}
            />
            <div className={styles.advertisementOverlay}>
              <p className={styles.advertisementTitle}>{ad.title}</p>
              <p className={styles.advertisementClient}>by {ad.client}</p>
            </div>
          </a>
        </div>
      );
    }
  }

  // Fallback state if no ad is active
  return (
    <div className={`${styles.advertisementWrapper} ${styles.fallbackWrapper}`}>
      <span className={styles.advertisementLabel}>Space Available</span>
      <h3 className={styles.fallbackTitle}>Advertise with Us</h3>
      <p className={styles.fallbackText}>
        Reach thousands of readers across Karnali Province every day.
      </p>
      <a href="mailto:advertise@surkhettimes.com" className={styles.fallbackCta}>
        Contact Us
      </a>
    </div>
  );
}
