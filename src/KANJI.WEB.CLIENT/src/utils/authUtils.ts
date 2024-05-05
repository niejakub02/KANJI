export const isRefreshTokenAvailable = () =>
  !!localStorage.getItem('refresh_token');

export const isAccessTokenAvailable = () =>
  !!localStorage.getItem('access_token');

export const removeTokensFromStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
