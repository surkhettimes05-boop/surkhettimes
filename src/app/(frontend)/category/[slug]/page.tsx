import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import styles from "./page.module.css";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${categoryName} News`,
    description: `Latest ${categoryName} news from Surkhet and Karnali Province.`,
  };
}

export const revalidate = 60;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Fetch articles that match this category
  const query = `*[_type == "article" && category == $slug] | order(date desc)`;
  const articles = await client.fetch(query, { slug });

  // Map category slug to Nepali label for the header
  const categoryMap: Record<string, string> = {
    'news': 'समाचार',
    'politics': 'राजनीति',
    'sports': 'खेलकुद',
    'business': 'व्यापार',
    'agriculture': 'कृषि'
  };

  const nepaliTitle = categoryMap[slug] || slug;

  return (
    <div className={styles.categoryPage}>
      <div className="container">
        <header className={styles.categoryHeader}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/">गृहपृष्ठ</a>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>{nepaliTitle}</span>
          </nav>
          <h1 className={styles.categoryTitle}>{nepaliTitle}</h1>
          <hr className="hairline" />
        </header>

        {articles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>यस वर्गमा अहिले कुनै समाचार छैन।</p>
          </div>
        ) : (
          <div className={styles.articleGrid}>
            {articles.map((a: any) => (
              <ArticleCard
                key={a._id}
                title={a.title}
                summary={a.summary || ""}
                category={a.category}
                author={a.author || "SurkhetTimes"}
                date={a.date || ""}
                imageUrl={a.coverImage ? urlFor(a.coverImage).width(600).height(400).url() : ""}
                slug={a.slug?.current || ""}
                hasAudio={a.hasAudio}
                hasVideo={a.hasVideo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
