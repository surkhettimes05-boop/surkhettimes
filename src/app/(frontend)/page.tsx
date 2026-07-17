import styles from "./page.module.css";
import { client } from "@/sanity/client";
import { articlesQuery, advertisementsQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import Advertisement from "@/components/Advertisement/Advertisement";

export const revalidate = 60; // revalidate every 60 seconds

export default async function HomePage() {
  let articles: any[] = [];
  let ads: any[] = [];
  try {
    articles = await client.fetch(articlesQuery);
    ads = await client.fetch(advertisementsQuery);
  } catch (error) {
    console.warn("Could not fetch Sanity data for HomePage.");
  }
  const heroArticle = articles[0] || null;
  const homeAd = ads[0] || null;

  if (!heroArticle) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
          <h2 style={{ fontFamily: 'serif' }}>आजको मुख्य समाचार तयार हुँदैछ।</h2>
          <p style={{ marginTop: '1rem' }}>
            <a href="/archive" style={{ textDecoration: 'underline' }}>पुराना समाचार पढ्नुहोस्</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Breaking News Ticker */}
      <div className={styles.ticker}>
        <span className={styles.tickerLabel}>ताजा</span>
        <div className={styles.tickerTrack}>
          <p className={styles.tickerText}>
            {articles.slice(0, 5).map((a: { title: string }) => a.title).join(" • ")}
          </p>
        </div>
      </div>

      {/* Front Page Layout */}
      <section className={styles.frontPageSection}>
        <div className={`container ${styles.frontPageInner}`}>
          {/* Left Column (Lead Story) */}
          <div className={styles.leadStory}>
            {heroArticle.coverImage && (
              <div className={styles.leadImageWrapper}>
                <img 
                  src={urlFor(heroArticle.coverImage).width(1200).height(800).url()} 
                  alt={heroArticle.title} 
                  className={styles.leadImage}
                />
              </div>
            )}
            <div className={styles.leadContent}>
              <h1 className={styles.leadHeadline}>
                <a href={`/article/${heroArticle.slug}`}>
                  {heroArticle.title}
                </a>
              </h1>
              <div className={styles.leadMeta}>
                <span className={styles.leadByline}>{heroArticle.author}</span>
                <span className={styles.metaDivider}>|</span>
                <span className={styles.leadDate}>{heroArticle.date}</span>
                {heroArticle.hasAudio && (
                  <span className={styles.leadAiBadge}>🎧 AI अडियो</span>
                )}
              </div>
              <p className={styles.leadExcerpt}>{heroArticle.summary}</p>
            </div>
          </div>

          {/* Right Column (Secondary Stories) */}
          <div className={styles.secondaryStories}>
            {articles.slice(1, 5).map((article: any) => (
              <div key={article._id} className={styles.secondaryArticle}>
                <span className={styles.secondaryCategory}>
                  {article.category}
                </span>
                <h3 className={styles.secondaryHeadline}>
                  <a href={`/article/${article.slug}`}>{article.title}</a>
                </h3>
                <p className={styles.secondaryExcerpt}>{article.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Ad Slot */}
      <div className="container">
        <Advertisement ad={homeAd} />
      </div>

      {/* Editorial Audio Brief CTA */}
      <section className={styles.editorialAudioSection}>
        <div className={`container ${styles.editorialAudioInner}`}>
          <div className={styles.editorialAudioContent}>
            <h3 className={styles.editorialAudioTitle}>
              दैनिक अडियो ब्रिफ
            </h3>
            <p className={styles.editorialAudioDesc}>
              हरेक दिन बिहान ७ बजे — सुर्खेत र कर्णालीका मुख्य समाचार, २ मिनेटमा सुन्नुहोस्।
            </p>
          </div>
          <div className={styles.editorialAudioChannels}>
            <a href="#" className={styles.editorialChannelBtn}>WhatsApp</a>
            <a href="#" className={styles.editorialChannelBtn}>Telegram</a>
            <a href="#" className={styles.editorialChannelBtn}>YouTube</a>
          </div>
        </div>
      </section>

      {/* Local Utilities Section */}
      <section className={styles.utilitiesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>स्थानीय सेवाहरू</h2>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.utilitiesGrid}>
            <a href="#" className={styles.utilityCard}>
              <span className={styles.utilityIcon}>🕯️</span>
              <h3>शोक सूचना</h3>
              <p>शोक सन्देश र श्रद्धाञ्जली</p>
            </a>
            <a href="#" className={styles.utilityCard}>
              <span className={styles.utilityIcon}>💼</span>
              <h3>रोजगारी</h3>
              <p>स्थानीय जागिर र अवसरहरू</p>
            </a>
            <a href="#" className={styles.utilityCard}>
              <span className={styles.utilityIcon}>📋</span>
              <h3>सरकारी सूचना</h3>
              <p>टेन्डर, परीक्षा नतिजा, नोटिस</p>
            </a>
            <a href="#" className={styles.utilityCard}>
              <span className={styles.utilityIcon}>🌾</span>
              <h3>कृषि / मौसम</h3>
              <p>मौसम पूर्वानुमान र कृषि सल्लाह</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
