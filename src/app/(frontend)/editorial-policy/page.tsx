import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'सम्पादकीय नीति | Editorial Policy | SurkhetTimes',
  description: 'सुर्खेत टाइम्सको सम्पादकीय नीति र सिद्धान्तहरू (Our Editorial Policy and Ethics)',
};

export default function EditorialPolicyPage() {
  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--accent-1)', paddingBottom: '0.5rem' }}>
        सम्पादकीय नीति (Editorial Policy)
      </h1>
      
      <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '2rem' }}>
          SurkhetTimes is committed to the highest standards of journalism. Our editorial policy serves as the foundation for our independent, fair, and accurate reporting.
        </p>
        
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Accuracy and Fact-Checking</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          We strive for pinpoint accuracy in all our reporting. Our journalists are required to verify information from multiple reliable sources before publication. If an error occurs, we are committed to correcting it promptly and transparently.
        </p>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem' }}>2. Independence</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Our newsroom operates entirely independent of our advertising department, corporate interests, and political organizations. Our coverage is driven solely by news value and public interest.
        </p>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Fairness and Impartiality</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          We ensure that all sides of a story are given fair representation. We do not take sides on political issues, and our opinion pieces are strictly separated from our news reporting to prevent any blurring of lines.
        </p>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem' }}>4. Corrections Policy</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          When we make a mistake, we own it. Corrections are clearly marked within the article, and major retractions are featured prominently to maintain reader trust.
        </p>

        <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f5f5f5', borderLeft: '4px solid var(--accent-2)' }}>
          <p style={{ fontStyle: 'italic', color: '#555' }}>
            [Note to editor: Please update this placeholder text with your exact official newsroom policies.]
          </p>
        </div>
      </div>
    </div>
  );
}
