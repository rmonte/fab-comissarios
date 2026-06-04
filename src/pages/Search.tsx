import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Fuse from 'fuse.js'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { articles, categoryNames } from '@/lib/content'
import { Search as SearchIcon, AlertTriangle, BookOpen } from 'lucide-react'
import AppHeader from '@/components/AppHeader'

const fuse = new Fuse(articles, {
  keys: ['title', 'tags', 'content'],
  threshold: 0.35,
  ignoreLocation: true,
})

const categoryMeta: Record<string, { icon: typeof AlertTriangle; color: string }> = {
  emergencia: { icon: AlertTriangle, color: 'text-red-600' },
  tecnico:    { icon: BookOpen,      color: 'text-primary'  },
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setQuery(q)
  }, [searchParams])

  const results = useMemo(() => {
    if (query.trim().length < 2) return articles
    return fuse.search(query).map(r => r.item)
  }, [query])

  const grouped = useMemo(() => {
    const map: Record<string, typeof articles> = {}
    for (const a of results) {
      if (!map[a.category]) map[a.category] = []
      map[a.category].push(a)
    }
    return map
  }, [results])

  return (
    <div className="min-h-screen bg-background ">
      <AppHeader>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
          <Input
            autoFocus
            placeholder="Buscar procedimento, equipamento, tag..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 bg-white/95 text-foreground placeholder:text-muted-foreground border-0 shadow-sm"
          />
        </div>
      </AppHeader>

      <main className="max-w-7xl mx-auto px-4 py-5">
        <p className="text-xs text-muted-foreground mb-5">
          {query.trim().length >= 2
            ? `${results.length} resultado${results.length !== 1 ? 's' : ''} para "${query}"`
            : `${results.length} procedimentos`}
        </p>

        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items], gi) => {
            const meta = categoryMeta[category] ?? categoryMeta.tecnico
            const Icon = meta.icon
            const label = categoryNames[category] ?? category

            return (
              <div key={category}>
                {gi > 0 && <Separator className="mb-6" />}
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wide ${meta.color}`}>
                    {label}
                  </span>
                  <Badge variant="secondary" className="text-xs ml-auto">{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.map(article => (
                    <Link key={article.slug} to={`/artigo/${article.slug}`}>
                      <Card className="hover:shadow-md hover:border-primary/30 transition-all">
                        <CardContent className="p-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{article.title}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {article.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </main>

    </div>
  )
}
