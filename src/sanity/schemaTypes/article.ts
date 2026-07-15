import { defineField, defineType } from 'sanity';

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Politics', value: 'politics' },
          { title: 'Sports', value: 'sports' },
          { title: 'Business', value: 'business' },
          { title: 'Agriculture', value: 'agriculture' },
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'facts',
      title: 'Facts',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'fullStory',
      title: 'Full Story',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'hasAudio',
      title: 'Has Audio',
      type: 'boolean',
    }),
    defineField({
      name: 'hasVideo',
      title: 'Has Video',
      type: 'boolean',
    }),
    defineField({
      name: 'audioUrl',
      title: 'Audio URL',
      type: 'url',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    }),
  ],
});
