import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silently handle benign Vite HMR WebSocket closure events in preview environment
window.addEventListener('unhandledrejection', (event) => {
  const reasonText = event?.reason?.message || String(event?.reason || '');
  if (
    reasonText.includes('WebSocket') ||
    reasonText.includes('ws') ||
    event?.reason?.stack?.includes('@vite/client')
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
