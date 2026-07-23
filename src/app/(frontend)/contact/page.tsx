import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'सम्पर्क | Contact Us | SurkhetTimes',
  description: 'सुर्खेत टाइम्ससँग सम्पर्क गर्नुहोस् (Contact SurkhetTimes newsroom)',
};

export default function ContactPage() {
  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--accent-1)', paddingBottom: '0.5rem' }}>
        सम्पर्क (Contact Us)
      </h1>
      
      <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '2rem' }}>
          We value your feedback, tips, and inquiries. Please reach out to the appropriate department below.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ background: '#fff', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1rem' }}>Newsroom & Tips</h3>
            <p><strong>Email:</strong> surkhettimes05@gmail.com</p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/9779822403262" style={{color: 'var(--accent-1)'}}>+977 9822403262</a></p>
          </div>
          
          <div style={{ background: '#fff', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1rem' }}>Advertising</h3>
            <p><strong>Email:</strong> surkhettimes05@gmail.com</p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/9779822403262" style={{color: 'var(--accent-1)'}}>+977 9822403262</a></p>
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem' }}>Our Office</h2>
        <address style={{ fontStyle: 'normal', marginBottom: '1.5rem' }}>
          <strong>SurkhetTimes Media Pvt. Ltd.</strong><br />
          Birendranagar, Surkhet<br />
          Karnali Province, Nepal
        </address>

        <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f5f5f5', borderLeft: '4px solid var(--accent-2)' }}>
          <p style={{ fontStyle: 'italic', color: '#555' }}>
            [Note to editor: Please update this placeholder text with your actual phone numbers and precise office address.]
          </p>
        </div>
      </div>
    </div>
  );
}
