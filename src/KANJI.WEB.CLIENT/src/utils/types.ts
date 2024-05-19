export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type Prediciton = {
  literal: string;
  probability: number;
};

export type User = {
  sub: string;
  email: string;
  givenName?: string;
  surname?: string;
  picture?: string;
};
