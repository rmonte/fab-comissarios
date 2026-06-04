import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Fuse from 'fuse.js'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { articles } from '@/lib/content'
import { Search as SearchIcon, ArrowLeft } from 'lucide-react'

const fuse = new Fuse(articles, {
  keys: ['title', 'tags', 'content'],
  threshold: 0.35,
  ignoreLocation: true,
})

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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-4 pt-10 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <Link to="/" className="opacity-80 hover:opacity-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Busca</h1>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Buscar procedimento, equipamento, tag..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 bg-white text-foreground"
          />
        </div>
      </header>

      <main className="px-4 py-4 max-w-2xl mx-auto">
        <p className="text-xs text-muted-foreground mb-3">
          {query.trim().length >= 2
            ? `${results.length} resultado${results.length !== 1 ? 's' : ''} para "${query}"`
            : `${results.length} procedimentos`}
        </p>
        <div className="space-y-2">
          {results.map(article => (
            <Link key={article.slug} to={`/artigo/${article.slug}`}>
              <div className="p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{article.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {article.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant={article.category === 'emergencia' ? 'destructive' : 'outline'} className="text-xs shrink-0">
                    {article.category === 'emergencia' ? 'Emerg.' : 'Técnico'}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
