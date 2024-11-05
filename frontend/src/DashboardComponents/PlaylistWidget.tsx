import { useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Search, Dehaze } from '@mui/icons-material';

export const PlaylistWidget = ({
  cover,
  title,
  tags,
}: {
  cover: string | File;
  title: string;
  tags: string[];
}) => {
  return (
    <Card
      sx={{
        width: '250px',
        height: '400px',
        backgroundColor: 'orange',
      }}
    >
      <CardContent>
        {typeof cover === 'string' ? (
          <Box
            component="img"
            src={cover}
            alt="Cover Image"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
              marginBottom: '10px',
            }}
          />
        ) : null}
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14,}}>
          {title}
        </Typography>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12 }}>
          {tags.join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
};