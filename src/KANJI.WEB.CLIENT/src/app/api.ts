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
    userDetails: builder.query<User, void>({
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

    // same origin query for asset
    supportedKanjiList: builder.query<string[], void>({
      query: () => `${window.location.origin}/model_3_8.json`,
      transformResponse: (response: Record<number, string>) =>
        Object.values(response),
    }),
  }),
});

export const {
  useSignInGoogleQuery,
  useUserDetailsQuery,
  usePredictMutation,
  useSupportedKanjiListQuery,
} = kanjiApi;
