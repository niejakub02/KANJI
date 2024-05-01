import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './utils';
import { Prediciton, Tokens, User } from '@utils/types';

export const kanjiApi = createApi({
  reducerPath: 'kanjiApi',
  //   keepUnusedDataFor: 5,
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signInGoogle: builder.query<Tokens, string | null>({
      query: (code) => ({
        url: 'auth/sign-in/google',
        method: 'GET',
        params: {
          code,
        },
      }),
    }),
    getUserDetails: builder.query<User, void>({
      query: () => 'auth/user-details',
    }),
    predict: builder.mutation<Prediciton[], number[]>({
      query: (img) => ({
        url: 'inference/predict',
        method: 'POST',
        body: {
          content: img,
        },
      }),
    }),
  }),
});

export const {
  useSignInGoogleQuery,
  useGetUserDetailsQuery,
  usePredictMutation,
} = kanjiApi;
