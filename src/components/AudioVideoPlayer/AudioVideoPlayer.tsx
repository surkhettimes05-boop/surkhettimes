'use client';

import AIDisclosure from '@/components/AIDisclosure/AIDisclosure';
import styles from './AudioVideoPlayer.module.css';

export interface AudioVideoPlayerProps {
  /** URL to an audio file */
  audioUrl?: string;
  /** URL to a video file */
  videoUrl?: string;
  /** Title displayed above audio player */
  title: string;
}

export default function AudioVideoPlayer({
  audioUrl,
  videoUrl,
  title,
}: AudioVideoPlayerProps) {
  if (!audioUrl && !videoUrl) {
    return null;
  }

  const disclosureType = videoUrl ? 'video' : 'audio';

  return (
    <div className={styles.container}>
      {/* AI Disclosure Banner */}
      <AIDisclosure type={disclosureType} small={false} />

      {/* Video Player */}
      {videoUrl && (
        <div className={styles.videoWrapper}>
          <video
            className={styles.video}
            controls
            preload="metadata"
            aria-label={`भिडियो: ${title}`}
          >
            <source src={videoUrl} />
            तपाईंको ब्राउजरले भिडियो समर्थन गर्दैन।
          </video>
        </div>
      )}

      {/* Audio Player (only when no video) */}
      {!videoUrl && audioUrl && (
        <div className={styles.audioWrapper}>
          <div className={styles.audioTitle}>
            {title}
          </div>
          <audio
            className={styles.audio}
            controls
            preload="metadata"
            aria-label={`अडियो: ${title}`}
          >
            <source src={audioUrl} />
            तपाईंको ब्राउजरले अडियो समर्थन गर्दैन।
          </audio>
        </div>
      )}
    </div>
  );
}
