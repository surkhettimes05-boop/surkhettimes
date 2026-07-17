import { notFound } from "next/navigation";
import FactsToggle from "@/components/FactsToggle/FactsToggle";
import AudioVideoPlayer from "@/components/AudioVideoPlayer/AudioVideoPlayer";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import styles from "./page.module.css";
import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { articleBySlugQuery, articleSlugsQuery, articlesQuery, advertisementsQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import Advertisement from "@/components/Advertisement/Advertisement";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(articleSlugsQuery);
    return slugs || [];
  } catch (error) {
    console.warn("Could not fetch Sanity slugs for static generation. Returning empty array.");
    return [];
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await client.fetch(articleBySlugQuery, { slug });

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.date,
      ...(article.author && { authors: [article.author] }),
    },
  };
}

export const revalidate = 60; // revalidate every 60 seconds

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await client.fetch(articleBySlugQuery, { slug });

  if (!article) {
    notFound();
  }

  const allArticles = await client.fetch(articlesQuery);
  const ads = await client.fetch(advertisementsQuery);
  const articleAd = ads[0] || null;

  const relatedArticles = allArticles.filter(
    (a: any) => a._id !== article._id
  ).slice(0, 3);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://surkhettimes.com';
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": article.coverImage ? [urlFor(article.coverImage).width(1200).height(800).url()] : [],
    "datePublished": article.date,
    "dateModified": article.date,
    "author": [{
      "@type": "Person",
      "name": article.author || 'SurkhetTimes Desk',
      "url": baseUrl
    }],
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "SurkhetTimes",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon.ico`
      }
    }
  };

  return (
    <div className={styles.articlePage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`container ${styles.articleLayout}`}>
        {/* Main Content */}
        <article className={styles.articleMain}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/">गृहपृष्ठ</a>
            <span className={styles.breadcrumbSep}>›</span>
            <a href="#">{article.category}</a>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>{article.title}</span>
          </nav>

          {/* Category Badge */}
          <span className={styles.categoryBadge}>{article.category}</span>

          {/* Title */}
          <h1 className={styles.articleTitle}>{article.title}</h1>

          {/* Meta */}
          <div className={styles.articleMeta}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                {article.author?.charAt(0) || 'ST'}
              </div>
              <div>
                <span className={styles.authorName}>{article.author || 'SurkhetTimes'}</span>
                <span className={styles.publishDate}>{article.date}</span>
              </div>
            </div>
            <div className={styles.shareButtons}>
              <button className={styles.shareBtn} aria-label="Share on Facebook">
                📘
              </button>
              <button className={styles.shareBtn} aria-label="Share on WhatsApp">
                📱
              </button>
              <button className={styles.shareBtn} aria-label="Copy link">
                🔗
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className={styles.articleImage}>
            {article.coverImage ? (
              <img src={urlFor(article.coverImage).width(1200).height(800).url()} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>📰</span>
              </div>
            )}
          </div>

          {/* Audio/Video Player */}
          {(article.audioUrl || article.videoUrl) && (
            <AudioVideoPlayer
              audioUrl={article.audioUrl}
              videoUrl={article.videoUrl}
              title={article.title}
            />
          )}

          {/* Facts / Full Story Toggle */}
          <FactsToggle
            facts={article.facts}
            fullStory={article.fullStory}
          />

          {/* Corrections Notice */}
          <div className={styles.correctionsNotice}>
            <p>
              📝 यो कथामा कुनै त्रुटि भेट्टाउनुभयो? हामीलाई{" "}
              <a href="mailto:info@surkhettimes.com">जानकारी दिनुहोस्</a>।
            </p>
          </div>
        </article>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Article Sidebar Ad Slot */}
          <Advertisement ad={articleAd} />

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarHeading}>सम्बन्धित समाचार</h3>
            <div className={styles.relatedList}>
              {relatedArticles.map((related: any) => (
                <a
                  key={related._id}
                  href={`/article/${related.slug}`}
                  className={styles.relatedItem}
                >
                  <span className={styles.relatedCategory}>
                    {related.category}
                  </span>
                  <h4 className={styles.relatedTitle}>{related.title}</h4>
                  <span className={styles.relatedDate}>{related.date}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Audio Brief CTA */}
          <div className={styles.sidebarCta}>
            <div className={styles.ctaPulse}></div>
            <h3>🎧 दैनिक अडियो ब्रिफ</h3>
            <p>
              हरेक दिन बिहान — सुर्खेत र कर्णालीका मुख्य समाचार सुन्नुहोस्।
            </p>
            <div className={styles.ctaButtons}>
              <a href="#" className={styles.ctaBtn}>
                📱 WhatsApp
              </a>
              <a href="#" className={styles.ctaBtn}>
                ✈️ Telegram
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* More Articles */}
      <section className={styles.moreArticles}>
        <div className="container">
          <h2 className={styles.moreTitle}>थप समाचारहरू</h2>
          <div className={styles.moreGrid}>
            {allArticles.filter((a: any) => a._id !== article._id)
              .slice(0, 3)
              .map((a: any) => (
                <ArticleCard
                  key={a._id}
                  title={a.title}
                  summary={a.summary}
                  category={a.category}
                  author={a.author}
                  date={a.date || ""}
                  imageUrl={a.coverImage ? urlFor(a.coverImage).width(600).height(400).url() : ""}
                  slug={a.slug}
                  hasAudio={a.hasAudio}
                  hasVideo={a.hasVideo}
                />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
