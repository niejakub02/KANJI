import { useGetUserDetailsQuery } from '@app/api';
import { useAppDispatch } from '@app/store';
import { useThemeContext } from '@contexts/Theme.context';
import { signIn, signOut } from '@features/auth/auth.slice';
import { isRefreshTokenAvailable } from '@utils/authUtils';
// import { message } from 'antd';
import { useEffect } from 'react';

export const useAuthorization = () => {
  const dispatch = useAppDispatch();
  const {
    data: userDetails,
    isLoading,
    isError,
    status,
  } = useGetUserDetailsQuery(undefined, {
    skip: !isRefreshTokenAvailable(),
  });
  const { messageApi } = useThemeContext();

  useEffect(() => {
    if (!isLoading) {
      if (userDetails) {
        dispatch(signIn(userDetails));
      } else {
        if (isError) {
          messageApi?.warning('Refresh token expired or is invalid.');
        }
        dispatch(signOut());
      }
    }
  }, [userDetails, isLoading, isError, messageApi, status, dispatch]);

  return { userDetails, isLoading };
};
