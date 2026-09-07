import { defineField, defineType } from 'sanity'

const requiredText = (max: number) => (Rule: any) => Rule.required().min(1).max(max)
const optionalUrl = (Rule: any) => Rule.uri({ scheme: ['http', 'https'], allowRelative: false })
const requiredUrl = (Rule: any) => Rule.required().uri({ scheme: ['http', 'https'], allowRelative: false })
const phone = (Rule: any) => Rule.regex(/^[+0-9() -]{7,32}$/, { name: 'міжнародний номер телефону' })

export const documentTypes = [
  defineType({
    name: 'generalSettings', title: 'Загальні налаштування', type: 'document',
    fields: [
      defineField({ name: 'logo', title: 'Логотип', type: 'imageWithAlt' }),
      defineField({ name: 'phone', title: 'Телефон', type: 'string', validation: phone }),
      defineField({ name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.email() }),
      defineField({ name: 'telegramUrl', title: 'Посилання Telegram', type: 'url', validation: optionalUrl }),
      defineField({ name: 'viberUrl', title: 'Посилання Viber', type: 'url', validation: optionalUrl }),
      defineField({ name: 'otherMessengerUrl', title: 'Інший месенджер', type: 'url', validation: optionalUrl }),
      defineField({ name: 'warehouseAddress', title: 'Адреса складу / шоуруму', type: 'text', rows: 2, validation: (Rule) => Rule.max(240) }),
      defineField({ name: 'workingHours', title: 'Графік роботи', type: 'string', validation: (Rule) => Rule.max(160) }),
      defineField({ name: 'privacyPolicyUrl', title: 'URL політики конфіденційності', type: 'url', validation: optionalUrl }),
    ],
  }),
  defineType({
    name: 'b2bConditions', title: 'B2B-умови', type: 'document',
    fields: [
      defineField({ name: 'yearsExperience', title: 'Роки досвіду', type: 'number', validation: (Rule) => Rule.integer().positive().max(100) }),
      defineField({ name: 'warranty', title: 'Гарантія', type: 'text', rows: 3, validation: (Rule) => Rule.max(600) }),
      defineField({ name: 'minimumOrder', title: 'Мінімальне замовлення', type: 'text', rows: 3, validation: (Rule) => Rule.max(600) }),
      defineField({ name: 'b2bTerms', title: 'B2B-умови', type: 'text', rows: 5, validation: (Rule) => Rule.max(1200) }),
      defineField({ name: 'reservationTerms', title: 'Умови резерву', type: 'text', rows: 5, validation: (Rule) => Rule.max(1200) }),
    ],
  }),
  defineType({
    name: 'hero', title: 'Hero', type: 'document',
    fields: [
      defineField({ name: 'eyebrow', title: 'Надзаголовок', type: 'string', validation: requiredText(120) }),
      defineField({ name: 'heading', title: 'H1', type: 'string', validation: requiredText(140) }),
      defineField({ name: 'description', title: 'Опис', type: 'text', rows: 4, validation: requiredText(600) }),
      defineField({ name: 'primaryCtaLabel', title: 'Основний CTA', type: 'string', validation: requiredText(80) }),
      defineField({ name: 'secondaryCtaLabel', title: 'Другий CTA', type: 'string', validation: requiredText(80) }),
      defineField({ name: 'imageOne', title: 'Фото 1', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
      defineField({ name: 'imageTwo', title: 'Фото 2', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
      defineField({ name: 'imageThree', title: 'Фото 3', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
    ],
  }),
  defineType({
    name: 'trustBar', title: 'Смуга довіри', type: 'document',
    fields: [1, 2, 3, 4].map((number) => defineField({ name: `item${number}`, title: `Пункт ${number}`, type: 'trustItem', validation: (Rule) => Rule.required() })),
  }),
  defineType({
    name: 'productTypes', title: 'Типи гірлянд', type: 'document',
    fields: [
      defineField({ name: 'fringe', title: '1. Бахрома', type: 'productSlot', validation: (Rule) => Rule.required() }),
      defineField({ name: 'stringLight', title: '2. Нитка / стрічка', type: 'productSlot', validation: (Rule) => Rule.required() }),
      defineField({ name: 'curtain', title: '3. Завіса / штора', type: 'productSlot', validation: (Rule) => Rule.required() }),
      defineField({ name: 'retro', title: '4. Ретрогірлянди з лампочками', type: 'productSlot', validation: (Rule) => Rule.required() }),
      defineField({ name: 'contour', title: '5. Контурне світло', type: 'productSlot', validation: (Rule) => Rule.required() }),
      defineField({ name: 'motifs', title: '6. Світлові мотиви', type: 'productSlot', validation: (Rule) => Rule.required() }),
    ],
  }),
  defineType({
    name: 'benefits', title: 'Переваги', type: 'document',
    fields: [1, 2, 3, 4, 5, 6].map((number) => defineField({ name: `item${number}`, title: `Перевага ${number}`, type: 'advantageItem', validation: (Rule) => Rule.required() })),
  }),
  defineType({
    name: 'workProcess', title: 'Як працюємо', type: 'document',
    fields: [1, 2, 3, 4].map((number) => defineField({ name: `step${number}`, title: `Крок ${number}`, type: 'workStep', validation: (Rule) => Rule.required() })),
  }),
  defineType({
    name: 'case', title: 'Кейс', type: 'document',
    fields: [
      defineField({ name: 'title', title: 'Назва', type: 'string', validation: requiredText(160) }),
      defineField({ name: 'city', title: 'Місто', type: 'string', validation: (Rule) => Rule.max(100) }),
      defineField({ name: 'year', title: 'Рік', type: 'number', validation: (Rule) => Rule.integer().min(1900).max(2100) }),
      defineField({ name: 'objectType', title: 'Тип об’єкта', type: 'string', validation: (Rule) => Rule.max(160) }),
      defineField({ name: 'task', title: 'Завдання', type: 'text', rows: 4, validation: (Rule) => Rule.max(1200) }),
      defineField({ name: 'solution', title: 'Рішення', type: 'text', rows: 4, validation: (Rule) => Rule.max(1200) }),
      defineField({ name: 'approximateVolume', title: 'Орієнтовний обсяг', type: 'string', validation: (Rule) => Rule.max(160) }),
      defineField({ name: 'images', title: 'Фото', type: 'array', of: [{ type: 'imageWithAlt' }], validation: (Rule) => Rule.required().min(2).max(4) }),
      defineField({ name: 'displayOrder', title: 'Порядок показу', type: 'number', validation: (Rule) => Rule.required().integer().min(0).max(9999) }),
    ],
    preview: { select: { title: 'title', subtitle: 'city', media: 'images.0.image' } },
  }),
  defineType({
    name: 'priorityDelivery', title: 'Пріоритетна доставка', type: 'document',
    fields: [
      defineField({ name: 'deadline', title: 'Кінцевий термін', type: 'date', options: { dateFormat: 'DD.MM.YYYY' } }),
      defineField({ name: 'title', title: 'Заголовок до дедлайну', type: 'string', validation: requiredText(160) }),
      defineField({ name: 'text', title: 'Текст до дедлайну', type: 'text', rows: 5, validation: requiredText(1200) }),
      defineField({ name: 'ctaLabel', title: 'CTA до дедлайну', type: 'string', validation: requiredText(80) }),
      defineField({ name: 'afterDeadlineTitle', title: 'Заголовок після дедлайну', type: 'string', validation: requiredText(160) }),
      defineField({ name: 'afterDeadlineText', title: 'Текст після дедлайну', type: 'text', rows: 5, validation: requiredText(1200) }),
      defineField({ name: 'afterDeadlineCtaLabel', title: 'CTA після дедлайну', type: 'string', validation: requiredText(80) }),
    ],
  }),
  defineType({
    name: 'faqItem', title: 'Питання FAQ', type: 'document',
    fields: [
      defineField({ name: 'question', title: 'Питання', type: 'string', validation: requiredText(240) }),
      defineField({ name: 'answer', title: 'Відповідь', type: 'text', rows: 5, validation: requiredText(1600) }),
      defineField({ name: 'enabled', title: 'Показувати на сайті', type: 'boolean', initialValue: true }),
      defineField({ name: 'displayOrder', title: 'Порядок показу', type: 'number', validation: (Rule) => Rule.required().integer().min(0).max(9999) }),
    ],
    preview: { select: { title: 'question', subtitle: 'displayOrder' } },
  }),
  defineType({
    name: 'formTexts', title: 'Тексти форм', type: 'document',
    fields: [
      defineField({ name: 'sla', title: 'SLA', type: 'string', validation: requiredText(160) }),
      defineField({ name: 'catalogRequest', title: 'Каталог і прайс', type: 'formScenarioText', validation: (Rule) => Rule.required() }),
      defineField({ name: 'objectEstimate', title: 'Прорахунок об’єкта', type: 'formScenarioText', validation: (Rule) => Rule.required() }),
      defineField({ name: 'priorityDelivery', title: 'Пріоритетна доставка', type: 'formScenarioText', validation: (Rule) => Rule.required() }),
      defineField({ name: 'consentText', title: 'Текст згоди', type: 'text', rows: 3, validation: requiredText(500) }),
      defineField({ name: 'privacyPolicyUrl', title: 'URL політики конфіденційності', type: 'url', validation: requiredUrl }),
    ],
  }),
  defineType({
    name: 'seoSettings', title: 'SEO', type: 'document',
    fields: [
      defineField({ name: 'metaTitle', title: 'Meta title', type: 'string', validation: requiredText(60) }),
      defineField({ name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, validation: requiredText(160) }),
      defineField({ name: 'openGraphImage', title: 'Open Graph зображення', type: 'imageWithAlt' }),
      defineField({ name: 'favicon', title: 'Favicon / бренд-актив', type: 'imageWithAlt' }),
    ],
  }),
  defineType({
    name: 'analyticsSettings', title: 'Аналітика та сповіщення', type: 'document',
    fields: [
      defineField({ name: 'gtmId', title: 'GTM ID', type: 'string', validation: (Rule) => Rule.max(80) }),
      defineField({ name: 'ga4Id', title: 'GA4 ID', type: 'string', validation: (Rule) => Rule.max(80) }),
      defineField({ name: 'metaPixelId', title: 'Meta Pixel ID', type: 'string', validation: (Rule) => Rule.max(80) }),
      defineField({ name: 'managerNotificationEmail', title: 'Email менеджера для сповіщень', type: 'string', validation: (Rule) => Rule.email() }),
      defineField({ name: 'analyticsEnabled', title: 'Увімкнути аналітику', type: 'boolean', initialValue: false }),
    ],
  }),
]
