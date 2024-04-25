import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './main.scss';
import { Router } from './Router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
