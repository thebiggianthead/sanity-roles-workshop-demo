import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {projectId: 'uvxetc8v', dataset: 'production'},
  studioHost: 'roles-workshop',
  deployment: {appId: '53b8a5bdb041327daf2d451c', autoUpdates: true},
})
