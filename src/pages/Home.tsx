import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, AlertTriangle, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { articles, allTags, allCategories, categoryNames } from '@/lib/content'
import AppHeader from '@/components/AppHeader'

const PAGE_SIZE = 12

const categoryMeta: Record<string, { icon: typeof AlertTriangle; color: string; accent: string; pill: string }> = {
  emergencia: { icon: AlertTriangle, color: 'text-red-600 dark:text-red-400',  accent: 'border-l-red-400',    pill: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400'   },
  tecnico:    { icon: BookOpen,      color: 'text-primary',                    accent: 'border-l-primary/40', pill: 'bg-primary/8 text-primary' },
}

function FilterPill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card text-muted-foreground border-border hover:border-primary/40'
      }`}
    >
      {children}
    </button>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = articles
    if (activeCategory) list = list.filter(a => a.category === activeCategory)
    if (activeTag) list = list.filter(a => a.tags.includes(activeTag))
    if (query.trim().length >= 2) {
      const q = query.trim().toLowerCase()
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [activeCategory, activeTag, query])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetPage() { setPage(1) }

  function selectCategory(cat: string) {
    setActiveCategory(prev => prev === cat ? null : cat)
    setActiveTag(null)
    resetPage()
  }

  function selectTag(tag: string) {
    setActiveTag(prev => prev === tag ? null : tag)
    resetPage()
  }

  function clearAll() {
    setActiveCategory(null)
    setActiveTag(null)
    resetPage()
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim().length >= 2) navigate(`/busca?q=${encodeURIComponent(query.trim())}`)
  }

  const hasFilter = activeCategory !== null || activeTag !== null

  return (
    <div className="min-h-screen bg-background ">
      <AppHeader>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
          <Input
            placeholder="Buscar procedimento..."
            value={query}
            onChange={e => { setQuery(e.target.value); resetPage() }}
            className="pl-9 bg-card/95 text-foreground placeholder:text-muted-foreground border-0 shadow-sm"
          />
        </form>
      </AppHeader>

      {/* Filtros */}
      <div className="border-b border-border bg-primary/5">
        <div className="max-w-7xl mx-auto px-4">

          {/* Linha 1: categorias */}
          <div className="flex items-center gap-2 pt-3 pb-2">
            <span className="text-xs text-muted-foreground font-medium shrink-0">Categoria</span>
            <div className="w-px h-4 bg-border shrink-0" />
            <div className="flex gap-2">
              <FilterPill active={activeCategory === null && !hasFilter} onClick={clearAll}>
                Todas
              </FilterPill>
              {allCategories.map(cat => {
                const meta = categoryMeta[cat] ?? categoryMeta.tecnico
                const Icon = meta.icon
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => selectCategory(cat)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border transition-all ${
                      isActive
                        ? `${meta.pill} border-transparent`
                        : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                    }`}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    {categoryNames[cat] ?? cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Linha 2: tags (roláveis) */}
          <div className="flex items-center gap-2 pb-3">
            <span className="text-xs text-muted-foreground font-medium shrink-0">Tags</span>
            <div className="w-px h-4 bg-border shrink-0" />
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {allTags.map(tag => (
                <FilterPill key={tag} active={activeTag === tag} onClick={() => selectTag(tag)}>
                  {tag}
                </FilterPill>
              ))}
            </div>
          </div>

        </div>
      </div>

      <main className="px-4 py-5 max-w-7xl mx-auto">
        <p className="text-xs text-muted-foreground mb-4">
          {filtered.length} procedimento{filtered.length !== 1 ? 's' : ''}
          {activeCategory ? ` em ${categoryNames[activeCategory] ?? activeCategory}` : ''}
          {activeTag ? ` · tag "${activeTag}"` : ''}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {paginated.map(article => {
            const meta = categoryMeta[article.category] ?? categoryMeta.tecnico
            const Icon = meta.icon
            return (
              <Link key={article.slug} to={`/artigo/${article.slug}`}>
                <Card className={`h-full border-l-4 ${meta.accent} hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group`}>
                  <CardContent className="p-4 flex flex-col gap-3 h-full">
                    <div className={`flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${meta.pill}`}>
                      <Icon className="w-3 h-3 shrink-0" />
                      {categoryNames[article.category] ?? article.category}
                    </div>
                    <p className="text-sm font-semibold leading-snug flex-1 group-hover:text-primary transition-colors">
                      {article.title}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-[11px] text-muted-foreground">+{article.tags.length - 3}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <Button key={n} variant={n === page ? 'default' : 'outline'} size="sm" onClick={() => setPage(n)} className="w-8">
                {n}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
