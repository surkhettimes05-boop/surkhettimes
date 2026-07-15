export const articlesQuery = `*[_type == "article"] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  author,
  date,
  coverImage,
  facts,
  fullStory,
  "summary": array::join(string::split(pt::text(fullStory), "")[0..200], "") + "...",
  hasAudio,
  hasVideo,
  audioUrl,
  videoUrl
}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  category,
  author,
  date,
  coverImage,
  facts,
  fullStory,
  "summary": array::join(string::split(pt::text(fullStory), "")[0..200], "") + "...",
  hasAudio,
  hasVideo,
  audioUrl,
  videoUrl
}`;

export const articleSlugsQuery = `*[_type == "article" && defined(slug.current)][]{"slug": slug.current}`;

export const obituariesQuery = `*[_type == "obituary"] | order(date desc)`;
export const jobsQuery = `*[_type == "job"] | order(date desc)`;
export const noticesQuery = `*[_type == "notice"] | order(date desc)`;
export const advertisementsQuery = `*[_type == "advertisement"] | order(date desc)`;
