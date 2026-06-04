import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, BookOpen, Search } from 'lucide-react'
import { useState } from 'react'
import logo from '@/images/logo.webp'

const categories = [
  {
    type: 'emergencia',
    label: 'Emergências',
    description: 'Procedimentos de emergência e evacuação',
    icon: AlertTriangle,
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    hover: 'hover:border-red-400',
  },
  {
    type: 'tecnico',
    label: 'Dados Técnicos',
    description: 'Fichas técnicas por aeronave',
    icon: BookOpen,
    color: 'text-primary',
    bg: 'bg-secondary',
    border: 'border-border',
    hover: 'hover:border-primary/40',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim().length >= 2) navigate(`/busca?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-5 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-5">
          <img src={logo} alt="Insígnia FAB" className="w-14 h-14 object-contain drop-shadow-md" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-60">2º/2º GT · FAB</p>
            <h1 className="text-xl font-bold leading-tight">Manual de Cabine</h1>
            <p className="text-xs opacity-60 mt-0.5">Consulta de procedimentos</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
          <Input
            placeholder="Buscar procedimento..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 bg-white/95 text-foreground placeholder:text-muted-foreground border-0 shadow-sm"
          />
        </form>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">Categorias</p>

        {categories.map(({ type, label, description, icon: Icon, color, bg, border, hover }) => (
          <button
            key={type}
            onClick={() => navigate(`/categoria/${type}`)}
            className="w-full text-left"
          >
            <Card className={`border ${border} ${hover} transition-all hover:shadow-md`}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className={`${bg} ${color} p-3 rounded-xl shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </main>
    </div>
  )
}
