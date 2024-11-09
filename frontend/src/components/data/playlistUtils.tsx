import axios from 'axios';
import {PlaylistWidget} from '../../DashboardComponents/PlaylistWidget'

export interface Widget {
  id: string;
  cover: string;
  owner: string;
  title: string;
  component: React.ReactNode;
}

export interface Owner {
  display_name: string;
}

export const fetchPlaylists = async (): Promise<Widget[]> => {
  // calls the getplaylists endpoint to get the playlists from the user's spotify account
  // returns an array of Widgets that the dashboard can use to display the playlists
  try {
    const accessToken = window.localStorage.getItem('spotify_token');

    if (!accessToken) {
      console.error('No access token found');
      return [];
    }

    const response = await axios.get('http://localhost:8000/api/spotify/playlists', {
      params: {
        spotifyToken: accessToken,
      }
    });

    const data = response.data;

    console.log('Playlists:', data);

    const widgetsData: Widget[] = data.items.map((playlist: any) => ({
      id: playlist.id,
      cover: playlist.images?.[0]?.url || '',
      owner: playlist.owner.display_name,
      title: playlist.name,
      component: (
        <PlaylistWidget
          key={playlist.id}
          cover={playlist.images?.[0]?.url || ''}
          owner={playlist.owner.display_name}
          title={playlist.name}
        />
      )
    }));

    return widgetsData;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};