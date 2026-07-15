'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com/surkhettimes' },
  { label: 'Telegram', href: 'https://t.me/surkhettimes' },
  { label: 'WhatsApp', href: 'https://whatsapp.com/channel/surkhettimes' },
] as const;

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerInner}>
        {/* ─── Masthead Mark ─── */}
        <div className={styles.mastheadMark}>
          सुर्खेत टाइम्स
        </div>

        <div className={styles.divider} />

        {/* ─── Colophon Text ─── */}
        <div className={styles.colophon}>
          प्रकाशक: SurkhetTimes Media | प्रधान कार्यालय: सुर्खेत, कर्णाली प्रदेश | सम्पर्क:{' '}
          <a href="mailto:info@surkhettimes.com">info@surkhettimes.com</a>
        </div>

        <div className={styles.divider} />

        {/* ─── Social & Legal ─── */}
        <div className={styles.bottomSection}>
          <div className={styles.socialLinks}>
            {SOCIALS.map((social, idx) => (
              <span key={social.href} className={styles.socialItem}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  {social.label}
                </a>
                {idx < SOCIALS.length - 1 && <span className={styles.separator}>/</span>}
              </span>
            ))}
          </div>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>गोपनीयता नीति</Link>
            <span className={styles.separator}>|</span>
            <Link href="/terms" className={styles.legalLink}>सेवा शर्तहरू</Link>
            <span className={styles.separator}>|</span>
            <span className={styles.copyright}>© 2026 SurkhetTimes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
