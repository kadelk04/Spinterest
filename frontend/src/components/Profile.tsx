import { FunctionComponent, useState, useEffect } from 'react';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';

interface SpotifyProfile {
  display_name: string;
  small_image: string;
  large_image: string;
}

export const Profile: FunctionComponent = () => {
  const { token } = useSpotifyAuth();
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);

  useEffect(() => {
    if (token) {
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error.message);
            return;
          }
          const profile: SpotifyProfile = {
            display_name: data.display_name,
            small_image: data.images?.[0].url,
            large_image: data.images?.[1].url,
          };
          setProfile(profile);
        });
    }
  }, [token]);

  return (
    <div>
      {profile ? (
        <div>
          <h1>{profile.display_name}</h1>
          <img src={profile.small_image} alt="Profile Pic🤪" />
        </div>
      ) : (
        <h1>Not logged in</h1>
      )}
    </div>
  );
};
