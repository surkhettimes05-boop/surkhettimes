import { defineField, defineType } from 'sanity';

export const advertisement = defineType({
  name: 'advertisement',
  title: 'Advertisement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'targetUrl',
      title: 'Target URL',
      type: 'url',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description: 'The advertisement will start showing on this date.',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'The advertisement will auto-expire and stop showing after this date.',
    }),
  ],
});
