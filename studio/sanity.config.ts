import { defineConfig } from 'sanity'

export default defineConfig({
  name: 'default',
  title: 'LUMION B2B',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'pkp5ah6s',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  schema: {
    // Content migration and schema design are intentionally out of scope.
    types: [],
  },
})
