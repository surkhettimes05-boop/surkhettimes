import styles from './AIDisclosure.module.css';

export interface AIDisclosureProps {
  /** Type of AI-generated content */
  type: 'audio' | 'video' | 'text';
  /** If true, renders compact inline badge; otherwise full banner */
  small?: boolean;
}

export default function AIDisclosure({ type, small = false }: AIDisclosureProps) {
  if (small) {
    const smallLabel = type === 'audio' ? '[ अडियो उपलब्ध ]' : type === 'video' ? '[ भिडियो उपलब्ध ]' : '[ AI-निर्मित ]';
    return (
      <span
        className={styles.badge}
        aria-label={`यो सामग्री ${smallLabel} हो`}
        role="status"
      >
        {smallLabel}
      </span>
    );
  }

  const label = type === 'audio' ? 'AI अडियो' : type === 'video' ? 'AI भिडियो' : 'AI-निर्मित';

  return (
    <div
      className={styles.banner}
      aria-label="AI-निर्मित सामग्री प्रकटीकरण"
      role="note"
    >
      <p className={styles.bannerText}>
        <span className={styles.bannerLabel}>{label}:</span>
        यो सामग्री AI उपकरणको सहायताले उत्पादन गरिएको हो। सम्पादकीय जिम्मेवारी SurkhetTimes को हो।
      </p>
    </div>
  );
}
