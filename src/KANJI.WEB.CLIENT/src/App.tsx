import { FC, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleCallbackPage, HomePage } from './pages';
import CommunityContextProvider from './contexts/Community.context';
import { useGetUserDetailsQuery } from './app/api';
import { useAppDispatch } from './app/store';
import { signIn, signOut } from './features/auth/auth.slice';
import { isTokenAvailable } from '@utils/authUtils';

export const App: FC<unknown> = () => {
  const dispatch = useAppDispatch();
  const { data: userDetails, isLoading } = useGetUserDetailsQuery(undefined, {
    skip: !isTokenAvailable(),
  });

  useEffect(() => {
    if (!isLoading) {
      if (userDetails) {
        dispatch(signIn(userDetails));
      } else {
        dispatch(signOut());
      }
    }
  }, [userDetails, isLoading, dispatch]);

  return (
    <CommunityContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />
        </Routes>
      </BrowserRouter>
    </CommunityContextProvider>
  );
};

export default App;
