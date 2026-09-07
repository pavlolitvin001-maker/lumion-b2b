import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schema'

const singletonTypes = new Set([
  'generalSettings',
  'b2bConditions',
  'hero',
  'trustBar',
  'productTypes',
  'benefits',
  'workProcess',
  'priorityDelivery',
  'formTexts',
  'seoSettings',
  'analyticsSettings',
])

export default defineConfig({
  name: 'default',
  title: 'LUMION B2B',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'pkp5ah6s',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('LUMION B2B')
          .items([
            S.listItem()
              .title('Загальні налаштування')
              .child(S.document().schemaType('generalSettings').documentId('generalSettings')),
            S.listItem()
              .title('B2B-умови')
              .child(S.document().schemaType('b2bConditions').documentId('b2bConditions')),
            S.listItem().title('Hero').child(S.document().schemaType('hero').documentId('hero')),
            S.listItem()
              .title('Смуга довіри')
              .child(S.document().schemaType('trustBar').documentId('trustBar')),
            S.listItem()
              .title('Типи гірлянд')
              .child(S.document().schemaType('productTypes').documentId('productTypes')),
            S.listItem()
              .title('Переваги')
              .child(S.document().schemaType('benefits').documentId('benefits')),
            S.listItem()
              .title('Як працюємо')
              .child(S.document().schemaType('workProcess').documentId('workProcess')),
            S.listItem()
              .title('Пріоритетна доставка')
              .child(S.document().schemaType('priorityDelivery').documentId('priorityDelivery')),
            S.listItem()
              .title('Тексти форм')
              .child(S.document().schemaType('formTexts').documentId('formTexts')),
            S.listItem()
              .title('SEO')
              .child(S.document().schemaType('seoSettings').documentId('seoSettings')),
            S.listItem()
              .title('Аналітика та сповіщення')
              .child(S.document().schemaType('analyticsSettings').documentId('analyticsSettings')),
            S.divider(),
            S.documentTypeListItem('case').title('Кейси'),
            S.documentTypeListItem('faqItem').title('FAQ'),
          ]),
    }),
  ],
  document: {
    newDocumentOptions: (previous, { creationContext }) =>
      creationContext.type === 'global'
        ? previous.filter((templateItem) => !singletonTypes.has(templateItem.templateId))
        : previous,
  },
})
