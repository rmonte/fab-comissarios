import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import logo from '@/images/logo.webp'
import { useTheme } from '@/lib/theme'

interface AppHeaderProps {
  children?: React.ReactNode
  action?: React.ReactNode
}

export default function AppHeader({ children, action }: AppHeaderProps) {
  const { theme, toggle } = useTheme()

  return (
    <header className="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 pt-5 pb-5">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <img
              src={logo}
              alt="Insígnia FAB"
              className="w-11 h-11 object-contain drop-shadow-md transition-opacity group-hover:opacity-80"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-60">2º/2º GT · FAB</p>
              <p className="text-lg font-bold leading-tight">Manual de Cabine</p>
              <p className="text-xs opacity-60">Consulta de procedimentos</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            {action}
            <button
              onClick={toggle}
              aria-label="Alternar tema"
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {children}
      </div>
    </header>
  )
}
