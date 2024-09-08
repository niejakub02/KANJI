import { useSignInGoogleQuery } from '@app/api';
import { Spin } from 'antd';
import { FC, useEffect } from 'react';

export const GoogleCallbackPage: FC = () => {
  // TODO: redirect if service unavailble or some retry policy
  const code = new URLSearchParams(window.location.search).get('code');
  const { data: tokens, isLoading } = useSignInGoogleQuery(code, {
    skip: !code,
  });

  useEffect(() => {
    if (!isLoading && tokens) {
      localStorage.setItem('access_token', tokens.accessToken);
      localStorage.setItem('refresh_token', tokens.refreshToken);
      window.location.href = 'http://localhost:3000';
    } else {
      console.warn('Something went wrong');
    }
  }, [tokens, isLoading]);

  return (
    <div>
      <Spin />
    </div>
  );
};

export default GoogleCallbackPage;
