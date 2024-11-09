import { Request, Response } from 'express';
import axios from 'axios';

export interface Playlist {
  id: string;
  name: string;
  owner:Owner;
  images: { url: string }[]; 
}

export interface Owner {
display_name:string;
}

export const getProfileInfo = async (req: Request, res: Response) => {
  const payload = {
    spotifyToken: req.body.spotifyToken,
  };
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${payload.spotifyToken}`,
      },
    });
    res.status(200).send(response.data);
  } catch (err) {
    console.error('Error fetching profile info:', err);
    res.status(500).send('Error fetching profile info');
  }
};

export const getMyPlaylists = async (req: Request, res: Response) => {
  try {
    const payload = {
      spotifyToken: req.query.spotifyToken,
    };
    const response = await axios.get(
      'https://api.spotify.com/v1/me/playlists',
      {
        headers: {
          Authorization: `Bearer ${payload.spotifyToken}`,
        },
      }
    );
    res.status(200).send(response.data);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).send('Error fetching playlists');
  }
};

export const getPlaylist = async (req: Request, res: Response) => {
  const payload = {
    spotifyToken: req.query.spotifyToken || req.body.spotifyToken,
  };
  console.log('Payload:', payload);
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists`, {
      headers: {
        Authorization: `Bearer ${payload.spotifyToken}`,
      },
    });
    res.status(200).send(response.data);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).send('Error fetching playlists');
  }
};

export const getPlaylists = async (req: Request, res: Response) => {
  const payload = {
    spotifyToken: req.params.spotifyToken,
    playlistId: req.params.playlistId,
  };
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${payload.playlistId}`, {
      headers: {
        Authorization: `Bearer ${payload.spotifyToken}`,
      },
    });
    res.status(200).send(response.data);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).send('Error fetching playlists');
  }
};

export const getPlaylistTracks = async (req: Request, res: Response) => {
  const payload = {
    spotifyToken: req.body.spotifyToken,
    playlistId: req.params.playlistId,
  };
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${payload.playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${payload.spotifyToken}`,
        },
      }
    );
    res.status(200).send(response.data);
  } catch (err) {
    console.error('Error fetching playlist tracks:', err);
    res.status(500).send('Error fetching playlist tracks');
  }
};

export const getFriends = async (req: Request, res: Response) => {
  const payload = {
    spotifyToken: req.body.spotifyToken,
  };
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/following?type=user',
      {
        headers: {
          Authorization: `Bearer ${payload.spotifyToken}`,
        },
      }
    );
    res.status(200).send(response.data);
  } catch (err) {
    console.error('Error fetching friends:', err);
    res.status(500).send('Error fetching friends');
  }
};

export const getUserPlaylists = async (req: Request, res: Response) => {
  const payload = {
    spotifyToken: req.body.spotifyToken,
    username: req.params.username,
  };
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/users/${payload.username}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${payload.spotifyToken}`,
        },
      }
    );
    res.status(200).send(response.data);
  } catch (err) {
    console.error('Error fetching user playlists:', err);
    res.status(500).send('Error fetching user playlists');
  }
};

export const getUserPlaylistTracks = async (req: Request, res: Response) => {
  const payload = {
    spotifyToken: req.body.spotifyToken,
    username: req.params.username,
    playlistId: req.params.playlistId,
  };
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/users/${payload.username}/playlists/${payload.playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${payload.spotifyToken}`,
        },
      }
    );
    res.status(200).send(response.data);
  } catch (err) {
    console.error('Error fetching user playlist tracks:', err);
    res.status(500).send('Error fetching user playlist tracks');
  }
};

export const getArtistInfo = async (req: Request, res: Response) => {
  const payload = {
    spotifyToken: req.body.spotifyToken,
    artistId: req.params.artistId,
  };
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${payload.artistId}`,
      {
        headers: {
          Authorization: `Bearer ${payload.spotifyToken}`,
        },
      }
    );
    res.status(200).send(response.data);
  } catch (err) {
    console.error('Error fetching artist info:', err);
    res.status(500).send('Error fetching artist info');
  }
};