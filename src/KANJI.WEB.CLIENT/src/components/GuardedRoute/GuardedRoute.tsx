import { useGetUserDetailsQuery } from '@app/api';
import { useAppDispatch } from '@app/store';
import { useThemeContext } from '@contexts/Theme.context';
import { signOut } from '@features/auth/auth.slice';
import {
  isAccessTokenAvailable,
  isRefreshTokenAvailable,
} from '@utils/authUtils';
import { FC, ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

type GuardedRouteProps = {
  children: ReactNode;
};

const GuardedRoute: FC<GuardedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { messageApi } = useThemeContext();
  const {
    data: userDetails,
    isLoading,
    isError,
    refetch,
  } = useGetUserDetailsQuery(undefined, {
    // this have to be keep in sync with access token expiration time,
    // so we check user identity, if he doesnt make any actions on
    // the app, but routes over different tabs
    refetchOnMountOrArgChange: 30,
  });

  useEffect(() => {
    if (!isRefreshTokenAvailable()) {
      // sign out if refresh token not in the storage
      messageApi?.warning('Refresh token expired or is invalid.');
      dispatch(signOut());
      navigate('/');
    }
    if (!isAccessTokenAvailable()) {
      // refetch if access token not in the storage
      refetch();
    }
    if (isError) {
      messageApi?.warning('Refresh token expired or is invalid.');
    }
  }, [dispatch, navigate, isError, messageApi, refetch]);

  // TODO: replace with some backdrop loader
  if (isLoading) return <div>loading...</div>;

  // if
  if (!userDetails) return <Navigate to="/" />;

  return children;
};

export default GuardedRoute;
