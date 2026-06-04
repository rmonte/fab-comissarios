import { useParams, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { emergencias, tecnicos, categoryNames } from '@/lib/content'
import { AlertTriangle, BookOpen, FileText } from 'lucide-react'

const categoryMeta: Record<string, { icon: typeof AlertTriangle; color: string }> = {
  emergencia: { icon: AlertTriangle, color: 'text-red-600' },
  tecnico:    { icon: BookOpen,      color: 'text-primary'  },
}

export default function Category() {
  const { type } = useParams<{ type: string }>()
  const isEmergencia = type === 'emergencia'
  const items = isEmergencia ? emergencias : tecnicos
  const meta = categoryMeta[type ?? ''] ?? categoryMeta.tecnico
  const Icon = meta.icon
  const label = categoryNames[type ?? ''] ?? type ?? ''

  return (
    <div className="min-h-screen bg-background ">
      <header className="bg-primary text-primary-foreground px-4 pt-10 pb-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4 opacity-70" />
            <span className="text-xs font-semibold uppercase tracking-widest opacity-70">{label}</span>
          </div>
          <h1 className="text-xl font-bold">{label}</h1>
          <p className="text-xs opacity-60 mt-1">{items.length} procedimento{items.length !== 1 ? 's' : ''}</p>
        </div>
      </header>

      <main className="px-4 py-5 max-w-3xl mx-auto">
        {items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum conteúdo disponível ainda.</p>
            <p className="text-xs mt-1">Adicione arquivos .md em src/content/{type}/</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(article => (
              <Link key={article.slug} to={`/artigo/${article.slug}`}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className={`mt-0.5 ${meta.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{article.title}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.slice(0, 4).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

    </div>
  )
}
