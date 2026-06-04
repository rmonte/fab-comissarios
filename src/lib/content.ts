import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

export interface Article {
  slug: string
  title: string
  category: 'emergencia' | 'tecnico'
  day?: number
  tags: string[]
  aircraft: string[]
  content: string
  html: string
}

const modules = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function parseArticle(raw: string, filePath: string): Article {
  const { data, content } = matter(raw)
  const slug = data.slug ?? filePath.split('/').pop()?.replace('.md', '') ?? ''

  return {
    slug,
    title: data.title ?? slug,
    category: data.category ?? 'emergencia',
    day: data.day,
    tags: data.tags ?? [],
    aircraft: data.aircraft ?? ['todos'],
    content,
    html: md.render(content),
  }
}

export const articles: Article[] = Object.entries(modules)
  .filter(([path]) => !path.endsWith('README.md'))
  .map(([path, raw]) => parseArticle(raw, path))
  .sort((a, b) => {
    if (a.day !== undefined && b.day !== undefined) return a.day - b.day
    return a.title.localeCompare(b.title, 'pt-BR')
  })

export const emergencias = articles.filter(a => a.category === 'emergencia')
export const tecnicos = articles.filter(a => a.category === 'tecnico')

export function getBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function getByDay(day: number): Article | undefined {
  return emergencias.find(a => a.day === day)
}

export function getTodayEmergency(): Article | undefined {
  const day = new Date().getDate()
  return getByDay(day) ?? getByDay(((day - 1) % 10) + 1)
}
