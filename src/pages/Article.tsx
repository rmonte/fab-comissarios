import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getBySlug, articles, categoryNames } from '@/lib/content'
import { ArrowLeft, AlertTriangle, BookOpen, FileText, ChevronsUpDown, ChevronsDownUp } from 'lucide-react'
import AppHeader from '@/components/AppHeader'

const categoryMeta: Record<string, {
  icon: typeof AlertTriangle
  color: string
  accent: string
  pill: string
  headerPill: string
}> = {
  emergencia: { icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', accent: 'border-l-red-400',    pill: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400',    headerPill: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'   },
  tecnico:    { icon: BookOpen,      color: 'text-primary',                  accent: 'border-l-primary/40', pill: 'bg-primary/8 text-primary',                                        headerPill: 'bg-primary/10 text-primary' },
}

interface Section {
  id: string
  heading: string
  body: string
}

function parseSections(html: string): Section[] {
  const parts = html.split(/(?=<h2[\s>])/)
  const sections: Section[] = []

  parts.forEach((part, i) => {
    const match = part.match(/^<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*)$/)
    if (match) {
      sections.push({
        id: `s${i}`,
        heading: match[1].replace(/<[^>]+>/g, '').trim(),
        body: match[2].trim(),
      })
    } else if (part.trim()) {
      sections.push({ id: `s${i}`, heading: '', body: part.trim() })
    }
  })

  return sections
}

const proseClasses = `
  prose prose-sm max-w-none
  prose-headings:text-foreground prose-headings:font-bold
  prose-h3:text-sm prose-h3:mt-5 prose-h3:mb-2 prose-h3:text-primary prose-h3:font-semibold prose-h3:uppercase prose-h3:tracking-wide
  prose-p:text-[15px] prose-p:leading-loose prose-p:text-muted-foreground prose-p:my-3
  prose-li:text-[15px] prose-li:text-muted-foreground prose-li:my-1.5 prose-li:leading-relaxed
  prose-ul:my-3 prose-ul:marker:text-primary/60
  prose-ol:my-3 prose-ol:list-decimal prose-ol:marker:text-primary/60 prose-ol:marker:font-semibold
  prose-strong:font-bold prose-strong:text-foreground
  prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
  prose-table:text-sm prose-table:w-full prose-table:border-collapse prose-table:my-4
  prose-thead:bg-muted/60
  prose-th:text-left prose-th:font-semibold prose-th:px-3 prose-th:py-2 prose-th:text-xs prose-th:uppercase prose-th:tracking-wide prose-th:text-foreground prose-th:border-b-2 prose-th:border-border
  prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-border prose-td:text-muted-foreground
  prose-tr:last:prose-td:border-b-0
  prose-tr:even:bg-muted/30
  prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-amber-400
  prose-blockquote:bg-amber-50 prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:rounded-r-lg
  prose-blockquote:text-[15px] prose-blockquote:text-amber-900 prose-blockquote:my-4
`

export default function Article() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)
  const article = slug ? getBySlug(slug) : undefined

  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (href && href.startsWith('/')) {
        e.preventDefault()
        navigate(href)
      }
    }

    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
  }, [navigate, slug])

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">Procedimento não encontrado.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    )
  }

  const meta = categoryMeta[article.category] ?? categoryMeta.tecnico
  const Icon = meta.icon
  const catLabel = categoryNames[article.category] ?? article.category
  const sections = parseSections(article.html)
  const hasSections = sections.some(s => s.heading)
  const sectionIds = sections.filter(s => s.heading).map(s => s.id)
  const [openValues, setOpenValues] = useState<string[]>([])
  const allOpen = openValues.length === sectionIds.length && sectionIds.length > 0
  const pdfUrl = article.pdf ? `${import.meta.env.BASE_URL}${article.pdf}` : null

  const related = articles
    .filter(a => a.slug !== article.slug && a.category === article.category)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">

      {/* Cabeçalho do sistema */}
      <AppHeader />

      {/* Identidade do artigo */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="flex items-center justify-between mb-4">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${meta.headerPill}`}>
              <Icon className="w-3 h-3 shrink-0" />
              {catLabel}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>

          <h1 className="text-2xl font-bold leading-tight text-foreground mb-4">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-3">
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map(tag => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="ml-auto flex items-center gap-2 shrink-0">
              {hasSections && (
                <button
                  onClick={() => setOpenValues(allOpen ? [] : sectionIds)}
                  aria-label={allOpen ? 'Recolher seções' : 'Expandir seções'}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  {allOpen
                    ? <ChevronsDownUp className="w-4 h-4 text-primary" />
                    : <ChevronsUpDown className="w-4 h-4 text-primary" />
                  }
                </button>
              )}

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver PDF original"
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors shrink-0"
              >
                <FileText className="w-4 h-4 text-primary" />
              </a>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <main ref={contentRef} className="max-w-7xl mx-auto px-4 py-6">
        {hasSections ? (
          <Accordion multiple value={openValues} onValueChange={setOpenValues} className="space-y-2">
            {sections.map(section => (
              section.heading ? (
                <div key={section.id} className="bg-card border border-border border-l-4 border-l-slate-300 rounded-lg overflow-hidden shadow-sm">
                  <AccordionItem value={section.id}>
                    <AccordionTrigger className="text-sm font-semibold text-foreground px-3 hover:no-underline hover:bg-muted/40">
                      {section.heading}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-4">
                      <div
                        className={proseClasses}
                        dangerouslySetInnerHTML={{ __html: section.body }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ) : (
                <div
                  key={section.id}
                  className="bg-card rounded-lg border border-border px-4 py-3 shadow-sm"
                >
                  <div className={proseClasses} dangerouslySetInnerHTML={{ __html: section.body }} />
                </div>
              )
            ))}
          </Accordion>
        ) : (
          <div className="bg-card rounded-lg border border-border px-4 py-5 shadow-sm">
            <div className={proseClasses} dangerouslySetInnerHTML={{ __html: article.html }} />
          </div>
        )}
      </main>

      {/* Artigos relacionados */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <Separator className="mb-5" />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Mais em {catLabel}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map(rel => (
              <Link key={rel.slug} to={`/artigo/${rel.slug}`}>
                <Card className={`h-full border-l-4 ${meta.accent} hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group`}>
                  <CardContent className="p-3 flex flex-col gap-2.5 h-full">
                    <div className={`flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${meta.pill}`}>
                      <Icon className="w-3 h-3 shrink-0" />
                      {catLabel}
                    </div>
                    <p className="text-sm font-semibold leading-snug flex-1 group-hover:text-primary transition-colors">{rel.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {rel.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{tag}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
