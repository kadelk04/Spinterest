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
} from '@mui/material';
import { AddOutlined, FavoriteBorderOutlined } from '@mui/icons-material';
import { Owner } from '../components/data/FetchPlaylists';


export const PlaylistWidget = ({
  cover,
  title,
  owner, 
  tags,
}: {
  cover: string | File;
  title: string;
  owner: string;
  tags: string[];
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
          {/* <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12 }}>
            {tags.join(', ')}
          </Typography> */}
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