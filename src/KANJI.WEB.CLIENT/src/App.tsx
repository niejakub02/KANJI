import { FC } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { GoogleCallbackPage, HomePage } from './pages';
import { GuardedRoute } from '@components/GuardedRoute';
import { useAuthorization } from './hooks/useAuthorization';
import './components/MainView/MainView.scss';
import { Spin } from 'antd';

export const App: FC<unknown> = () => {
  const { isLoading } = useAuthorization();

  return isLoading ? (
    <Spin />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route
          path="/xxx"
          element={
            <GuardedRoute>
              <div>
                <div>test</div>
                <Link to="/">back</Link>
              </div>
            </GuardedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
