import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Interface to define the shape of profile input data
interface ProfileInput {
  status?: string;
  location?: string;
  links?: string;
  biography?: string;
  favgen1?: string;
  favgen2?: string;
  fava1?: string;
  fava2?: string;
  favalb1?: string;
  favalb2?: string;
}

app.post('/api/logProfileInput', (req: Request, res: Response) => {
  try {
    const profileData: ProfileInput = req.body;

    // Log all received data to the terminal
    console.log('Received Profile Input:');
    console.log('-------------------');

    // Log each field if it exists
    if (profileData.status) {
      console.log(`Status: ${profileData.status}`);
    }
    if (profileData.location) {
      console.log(`Location: ${profileData.location}`);
    }
    if (profileData.links) {
      console.log(`Links: ${profileData.links}`);
    }
    if (profileData.biography) {
      console.log(`Biography: ${profileData.biography}`);
    }
    if (profileData.favgen1) {
      console.log(`Favorite Genre 1: ${profileData.favgen1}`);
    }
    if (profileData.favgen2) {
      console.log(`Favorite Genre 2: ${profileData.favgen2}`);
    }
    if (profileData.fava1) {
      console.log(`Favorite Artist 1: ${profileData.fava1}`);
    }
    if (profileData.fava2) {
      console.log(`Favorite Artist 2: ${profileData.fava2}`);
    }
    if (profileData.favalb1) {
      console.log(`Favorite Album 1: ${profileData.favalb1}`);
    }
    if (profileData.favalb2) {
      console.log(`Favorite Album 2: ${profileData.favalb2}`);
    }

    // Send a success response
    res.status(200).json({ message: 'Profile input logged successfully' });
  } catch (error) {
    console.error('Error logging profile input:', error);
    res.status(500).json({ message: 'Error processing profile input' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
