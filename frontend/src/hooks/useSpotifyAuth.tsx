import {
  createContext,
  useContext,
  useState,
  useEffect,
  FunctionComponent,
  ReactNode,
} from 'react';

interface SpotifyAuthContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextType>({
  token: null,
  setToken: () => {},
});

export const SpotifyAuthProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    // Load the token from localStorage when the component mounts
    return localStorage.getItem('spotify_token');
  });

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      const tokenFragment = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'));
      if (tokenFragment) {
        token = tokenFragment.split('=')[1];
      }

      window.location.hash = '';
      if (token) {
        window.localStorage.setItem('token', token);
      }
    }

    setToken(token);
  }, []);

  return (
    <SpotifyAuthContext.Provider value={{ token, setToken }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};

/*
 * Custom hook to provide access to the auth context
 * Provides the user's token for use in API requests and the ability to set the token
 */
export const useSpotifyAuth = () => {
  const context = useContext(SpotifyAuthContext);
  if (!context) {
    throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
  }
  return context;
};
