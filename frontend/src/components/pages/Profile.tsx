import { FunctionComponent, useState, useEffect } from 'react';
import { getRefreshedToken } from '../data/SpotifyAuth';

interface SpotifyProfile {
  display_name: string;
  images: { url: string }[];
}

export const Profile: FunctionComponent = () => {
  const accessToken = window.localStorage.getItem('spotify_token');
  const refreshToken = window.localStorage.getItem('spotify_refresh_token');
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken && !refreshToken) return;

      try {
        let response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401 && refreshToken) {
          // Token expired, refresh it
          await getRefreshedToken(refreshToken);
          // Retry fetching the profile with the new token
          response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('spotify_token')}`,
            },
          });
        }

        const data = await response.json();
        if (data.error) {
          console.log(data)
          console.error(data.error.message);
          return;
        }

        const profileData: SpotifyProfile = {
          display_name: data.display_name,
          images: data.images || [],
        };
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };

    fetchProfile();
  }, [accessToken, refreshToken]);

  return (
    <div>
      <h1>Profile</h1>
      {profile ? (
        <>
          <h1>{profile.display_name}</h1>
          {profile.images.length > 0 ? (
            <img src={profile.images[0].url} alt={profile.display_name} />
          ) : null}
        </>
      ) : (
        <p>Not Logged In</p>
      )}
    </div>
  );
};
