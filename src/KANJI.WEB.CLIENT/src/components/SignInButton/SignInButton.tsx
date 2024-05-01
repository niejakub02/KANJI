import { useAppDispatch, useAppSelector } from '@app/store';
import { signOut } from '@features/auth/auth.slice';
import { FC } from 'react';

const SignInButton: FC<unknown> = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const onSignIn = () => {
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

  const onSignOut = () => dispatch(signOut());

  return !user ? (
    <button onClick={onSignIn}>Sign in</button>
  ) : (
    <button onClick={onSignOut}>Sign out</button>
  );
};

export default SignInButton;
