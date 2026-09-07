import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  // Pin the existing deployment so CLI deployments never create another hostname.
  studioHost: 'lumion-b2b',
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'pkp5ah6s',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
})
