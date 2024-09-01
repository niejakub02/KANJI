import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './main.scss';
import { App } from './App';
import { Provider } from 'react-redux';
import store from './app/store';
import ThemeProvider from '@contexts/Theme.context';
import CommunityContextProvider from '@contexts/Community.context';
import { CanvasControlProvider } from '@contexts/Canvas.control.context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <CommunityContextProvider>
        <CanvasControlProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </CanvasControlProvider>
      </CommunityContextProvider>
    </ThemeProvider>
  </StrictMode>
);
