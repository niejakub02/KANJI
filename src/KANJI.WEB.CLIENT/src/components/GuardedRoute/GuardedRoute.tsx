import { useUserDetailsQuery } from '@app/api';
import { useThemeContext } from '@contexts/Theme.context';
import {
  isAccessTokenAvailable,
  isRefreshTokenAvailable,
} from '@utils/authUtils';
import { FC, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@hooks/useUser';

const GuardedRoute: FC = () => {
  const { signOut } = useUser();
  const { messageApi } = useThemeContext();
  const {
    data: userDetails,
    isLoading,
    isError,
    refetch,
  } = useUserDetailsQuery(undefined, {
    // this have to be keep in sync with access token expiration time,
    // so we check user identity, if he doesnt make any actions on
    // the app, but routes over different tabs
    refetchOnMountOrArgChange: 30,
  });

  useEffect(() => {
    if (!isRefreshTokenAvailable()) {
      // sign out if refresh token not in the storage
      messageApi?.warning('Refresh token expired or is invalid.');
      signOut();
    }
    if (!isAccessTokenAvailable()) {
      // refetch if access token not in the storage
      refetch();
    }
    if (isError) {
      messageApi?.warning('Refresh token expired or is invalid.');
    }
  }, [signOut, isError, messageApi, refetch]);

  // TODO: replace with some backdrop loader
  if (isLoading) return <div>loading...</div>;

  // if
  if (!userDetails) return <Navigate to="/" />;

  return <Outlet />;
};

export default GuardedRoute;
