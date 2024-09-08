import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleCallbackPage, HomePage } from './pages';
import { GuardedRoute } from '@components/GuardedRoute';
import './components/MainView/MainView.scss';
import DrawSubpage from '@pages/Home/Draw.subpage';
import { CommunitySubpage } from '@pages/Home/Community.subpage';
import AuthenticationControl from '@features/auth/AuthenticationControl/AuthenticationControl';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthenticationControl />}>
          <Route path="" element={<HomePage />}>
            <Route element={<GuardedRoute />}>
              <Route path="draw" element={<DrawSubpage />} />
              <Route path="community" element={<CommunitySubpage />} />
              <Route path="*" element={<h2>Some sub page</h2>} />
            </Route>
          </Route>
          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
