import Link from 'next/link';
import AIDisclosure from '@/components/AIDisclosure/AIDisclosure';
import styles from './ArticleCard.module.css';

export interface ArticleCardProps {
  /** Article headline */
  title: string;
  /** Short article summary */
  summary: string;
  /** Category name (e.g., राजनीति, खेलकुद) */
  category: string;
  /** Author name */
  author: string;
  /** Formatted date string */
  date: string;
  /** Optional cover image URL */
  imageUrl?: string;
  /** URL-safe article slug */
  slug: string;
  /** Whether the article has an AI-generated audio version */
  hasAudio?: boolean;
  /** Whether the article has an AI-generated video version */
  hasVideo?: boolean;
}

export default function ArticleCard({
  title,
  summary,
  category,
  author,
  date,
  imageUrl,
  slug,
  hasAudio = false,
  hasVideo = false,
}: ArticleCardProps) {
  const showMediaBadges = hasAudio || hasVideo;

  return (
    <Link href={`/article/${slug}`} className={styles.card}>
      {/* Image Section */}
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            📰
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        <div className={styles.metaTop}>
          <span className={styles.categoryBadge}>{category}</span>
          {showMediaBadges && (
            <div className={styles.mediaBadge}>
              {hasAudio && <AIDisclosure type="audio" small />}
              {hasVideo && <AIDisclosure type="video" small />}
            </div>
          )}
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.summary}>{summary}</p>

        <div className={styles.footer}>
          <span className={styles.author}>{author}</span>
          <span className={styles.separator}>|</span>
          <time className={styles.date}>{date}</time>
        </div>
      </div>
    </Link>
  );
}
