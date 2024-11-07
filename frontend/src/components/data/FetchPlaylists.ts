export interface Playlist {
    id: string;
    name: string;
    owner:Owner;
    images: { url: string }[]; // Adjust as needed based on the Spotify API response
    genres?: string[]; // Adjust if genres are available or if you need other properties
}

export interface Owner {
  display_name:string;
}

export const fetchPlaylists = async (): Promise<Playlist[] | null> => {
    const accessToken = window.localStorage.getItem('spotify_token');
    
    if (!accessToken) {
      console.error('No access token found');
      return null;
    }
  
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
  
      const data = await response.json();
      console.log('User Playlists:', data);
      return data.items; // Return the list of playlists
    } catch (error) {
      console.error('Error fetching playlists', error);
      return null;
    }
  };