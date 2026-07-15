'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NepaliDate from 'nepali-date-converter';
import styles from './Header.module.css';

/** Navigation items without emojis */
const NAV_ITEMS = [
  { label: 'समाचार', href: '/category/news' },
  { label: 'राजनीति', href: '/category/politics' },
  { label: 'खेलकुद', href: '/category/sports' },
  { label: 'व्यापार', href: '/category/business' },
  { label: 'कृषि', href: '/category/agriculture' },
  { label: 'शोक सूचना', href: '/obituaries' },
  { label: 'रोजगारी', href: '/jobs' },
  { label: 'सरकारी सूचना', href: '/gov-notices' },
] as const;

export default function Header() {
  const [nepaliDateStr, setNepaliDateStr] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Generate Nepali Date client-side to avoid hydration mismatch
    const nd = new NepaliDate();
    setNepaliDateStr(nd.format('ddd, DD MMMM YYYY'));
  }, []);

  return (
    <header className={styles.header} role="banner">
      {/* ─── Top Bar ─── */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <nav className={styles.topNav} aria-label="Top navigation">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={styles.topNavLink}>
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </div>

      {/* ─── Mobile Slide-in Nav ─── */}
      <div className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ''}`}>
        <nav className={styles.mobileNavLinks} aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className={styles.mobileNavDivider} />
          <Link
            href="/audio-brief"
            className={styles.mobileAudioLink}
            onClick={() => setMobileOpen(false)}
          >
            दैनिक अडियो ब्रिफ
          </Link>
        </nav>
      </div>

      {/* ─── Mobile Overlay ─── */}
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayVisible : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ─── Masthead ─── */}
      <div className={styles.masthead}>
        <Link href="/" className={styles.logo} aria-label="सुर्खेत टाइम्स - Home">
          सुर्खेत टाइम्स
        </Link>
      </div>

      {/* ─── Karnali River Motif ─── */}
      <div className={styles.riverMotif} aria-hidden="true">
        <svg preserveAspectRatio="none" viewBox="0 0 1200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 6 Q 150 0, 300 6 T 600 6 T 900 6 T 1200 6" stroke="#2C365E" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* ─── Dateline Bar ─── */}
      <div className={styles.datelineBar}>
        <div className={styles.datelineBarInner}>
          <div className={styles.datelineLeft}>
            {nepaliDateStr || '...'}
          </div>
          <div className={styles.datelineCenter}>
            <Link href="/audio-brief" className={styles.audioLink}>
              दैनिक अडियो ब्रिफ
            </Link>
          </div>
          <div className={styles.datelineRight}>
            SURKHET, 28°C
          </div>
        </div>
      </div>
    </header>
  );
}
