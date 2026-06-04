import { useParams, Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getBySlug, articles, categoryNames } from '@/lib/content'
import { ArrowLeft, AlertTriangle, BookOpen, ChevronRight } from 'lucide-react'
import logo from '@/images/logo.webp'

const categoryMeta: Record<string, { icon: typeof AlertTriangle; color: string; accent: string; bg: string }> = {
  emergencia: { icon: AlertTriangle, color: 'text-red-600',  accent: 'border-red-500',  bg: 'bg-red-50'   },
  tecnico:    { icon: BookOpen,      color: 'text-primary',  accent: 'border-primary',  bg: 'bg-primary/5' },
}

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

  const related = articles
    .filter(a => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">

      {/* Header principal */}
      <header className="bg-primary text-primary-foreground">
        {/* Barra de navegação */}
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm opacity-75 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <img src={logo} alt="Insígnia FAB" className="w-8 h-8 object-contain opacity-80" />
          </div>

          {/* Breadcrumb de categoria */}
          <div className="flex items-center gap-1.5 mb-3">
            <Icon className="w-3.5 h-3.5 opacity-70" />
            <span className="text-xs font-semibold uppercase tracking-widest opacity-70">{catLabel}</span>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold leading-tight mb-4">{article.title}</h1>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/15 text-white/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Faixa colorida de categoria */}
        <div className={`h-1 ${article.category === 'emergencia' ? 'bg-red-500' : 'bg-blue-400'}`} />
      </header>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div
          className="
            prose prose-sm max-w-none

            prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight

            prose-h2:text-base prose-h2:mt-8 prose-h2:mb-3
            prose-h2:pb-2 prose-h2:border-b prose-h2:border-border

            prose-h3:text-sm prose-h3:mt-5 prose-h3:mb-2 prose-h3:text-primary

            prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground prose-p:my-2

            prose-li:text-sm prose-li:text-foreground prose-li:my-1
            prose-ul:my-3 prose-ol:my-3
            prose-ol:list-decimal

            prose-strong:font-semibold prose-strong:text-foreground

            prose-table:text-sm prose-table:w-full prose-table:border-collapse
            prose-thead:bg-primary prose-thead:text-primary-foreground
            prose-th:text-left prose-th:font-semibold prose-th:px-3 prose-th:py-2 prose-th:text-xs prose-th:uppercase prose-th:tracking-wide
            prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-border prose-td:text-sm
            prose-tr:even:bg-muted/40

            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-amber-400
            prose-blockquote:bg-amber-50 prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:rounded-r-lg
            prose-blockquote:text-sm prose-blockquote:text-amber-900
            prose-blockquote:my-4

            prose-code:text-xs prose-code:bg-muted prose-code:px-1 prose-code:rounded
          "
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      </main>

      {/* Rodapé */}
      <footer className="max-w-3xl mx-auto px-4 pb-10">

        {/* Artigos relacionados */}
        {related.length > 0 && (
          <div className="mt-2 pt-6 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Outros procedimentos em {catLabel}
            </p>
            <div className="space-y-2">
              {related.map(rel => (
                <Link key={rel.slug} to={`/artigo/${rel.slug}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${meta.color}`} />
                      <span className="text-sm font-medium truncate">{rel.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Botão voltar */}
        <div className="mt-6">
          <Link to="/">
            <Button variant="outline" className="w-full">Voltar ao início</Button>
          </Link>
        </div>
      </footer>

    </div>
  )
}
