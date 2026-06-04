import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

function renderFlowLine(line: string): string {
  const t = line.trim()
  if (!t) return ''
  if (/^\[[^\]]+\]$/.test(t))
    return `<div class="flow-note">${t.slice(1, -1)}</div>`
  if (/^[A-ZÁÉÍÓÚ][A-ZÁÉÍÓÚ\s\d]+:/.test(t)) {
    const colon = t.indexOf(':')
    const label = t.slice(0, colon)
    const rest = t.slice(colon + 1).trim()
    return rest
      ? `<div class="flow-label">${label}: <span class="flow-label-rest">${rest}</span></div>`
      : `<div class="flow-label">${label}</div>`
  }
  if (/^[A-Z0-9]\s*→/.test(t) || t.startsWith('→'))
    return `<div class="flow-sub">${t}</div>`
  if (/^\d+\./.test(t))
    return `<div class="flow-item">${t}</div>`
  return `<div class="flow-text">${t}</div>`
}

function transformFlowDiagrams(html: string): string {
  return html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_, raw) => {
    const text = raw
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
    const phases = text.split(/\n↓\n/)
    const steps = phases.map((phase: string) =>
      `<div class="flow-step">${
        phase.trim().split('\n').map(renderFlowLine).filter(Boolean).join('')
      }</div>`
    )
    return `<div class="flow-diagram">${steps.join('<div class="flow-arrow">↓</div>')}</div>`
  })
}

function transformCallouts(html: string): string {
  return html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, (match, inner) => {
    const m = inner.match(/\[!(info|warning|danger|success|note|tip|caution|important)\][ \t]*/i)
    if (!m) return match
    const t = m[1].toLowerCase()
    const cleaned = inner.replace(m[0], '').trim()
    return `<div class="callout callout-${t}">${cleaned}</div>`
  })
}

export interface Article {
  slug: string
  title: string
  category: 'emergencia' | 'tecnico'
  day?: number
  tags: string[]
  aircraft: string[]
  pdf?: string
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
    pdf: data.pdf as string | undefined,
    content,
    html: transformCallouts(transformFlowDiagrams(md.render(content))),
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

