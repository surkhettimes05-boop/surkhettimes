import { defineField, defineType } from 'sanity';

export const obituary = defineType({
  name: 'obituary',
  title: 'Obituary',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'age',
      title: 'Age',
      type: 'number',
    }),
    defineField({
      name: 'dateOfDeath',
      title: 'Date of Death',
      type: 'date',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
});
