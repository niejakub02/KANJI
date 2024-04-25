import { FC } from 'react';

export const SignInPage: FC<unknown> = () => {
  const onClick = () => {
    const GOOGLE_AUTHORIZATION_URL =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        // scope: 'https://www.googleapis.com/auth/drive',
        scope: 'openid email profile',
        include_granted_scopes: 'true',
        // response_type: 'token',
        response_type: 'code',
        state: 'state_parameter_passthrough_value',
        redirect_uri: 'http://localhost:3000/auth/google/callback',
        client_id:
          '455731959294-6tu3li93r376nho576k79bu507081hor.apps.googleusercontent.com',
        access_type: 'offline', // zeby otrzymac refresh token
      });
    const a = document.createElement('a');
    a.href = GOOGLE_AUTHORIZATION_URL;
    a.click();
  };
  return (
    <div>
      <button onClick={onClick}>Sign in</button>
    </div>
  );
};

export default SignInPage;
