import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Tokens } from '@utils/types';
import { signOut } from '@features/auth/auth.slice';

const getAccessToken = () => localStorage.getItem('access_token');

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5059/',
  prepareHeaders: (headers) => {
    const token = getAccessToken();

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const reauthQuery = (refreshToken: string | null) =>
  fetchBaseQuery({
    baseUrl: 'http://localhost:5059/',
    method: 'POST',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
  });

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await reauthQuery(
      localStorage.getItem('refresh_token')
    )('auth/refresh-token', api, extraOptions);

    if (refreshResult.data) {
      //   api.dispatch(tokenReceived(refreshResult.data));
      localStorage.setItem(
        'access_token',
        (refreshResult.data as Tokens).accessToken
      );
      localStorage.setItem(
        'refresh_token',
        (refreshResult.data as Tokens).refreshToken
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(signOut());
    }
  }
  return result;
};
