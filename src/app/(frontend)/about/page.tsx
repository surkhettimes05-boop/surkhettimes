import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'हाम्रो बारेमा | SurkhetTimes',
  description: 'सुर्खेत टाइम्सको बारेमा जानकारी (About SurkhetTimes)',
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--accent-1)', paddingBottom: '0.5rem' }}>
        हाम्रो बारेमा (About Us)
      </h1>
      
      <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          <strong>SurkhetTimes</strong> is the leading digital-first news organization dedicated to serving the Karnali Province and bringing local stories to the national stage.
        </p>
        
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem' }}>Our Mission</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Our mission is to provide accurate, unbiased, and timely news to our readers. We believe in the power of journalism to drive positive change and foster a more informed society.
        </p>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem' }}>Our Coverage</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          While we cover national and international events, our primary focus remains deeply rooted in local reporting from Surkhet and the broader Karnali region. From political shifts to cultural events, we strive to be the definitive voice of the community.
        </p>

        <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f5f5f5', borderLeft: '4px solid var(--accent-2)' }}>
          <p style={{ fontStyle: 'italic', color: '#555' }}>
            [Note to editor: Please update this placeholder text with your official company history, founding details, and staff information.]
          </p>
        </div>
      </div>
    </div>
  );
}
