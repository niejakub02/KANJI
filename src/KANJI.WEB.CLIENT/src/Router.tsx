import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleCallbackPage, HomePage, SignInPage } from './pages';

export const Router: FC<unknown> = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<SignInPage />} />

        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
