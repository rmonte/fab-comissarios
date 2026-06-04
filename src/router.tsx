import { createBrowserRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Article from '@/pages/Article'
import Category from '@/pages/Category'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/busca', element: <Search /> },
  { path: '/artigo/:slug', element: <Article /> },
  { path: '/categoria/:type', element: <Category /> },
], { basename: import.meta.env.BASE_URL })
