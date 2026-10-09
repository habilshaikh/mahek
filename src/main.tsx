import { MotionConfig } from 'framer-motion';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ShopProvider } from './store/ShopContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ShopProvider>
          <App />
        </ShopProvider>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
);
