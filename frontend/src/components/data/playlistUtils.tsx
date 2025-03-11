import React, { ReactElement } from 'react';
import axios from 'axios';
import { PlaylistWidget } from '../pages/DashboardComponents/PlaylistWidget';
import { SpotifyPlaylistResponse } from './PlaylistContext';

export interface Widget {
  id: string;
  cover: string;
  owner: string;
  title: string;
  genres: string[];
  component: ReactElement;
}

export interface WidgetData {
  id: string;
  cover: string;
  owner: Owner;
  title: string;
  genres?: string[];
}

export interface Owner {
  display_name: string;
}

export interface PlaylistData {
  id: string;
  images: Image[];
  owner: Owner;
  name: string;
  tracks: { href: string; total: number };
}

interface Track {
  track: {
    artists: Artist[];
  };
}

interface Playlist {
  items: Track[];
}

interface Image {
  url: string;
}

export interface PlaylistResponse {
  items: PlaylistData[];
}

interface Artist {
  id: string;
  name: string;
  genres: string[];
}

interface ArtistResponse {
  artists: Artist[];
}

export const fetchPlaylists = async (
  accessToken: string
): Promise<WidgetData[]> => {
  try {
    const spotifyUser = await axios.get<{ id: string }>(
      'https://api.spotify.com/v1/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const response = await axios.get<PlaylistResponse>(
      `${process.env.REACT_APP_API_URL}/api/spotify/user/` +
        spotifyUser.data.id +
        '/playlists',
      {
        headers: {
          authorization: `${accessToken}`,
        },
      }
    );

    const data = response.data;

    const widgetsData: WidgetData[] = data.items
      .filter((playlist: PlaylistData) => playlist)
      .map((playlist: PlaylistData) => ({
        id: playlist.id,
        cover: playlist.images[0]?.url || '',
        owner: playlist.owner,
        title: playlist.name,
      }));

    return widgetsData;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};

export const genreCompilation = async (
  playlist: SpotifyPlaylistResponse
): Promise<string[]> => {
  const genres: string[] = [];
  const response = await axios.get<Playlist>(
    `${process.env.REACT_APP_API_URL}/api/spotify/playlists/${playlist.id}`,
    {
      headers: {
        authorization: `${localStorage.getItem('spotify_token')}`,
      },
    }
  );

  const tracks = response.data.items;
  const artists: string[] = tracks.flatMap(
    (track: Track) =>
      track.track?.artists?.map((artist: Artist) => artist.id) || []
  );

  // for each artist, find if they're in our db
  const artistsQueryResponse = await axios.post<{
    unsaved: string[];
    saved: string[];
  }>(`${process.env.REACT_APP_API_URL}/api/artist/status`, { ids: artists });
  const { saved, unsaved } = artistsQueryResponse.data;
  const localArtistResponse = await axios.post<Artist[]>(
    `${process.env.REACT_APP_API_URL}/api/artist/bulkGet`,
    {
      ids: saved,
    }
  );

  // empty array of artists
  const localArtists: Artist[] = localArtistResponse.data;

  let spotifyArtistInfo: ArtistResponse[] = [];
  // Split artist IDs into batches of 50 and make requests
  if (unsaved.length !== 0) {
    const spotifyArtistResponses = await Promise.all(
      Array.from({ length: Math.ceil(unsaved.length / 50) }, (_, i) => {
        const batch = unsaved.slice(i * 50, (i + 1) * 50).join(',');
        return axios.get<ArtistResponse>(
          `${process.env.REACT_APP_API_URL}/api/spotify/artists?ids=${batch}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('spotify_token')}`,
            },
          }
        );
      })
    );
    spotifyArtistInfo = spotifyArtistResponses.flatMap(
      (response) => response.data
    );
  }

  const artistGenres = spotifyArtistInfo.flatMap((artistInfo: ArtistResponse) =>
    artistInfo.artists.flatMap((artist: Artist) => artist.genres)
  );
  const localArtistsGenres = localArtists?.flatMap((artist: Artist) => {
    return artist.genres;
  });

  const allGenres = artistGenres.concat(localArtistsGenres);
  genres.push(...allGenres);
  return genres.flat();
};

export const buildWidgets = async (
  playlists: WidgetData[]
): Promise<Widget[]> => {
  const widgets: Widget[] = playlists.map((playlist: WidgetData) => {
    const topGenres = playlist.genres || [];
    return {
      id: playlist.id,
      cover: playlist.cover,
      owner: 'Jim',
      title: playlist.title,
      genres: topGenres,
      component: (
        <PlaylistWidget
          playlistId={playlist.id}
          cover={playlist.cover}
          owner={'Jim'}
          title={playlist.title}
          genres={topGenres}
        />
      ),
    };
  });
  // console.log('widgets', widgets);
  return widgets;
};

// later it may be beneficial to create a better algorithm for getting the top genres
export const getTopGenres = (genres: string[]): string[] => {
  //console.log('in getTopGenres');
  const genreCount: { [key: string]: number } = {};

  genres.forEach((genre) => {
    genreCount[genre] = (genreCount[genre] || 0) + 1;
  });
  const sortedGenres = Object.keys(genreCount).sort(
    (a, b) => genreCount[b] - genreCount[a]
  );

  // top 3 genres
  return sortedGenres.slice(0, 3);
};

export const returnWidgets = async (): Promise<Widget[]> => {
  const accessToken = window.localStorage.getItem('spotify_token');

  if (!accessToken) {
    console.error('No access token found');
    return [];
  }
  let playlists_with_genres: Widget[] = [];
  const allPlaylistResponses = await fetch(
    `${process.env.REACT_APP_API_URL}/api/playlist`,
    {}
  );
  const allPlaylists = await allPlaylistResponses.json();
  console.log('allPlaylists', allPlaylists);
  playlists_with_genres = await buildWidgets(allPlaylists);

  return playlists_with_genres;
};
