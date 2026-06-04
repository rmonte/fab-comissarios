import { useParams, Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
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
import { ArrowLeft, AlertTriangle, BookOpen } from 'lucide-react'
import logo from '@/images/logo.webp'

const categoryMeta: Record<string, { icon: typeof AlertTriangle; color: string; strip: string }> = {
  emergencia: { icon: AlertTriangle, color: 'text-red-600', strip: 'bg-red-500' },
  tecnico:    { icon: BookOpen,      color: 'text-primary', strip: 'bg-primary/60' },
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
  prose-headings:text-foreground prose-headings:font-semibold
  prose-h3:text-sm prose-h3:mt-4 prose-h3:mb-2 prose-h3:text-primary
  prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground prose-p:my-2
  prose-li:text-sm prose-li:text-foreground prose-li:my-1
  prose-ul:my-3 prose-ol:my-3 prose-ol:list-decimal
  prose-strong:font-semibold prose-strong:text-foreground
  prose-table:text-sm prose-table:w-full prose-table:border-collapse
  prose-thead:bg-primary prose-thead:text-primary-foreground
  prose-th:text-left prose-th:font-semibold prose-th:px-3 prose-th:py-2 prose-th:text-xs prose-th:uppercase prose-th:tracking-wide
  prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-border
  prose-tr:even:bg-muted/40
  prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-amber-400
  prose-blockquote:bg-amber-50 prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:rounded-r-lg
  prose-blockquote:text-sm prose-blockquote:text-amber-900 prose-blockquote:my-4
`

export default function Article() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const article = slug ? getBySlug(slug) : undefined

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
  const allIds = sections.filter(s => s.heading).map(s => s.id)

  const related = articles
    .filter(a => a.slug !== article.slug && a.category === article.category)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background ">

      {/* Header — igual à Home mas sem busca */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-5">

          {/* Logo + sistema */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Insígnia FAB" className="w-11 h-11 object-contain drop-shadow-md" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest opacity-60">2º/2º GT · FAB</p>
                <p className="text-sm font-bold leading-tight">Manual de Cabine</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>

          <Separator className="bg-white/10 mb-4" />

          {/* Categoria */}
          <div className="flex items-center gap-1.5 mb-2">
            <Icon className="w-3.5 h-3.5 opacity-70" />
            <span className="text-xs font-semibold uppercase tracking-widest opacity-70">{catLabel}</span>
          </div>

          {/* Título do artigo */}
          <h1 className="text-xl font-bold leading-tight mb-3">{article.title}</h1>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-white/15 text-white border-0 hover:bg-white/25">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Faixa de categoria */}
        <div className={`h-1 ${meta.strip}`} />
      </header>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {hasSections ? (
          <Accordion type="multiple" defaultValue={allIds} className="space-y-1">
            {sections.map(section => (
              section.heading ? (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border border-border rounded-lg px-1 overflow-hidden"
                >
                  <AccordionTrigger className="text-sm font-semibold text-foreground px-3 hover:no-underline hover:bg-muted/50 rounded-lg">
                    {section.heading}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-4">
                    <div
                      className={proseClasses}
                      dangerouslySetInnerHTML={{ __html: section.body }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div key={section.id} className={proseClasses} dangerouslySetInnerHTML={{ __html: section.body }} />
              )
            ))}
          </Accordion>
        ) : (
          <div className={proseClasses} dangerouslySetInnerHTML={{ __html: article.html }} />
        )}
      </main>

      {/* Artigos relacionados */}
      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-6">
          <Separator className="mb-5" />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Mais em {catLabel}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {related.map(rel => (
              <Link key={rel.slug} to={`/artigo/${rel.slug}`}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all h-full">
                  <CardContent className="p-3 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3 h-3 shrink-0 ${meta.color}`} />
                      <span className={`text-xs font-medium ${meta.color}`}>{catLabel}</span>
                    </div>
                    <p className="text-sm font-semibold leading-snug">{rel.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rel.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">{tag}</Badge>
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
