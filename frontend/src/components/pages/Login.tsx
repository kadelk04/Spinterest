import { useEffect } from 'react';
import { fetchAuthToken, SpotifyLoginButton } from '../data/SpotifyAuth';

export const Login = () => {
  useEffect(() => {
    const { code } = getInfoFromUrl();
    if (code) {
      window.localStorage.setItem('spotify_token', code);
    }

    if (!code) return;

    fetchAuthToken(code);
  }, []);

  const getInfoFromUrl = () => {
    const code = new URLSearchParams(window.location.search).get('code');
    const state = '0';
    window.history.pushState({}, '', '/login');
    return { code, state };
  };

  return (
    <div>
      <h1>Login</h1>
      <SpotifyLoginButton />
    </div>
  );
};
