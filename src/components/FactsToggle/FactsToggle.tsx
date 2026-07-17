'use client';

import { useState } from 'react';
import styles from './FactsToggle.module.css';

import { PortableText } from 'next-sanity';

export interface FactsToggleProps {
  /** Array of fact strings displayed as a bulleted list */
  facts: string[];
  /** Full story content as Sanity block array */
  fullStory: unknown;
}

type Tab = 'facts' | 'story';

export default function FactsToggle({ facts, fullStory }: FactsToggleProps) {
  const [activeTab, setActiveTab] = useState<Tab>('facts');

  return (
    <div className={styles.container}>
      {/* Tab Bar */}
      <div className={styles.tabBar} role="tablist" aria-label="सामग्री हेर्ने तरिका">
        <button
          className={`${styles.tab} ${activeTab === 'facts' ? styles.tabActive : ''}`}
          role="tab"
          aria-selected={activeTab === 'facts'}
          aria-controls="panel-facts"
          id="tab-facts"
          onClick={() => setActiveTab('facts')}
          type="button"
        >
          तथ्यहरू
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'story' ? styles.tabActive : ''}`}
          role="tab"
          aria-selected={activeTab === 'story'}
          aria-controls="panel-story"
          id="tab-story"
          onClick={() => setActiveTab('story')}
          type="button"
        >
          पूर्ण कथा
        </button>
      </div>

      {/* Facts Panel */}
      {activeTab === 'facts' && (
        <div
          className={styles.contentPanel}
          role="tabpanel"
          id="panel-facts"
          aria-labelledby="tab-facts"
        >
          <ul className={styles.factsList}>
            {facts?.map((fact, index) => (
              <li key={index} className={styles.factItem}>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Full Story Panel */}
      {activeTab === 'story' && (
        <div
          className={styles.contentPanel}
          role="tabpanel"
          id="panel-story"
          aria-labelledby="tab-story"
        >
          <div className={styles.fullStory}>
            {typeof fullStory === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: fullStory }} />
            ) : (
              <PortableText value={fullStory as any} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
