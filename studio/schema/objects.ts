import { defineField, defineType } from 'sanity'

const requiredText = (max: number) => (Rule: any) => Rule.required().min(1).max(max)

export const objectTypes = [
  defineType({
    name: 'imageWithAlt',
    title: 'Зображення з alt-текстом',
    type: 'object',
    fields: [
      defineField({ name: 'image', title: 'Зображення', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
      defineField({ name: 'alt', title: 'Alt-текст', type: 'string', description: 'Коротко й точно опишіть те, що видно на зображенні.', validation: requiredText(160) }),
    ],
  }),
  defineType({
    name: 'trustItem',
    title: 'Пункт смуги довіри',
    type: 'object',
    fields: [
      defineField({ name: 'title', title: 'Заголовок', type: 'string', validation: requiredText(100) }),
      defineField({ name: 'text', title: 'Додатковий текст', type: 'string', validation: (Rule) => Rule.max(180) }),
    ],
  }),
  defineType({
    name: 'productSlot',
    title: 'Тип гірлянд',
    type: 'object',
    fields: [
      defineField({ name: 'title', title: 'Назва', type: 'string', validation: requiredText(100) }),
      defineField({ name: 'description', title: 'Опис', type: 'text', rows: 3, validation: requiredText(300) }),
      defineField({ name: 'image', title: 'Зображення', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
      defineField({ name: 'parameters', title: 'Параметри', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.required().min(2).max(3) }),
      defineField({ name: 'ctaLabel', title: 'Текст CTA', type: 'string', validation: requiredText(80) }),
    ],
  }),
  defineType({
    name: 'advantageItem',
    title: 'Перевага',
    type: 'object',
    fields: [
      defineField({ name: 'title', title: 'Заголовок', type: 'string', validation: requiredText(120) }),
      defineField({ name: 'description', title: 'Опис', type: 'text', rows: 3, validation: requiredText(300) }),
    ],
  }),
  defineType({
    name: 'workStep',
    title: 'Крок',
    type: 'object',
    fields: [
      defineField({ name: 'title', title: 'Заголовок', type: 'string', validation: requiredText(100) }),
      defineField({ name: 'description', title: 'Опис', type: 'text', rows: 3, validation: requiredText(300) }),
    ],
  }),
  defineType({
    name: 'formScenarioText',
    title: 'Тексти сценарію форми',
    type: 'object',
    fields: [
      defineField({ name: 'title', title: 'Заголовок форми', type: 'string', validation: requiredText(140) }),
      defineField({ name: 'ctaLabel', title: 'Текст CTA', type: 'string', validation: requiredText(80) }),
      defineField({ name: 'thankYouText', title: 'Текст подяки', type: 'text', rows: 4, validation: requiredText(400) }),
    ],
  }),
]
