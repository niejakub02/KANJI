import { FC, useEffect, useRef } from 'react';

export const GoogleCallbackPage: FC<unknown> = () => {
  const isFirstRender = useRef<boolean>(true);
  useEffect(() => {
    if (isFirstRender.current) {
      const code = new URLSearchParams(window.location.search).get('code');
      console.log(code);
      fetch('https://localhost:7012/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
        }),
      }).then((res: any) =>
        res.json().then((data: any) => {
          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
          window.location.href = 'http://localhost:3000';
        })
      );
    }
    isFirstRender.current = false;
  }, []);

  return <div>loading...</div>;
};

export default GoogleCallbackPage;
