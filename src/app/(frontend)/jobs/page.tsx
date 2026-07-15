import React from 'react';
import { client } from '@/sanity/client';
import styles from './page.module.css';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  applyUrl: string;
  postedDate?: string;
}

export const revalidate = 60;

export default async function JobsPage() {
  let jobs: Job[] = [];
  try {
    jobs = await client.fetch<Job[]>(`
      *[_type == "job"] | order(postedDate desc) {
        _id,
        title,
        company,
        location,
        description,
        applyUrl,
        postedDate
      }
    `);
  } catch (err) {
    console.warn("Could not fetch Sanity jobs. Falling back to empty array.");
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Career Opportunities</h1>
        <p className={styles.subtitle}>Find your next big step in Surkhet and beyond</p>
      </div>

      {jobs.length === 0 ? (
        <div className={styles.emptyState}>
          No job postings available at this time. Check back soon.
        </div>
      ) : (
        <div className={styles.jobList}>
          {jobs.map((job) => (
            <div key={job._id} className={styles.jobCard}>
              <div className={styles.jobInfo}>
                <h2 className={styles.jobTitle}>{job.title}</h2>
                <div className={styles.jobMeta}>
                  <span className={styles.company}>{job.company}</span>
                  <span className={styles.location}>{job.location}</span>
                </div>
                {job.description && (
                  <p className={styles.jobDescription}>{job.description}</p>
                )}
              </div>
              <div className={styles.applyAction}>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applyButton}
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
