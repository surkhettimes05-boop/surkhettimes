import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { types } from './src/sanity/schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'SurkhetTimes',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [structureTool()],

  schema: {
    types: types,
  },
});
