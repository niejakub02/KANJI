import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './main.scss';
import { App } from './App';
import { Provider } from 'react-redux';
import store from './app/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
