import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { emergencias, getTodayEmergency } from '@/lib/content'
import { AlertTriangle, BookOpen, Search } from 'lucide-react'

export default function Home() {
  const today = new Date().getDate()
  const todayArticle = getTodayEmergency()

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-4 pt-10 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-widest opacity-80">2º/2º GT — FAB</span>
        </div>
        <h1 className="text-2xl font-bold">Emergência do Dia</h1>
        <p className="text-sm opacity-70 mt-1">Dia {today}</p>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {todayArticle && (
          <Link to={`/artigo/${todayArticle.slug}`}>
            <Card className="border-2 border-primary shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-xs">Hoje — Dia {today}</Badge>
                </div>
                <CardTitle className="text-xl mt-2">{todayArticle.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-3">
                  {todayArticle.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <Button className="w-full mt-1">Ver procedimento completo</Button>
              </CardContent>
            </Card>
          </Link>
        )}

        <div className="flex gap-3">
          <Link to="/busca" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Search className="w-4 h-4" />
              Busca rápida
            </Button>
          </Link>
          <Link to="/categoria/tecnico" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <BookOpen className="w-4 h-4" />
              Dados técnicos
            </Button>
          </Link>
        </div>

        <Separator />

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Calendário de Emergências
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {emergencias.map(article => (
              <Link key={article.slug} to={`/artigo/${article.slug}`}>
                <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-muted ${article.day === today ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <span className={`text-sm font-bold w-7 text-center ${article.day === today ? 'text-primary' : 'text-muted-foreground'}`}>
                    {String(article.day).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-medium flex-1">{article.title}</span>
                  {article.day === today && <Badge variant="default" className="text-xs">Hoje</Badge>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
