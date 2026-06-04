import { createBrowserRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Article from '@/pages/Article'
import Category from '@/pages/Category'
import Help from '@/pages/Help'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/busca', element: <Search /> },
  { path: '/artigo/:slug', element: <Article /> },
  { path: '/categoria/:type', element: <Category /> },
  { path: '/ajuda', element: <Help /> },
], { basename: import.meta.env.BASE_URL })
