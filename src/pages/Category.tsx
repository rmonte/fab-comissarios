import { useParams, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { emergencias, tecnicos } from '@/lib/content'
import { ArrowLeft, AlertTriangle, BookOpen, FileText } from 'lucide-react'

export default function Category() {
  const { type } = useParams<{ type: string }>()
  const isEmergencia = type === 'emergencia'

  const items = isEmergencia ? emergencias : tecnicos
  const Icon = isEmergencia ? AlertTriangle : BookOpen
  const label = isEmergencia ? 'Emergências' : 'Dados Técnicos'

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-4 pt-10 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/" className="opacity-80 hover:opacity-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <h1 className="text-xl font-bold">{label}</h1>
        </div>
        <p className="text-sm opacity-70 mt-1">{items.length} procedimento{items.length !== 1 ? 's' : ''}</p>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum conteúdo disponível ainda.</p>
            <p className="text-xs mt-1">Adicione arquivos .md em src/content/{type}/</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(article => (
              <Link key={article.slug} to={`/artigo/${article.slug}`}>
                <div className="p-4 rounded-lg border border-border hover:bg-muted transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {article.day && (
                        <span className="text-xs text-muted-foreground font-mono">Dia {String(article.day).padStart(2, '0')} · </span>
                      )}
                      <p className="text-sm font-medium">{article.title}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.slice(0, 4).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link to="/">
            <Button variant="outline" className="w-full">Voltar ao início</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
