export interface TrackFeatures {
    energy: number;
    valence: number;
    tempo: number;
    loudness: number;
    danceability: number;
    acousticness: number;
    instrumentalness: number;
  }
  
  const vibes = [
    { 
      vibeName: "Energetic Energy",
      conditions: (track: TrackFeatures) =>  
        track.energy > 0.7 && 
        track.tempo > 130 && 
        track.danceability > 0.6 &&
        track.valence > 0.6 &&
        track.loudness > -6
    },
    { 
      vibeName: "Straight Chilling",
      conditions: (track: TrackFeatures) =>  
        (track.energy > 0.3 && track.energy < 0.7) && 
        (track.valence > 0.3 && track.valence < 0.7) &&
        (track.tempo > 80 && track.tempo < 120) &&
        (track.loudness > -12 && track.loudness < -6) &&
        (track.danceability > 0.4 && track.danceability < 0.7)
    },
    {
      vibeName: "Woe is Me",
      conditions: (track: TrackFeatures) =>  
        track.valence < 0.2 &&  
        track.acousticness > 0.7 && 
        track.tempo < 80 && 
        track.energy < 0.3 && 
        track.loudness < -15 
    },  
    { 
      vibeName: "Noise Enjoyer",
      conditions: (track: TrackFeatures) =>  
        track.loudness > -5 && 
        track.instrumentalness > 0.5 &&
        track.energy > 0.8
    },
    { 
      vibeName: "Feel-Good",
      conditions: (track: TrackFeatures) =>  
        (track.energy > 0.5 && track.energy < 0.8) &&
        (track.tempo > 100 && track.tempo < 130) &&
        (track.loudness > -10 && track.loudness < -5) &&
        track.valence > 0.6 && 
        track.danceability > 0.5
    },
  ];
  
  export const categorizeTrack = (track: TrackFeatures) => {
    for (const vibe of vibes) {
      if (vibe.conditions(track)) {
        return vibe.vibeName;
      }
    }
    return "A song that defies categorization";
  };
  
  export const determineUserVibes = (tracks: TrackFeatures[]) => {
    const vibeCounts: Record<string, number> = {};
    const totalTracks = tracks.length;
  
    if (tracks.length === 0) {
      return ["No Songs, No Vibes detected :("];
    }
  
    if (tracks.length === 1) {
      return ["Your vibe is just this song...interesting."];
    }
  
    tracks.forEach((track) => {
      const vibe = categorizeTrack(track);
      if (vibe) {
        vibeCounts[vibe] = (vibeCounts[vibe] || 0) + 1;
      }
    });
  
    const threshold = totalTracks * 0.3;
    const qualifyingVibes = Object.entries(vibeCounts)
      .filter(([_, count]) => count >= threshold)
      .map(([vibe]) => vibe);
  
    return qualifyingVibes.length > 0 ? qualifyingVibes : ["Vibes are a melting pot of genres"];
  };
  