import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
} from '@mui/material';
import {
  AddOutlined,
  FavoriteBorderOutlined,
  DragIndicator,
} from '@mui/icons-material';

export const PlaylistWidget = ({
  cover,
  title,
  owner,
  genres,
  dragHandleClass,
  noDragClass,
}: {
  cover: string | File;
  title: string;
  owner: string;
  genres: string[];
  dragHandleClass: string;
  noDragClass: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Card
      sx={{
        width: '250px',
        height: '400px',
        backgroundColor: '#FEF7FF',
        borderRadius: '20px',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow:
            '0 0 16px rgba(128, 0, 128, 0.2), 0 0 16px rgba(128, 0, 128, 0.2)', // More defined highlight on the right and left borders
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <IconButton
          className={dragHandleClass}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <DragIndicator />
        </IconButton>
      )}
      <CardContent className={noDragClass} sx={{ padding: 0 }}>
        {/* <DragIndicator/> */}
        {typeof cover === 'string' ? (
          <Box
            component="img"
            src={cover}
            alt="Cover Image"
            sx={{
              width: '100%',
              height: '250px',
              objectFit: 'cover',
              opacity: 1,
              // marginBottom: '10px',
            }}
          />
        ) : null}
        <Box sx={{ px: 2, height: '64px' }}>
          <Typography
            variant="subtitle1"
            component={'h3'}
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 'bold',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </Typography>
          <Typography
            gutterBottom
            sx={{ color: 'text.secondary', fontSize: 14 }}
          >
            {owner}
          </Typography>
        </Box>
        <Box sx={{ padding: 2 }}>
          {/* only horizontal space if not on new line */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              width: '100%',
              height: '64px',
            }}
          >
            {genres.map((genre) => (
              <Chip key={genre} label={genre} size="small" color="primary" />
            ))}
          </Stack>
        </Box>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'flex-end', marginTop: '10%', width: '100%' }}
        >
          <FavoriteBorderOutlined></FavoriteBorderOutlined>
          <AddOutlined></AddOutlined>
        </Stack>
      </CardContent>
    </Card>
  );
};
