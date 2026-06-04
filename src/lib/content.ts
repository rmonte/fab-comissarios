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

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  if (!raw.startsWith('---')) return { data: {}, content: raw }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, content: raw }

  const yaml = raw.slice(4, end).trim()
  const content = raw.slice(end + 4).trim()
  const data: Record<string, unknown> = {}

  for (const line of yaml.split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim()

    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''))
    } else if (!isNaN(Number(value)) && value !== '') {
      data[key] = Number(value)
    } else {
      data[key] = value.replace(/^['"]|['"]$/g, '')
    }
  }

  return { data, content }
}

const modules = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function parseArticle(raw: string, filePath: string): Article {
  const { data, content } = parseFrontmatter(raw)
  const slug = (data.slug as string) ?? filePath.split('/').pop()?.replace('.md', '') ?? ''

  return {
    slug,
    title: (data.title as string) ?? slug,
    category: (data.category as 'emergencia' | 'tecnico') ?? 'emergencia',
    day: data.day as number | undefined,
    tags: (data.tags as string[]) ?? [],
    aircraft: (data.aircraft as string[]) ?? ['todos'],
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

export const allTags: string[] = [
  ...new Set(articles.flatMap(a => a.tags)),
].sort((a, b) => a.localeCompare(b, 'pt-BR'))

export const allCategories: string[] = [
  ...new Set(articles.map(a => a.category)),
].sort((a, b) => a.localeCompare(b, 'pt-BR'))

export const categoryNames: Record<string, string> = {
  emergencia: 'Emergências',
  tecnico: 'Dados Técnicos',
}

