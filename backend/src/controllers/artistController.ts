import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { getModel } from '../utils/connection';
import { IArtist } from '../models/Artist';

export const saveArtist = async (req: Request, res: Response) => {
  const payload = {
    name: req.body.name,
    artistId: req.body.artistId,
    genres: req.body.genres,
  };
  const ArtistModel = getModel<IArtist>('Artist');
  try {
    const existingArtist = await ArtistModel.findOne({
      artistId: payload.artistId,
    });
    if (existingArtist) {
      res.status(200).send('Artist already saved');
      return;
    }
    const newArtist = ArtistModel.create(payload);
    res.status(200).send('Artist saved: ' + newArtist);
  } catch (err) {
    console.error('Error saving artist:', err);
    res.status(500).send('Error saving artist');
  }
};

export const saveArtistsBulk = async (req: Request, res: Response) => {
  const ArtistModel = getModel<IArtist>('Artist');
  try {
    const artists = await ArtistModel.find({ artistId: { $in: req.body.ids } });
    const saved = artists.map((artist) => artist.artistId);
    const unsaved = req.body.ids.filter((id: string) => !saved.includes(id));
    res.status(200).send({
      saved,
      unsaved,
    });
  } catch (err) {
    console.error('Error saving artists:', err);
    res.status(500).send('Error saving artists');
  }
};

export const getArtist = async (req: Request, res: Response) => {
  const payload = {
    artistId: req.params.artistId,
  };
  try {
    const ArtistModel = getModel<IArtist>('Artist');
    const artist = await ArtistModel.findOne({ artistId: payload.artistId });
    if (!artist) {
      res.status(404).send('Artist not found');
      return;
    }
    res.status(200).send(artist);
  } catch (err) {
    console.error('Error fetching artist:', err);
    res.status(500).send('Error fetching artist');
  }
};

export const getArtists = async (req: Request, res: Response) => {
  try {
    const ArtistModel = getModel<IArtist>('Artist');
    let artistArray: IArtist[] = [];
    for (const id of req.body.ids) {
      const artist = await ArtistModel.findOne({ artistId: id });
      if (!artist) {
        console.error('Drift detected: Artist not registered');
        continue;
      }
      artistArray.push(artist);
    }
  } catch {
    console.error('Fatal error retrieving artists');
    res.status(500).send('Fatal error retrieving artists');
  }
};

export const getSavedStatus = async (req: Request, res: Response) => {
  try {
    let unsaved: string[] = [];
    let saved: string[] = [];
    const ArtistModel = getModel<IArtist>('Artist');
    req.body.ids.forEach((id: string) => {
      const existingArtist = ArtistModel.findOne({ artistId: id });
      if (!existingArtist) {
        unsaved.push(id);
      } else {
        saved.push(id);
      }
    });
    res.status(200).send({
      saved,
      unsaved,
    });
  } catch {
    console.error('Error fetching unsaved artists');
    res.status(500).send('Error fetching unsaved artists');
  }
};
