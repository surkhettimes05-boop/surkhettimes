import { defineField, defineType } from 'sanity';

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'ai', title: 'AI Automation' },
  ],
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
      type: 'text',
      rows: 10,
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
      title: 'YouTube Video URL',
      type: 'url',
      hidden: ({ parent }) => !parent?.hasVideo,
    }),
    defineField({
      name: 'rawInput',
      title: 'Raw AI Input',
      description: 'The original bullet points submitted to the AI agent for this article.',
      type: 'text',
      readOnly: true,
      group: 'ai',
    }),
    defineField({
      name: 'sourceType',
      title: 'Source Type',
      type: 'string',
      options: {
        list: [
          { title: 'Human Written', value: 'human' },
          { title: 'AI Generated (Needs Review)', value: 'ai_draft' },
        ],
      },
      initialValue: 'human',
      group: 'ai',
    }),
    defineField({
      name: 'suggestedTags',
      title: 'AI Suggested Tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'ai',
    }),
  ],
});
