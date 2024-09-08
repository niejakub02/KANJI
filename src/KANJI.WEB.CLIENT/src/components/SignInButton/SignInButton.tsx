import { GoogleOutlined } from '@ant-design/icons';
import { useAppSelector } from '@app/store';
import { Button } from 'antd';
import { FC } from 'react';
import { useUser } from '@hooks/useUser';

const SignInButton: FC<unknown> = () => {
  const { signOut } = useUser();
  const user = useAppSelector((state) => state.auth.user);

  const handleSignIn = () => {
    const GOOGLE_AUTHORIZATION_URL =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        scope: 'openid email profile',
        include_granted_scopes: 'true',
        response_type: 'code',
        state: 'state_parameter_passthrough_value',
        redirect_uri: 'http://localhost:3000/auth/google/callback',
        client_id:
          '455731959294-6tu3li93r376nho576k79bu507081hor.apps.googleusercontent.com',
      });
    const a = document.createElement('a');
    a.href = GOOGLE_AUTHORIZATION_URL;
    a.click();
  };

  return !user ? (
    <Button onClick={handleSignIn}>
      <GoogleOutlined />
      Sign in
    </Button>
  ) : (
    <Button onClick={signOut}>Sign out</Button>
  );
};

export default SignInButton;
