import { Router } from 'express';
import {
  getArtist,
  getArtists,
  getSavedStatus,
  saveArtist,
} from '../../controllers/artistController';

const router = Router();

router.post('/', (req, res) => {
  saveArtist(req, res);
});

router.get('/:artistId', (req, res) => {
  getArtist(req, res);
});

router.post('/status', (req, res) => {
  getSavedStatus(req, res);
});

router.post('/bulk', (req, res) => {
  getArtists(req, res);
});

export default router;
