import { useParams, Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getBySlug } from '@/lib/content'
import { ArrowLeft, AlertTriangle, BookOpen } from 'lucide-react'

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

  const Icon = article.category === 'emergencia' ? AlertTriangle : BookOpen

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-4 pt-10 pb-5 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="opacity-80 hover:opacity-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-xs uppercase tracking-wide opacity-70 truncate">
              {article.category === 'emergencia' ? 'Emergência' : 'Dados Técnicos'}
              {article.day ? ` — Dia ${article.day}` : ''}
            </span>
          </div>
        </div>
        <h1 className="text-xl font-bold leading-tight">{article.title}</h1>
        <div className="flex flex-wrap gap-1 mt-2">
          {article.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs opacity-90">{tag}</Badge>
          ))}
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <div
          className="prose prose-sm max-w-none
            prose-headings:font-semibold prose-headings:text-foreground
            prose-h2:text-base prose-h2:mt-6 prose-h2:mb-2 prose-h2:border-b prose-h2:pb-1
            prose-h3:text-sm prose-h3:mt-4 prose-h3:mb-1
            prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground
            prose-li:text-sm prose-li:text-foreground
            prose-strong:font-semibold prose-strong:text-foreground
            prose-table:text-sm prose-table:w-full
            prose-th:text-left prose-th:font-semibold prose-th:bg-muted prose-th:px-3 prose-th:py-2
            prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-border
            prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:bg-muted/50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:text-sm prose-blockquote:not-italic"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        <div className="mt-8 pt-4 border-t">
          <Link to="/">
            <Button variant="outline" className="w-full">Voltar ao início</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
