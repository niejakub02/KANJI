export const isTokenAvailable = () => !!localStorage.getItem('refresh_token');

export const removeTokensFromStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
