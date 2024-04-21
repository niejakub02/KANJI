import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { MainView } from '@components/MainView';
import './main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainView />
  </StrictMode>
);
