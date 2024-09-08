import { useUserDetailsQuery } from '@app/api';
import { useAppDispatch } from '@app/store';
import { useThemeContext } from '@contexts/Theme.context';
import { useUser } from '@hooks/useUser';
import { isRefreshTokenAvailable } from '@utils/authUtils';
import { Spin } from 'antd';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export const AuthenticationControl = () => {
  const { signIn, signOut, user } = useUser();
  const dispatch = useAppDispatch();
  const {
    data: userDetails,
    isLoading,
    isError,
  } = useUserDetailsQuery(undefined, {
    skip: !isRefreshTokenAvailable(),
  });
  const { messageApi } = useThemeContext();

  useEffect(() => {
    if (!isLoading) {
      if (userDetails) {
        signIn(userDetails);
      } else {
        if (isError) {
          messageApi?.warning('Refresh token expired or is invalid.');
        }
        if (user) {
          signOut();
        }
      }
    }
  }, [
    userDetails,
    isLoading,
    isError,
    messageApi,
    dispatch,
    signIn,
    signOut,
    user,
  ]);

  return isLoading ? <Spin /> : <Outlet />;
};

export default AuthenticationControl;
