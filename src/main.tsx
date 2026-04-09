import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './grid.css'
// import './theme.css'
// import './common.css'
// import './layout.css'
// import './product-card.css'
// import './book-page.css'
// import './listings.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
