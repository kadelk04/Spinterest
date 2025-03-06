import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { returnWidgets, Widget } from '../data/playlistUtils';

interface PlaylistContextType {
  playlists: Widget[];
  isLoading: boolean;
  error: string | null;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

export const usePlaylists = (): PlaylistContextType => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<Widget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const widgets = await returnWidgets();
        // widgets.map((widget) => {
        //   axios.put(`${process.env.REACT_APP_API_URL}/api/playlist`, {
        //     spotifyId: widget.id,
        //     cover: widget.cover,
        //     creator: widget.owner,
        //     title: widget.title,
        //   });
        // });
        setPlaylists(widgets);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError('Error fetching playlists');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <PlaylistContext.Provider value={{ playlists, isLoading, error }}>
      {children}
    </PlaylistContext.Provider>
  );
};
