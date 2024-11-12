import { useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack,
  Chip,
} from '@mui/material';
import { AddOutlined, FavoriteBorderOutlined } from '@mui/icons-material';

export const PlaylistWidget = ({
  cover,
  title,
  owner,
  genres, 
}: {
  cover: string | File;
  title: string;
  owner: string;
  genres: string[];
}) => {
  return (
    <Card
      sx={{
        width: '250px',
        height: '400px',
        backgroundColor: '#FEF7FF',
        borderRadius: '20px',
      }}
    >
      <CardContent sx={{ padding: 0 }}>
        {typeof cover === 'string' ? (
          <Box
            component="img"
            src={cover}
            alt="Cover Image"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              // marginBottom: '10px',
            }}
          />
        ) : null}
        <Box sx={{padding: 2}}>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14,}}>
            {owner}
          </Typography>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14,}}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ padding: 2 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {genres.map((genre) => (
              <Chip key={genre} label={genre} size="small" />
            ))}
          </Stack>
        </Box>
        <Stack direction="row" spacing={2}
          sx={{justifyContent:'flex-end', marginTop:'10%', width: '100%' }}
        >
          <FavoriteBorderOutlined></FavoriteBorderOutlined>
          <AddOutlined></AddOutlined>
        </Stack>

      </CardContent>
    </Card>
  );
};