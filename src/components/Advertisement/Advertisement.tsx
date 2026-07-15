import React from 'react';
import styles from './Advertisement.module.css';

interface AdvertisementProps {
  title: string;
  client: string;
  bannerImage: string;
  targetUrl: string;
  startDate: string;
  endDate: string;
}

export default function Advertisement({
  title,
  client,
  bannerImage,
  targetUrl,
  startDate,
  endDate,
}: AdvertisementProps) {
  const currentDate = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (currentDate < start || currentDate > end) {
    return null;
  }

  return (
    <div className={styles.advertisementWrapper}>
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.advertisementLink}
      >
        <span className={styles.advertisementLabel}>Advertisement</span>
        <img
          src={bannerImage}
          alt={title}
          className={styles.advertisementImage}
        />
        <div className={styles.advertisementOverlay}>
          <p className={styles.advertisementTitle}>{title}</p>
          <p className={styles.advertisementClient}>by {client}</p>
        </div>
      </a>
    </div>
  );
}
