import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

const items = [
  { to: '/',      label: 'Início', icon: Home   },
  { to: '/busca', label: 'Busca',  icon: Search },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border">
      <div className="flex max-w-7xl mx-auto">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
          return (
            <Button
              key={to}
              variant="ghost"
              asChild
              className={`flex-1 h-14 flex-col gap-0.5 rounded-none text-xs font-medium transition-colors ${
                active
                  ? 'text-primary hover:text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <Link to={to}>
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {label}
              </Link>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
