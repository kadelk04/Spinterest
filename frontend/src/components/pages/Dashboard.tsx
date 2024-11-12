import { useEffect, useState } from 'react';
import React from 'react';
import { Box, Typography, Input, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { getLayouts } from '../data/layoutGenerator';

import { returnWidgets, Widget } from '../data/playlistUtils';
import { Theme } from '../common/Theme';

export const Dashboard = () => {
  const [widgets, setWidgets] = React.useState<Widget[]>([]);

  const spotToken = localStorage.getItem('spotify_token');

  if (!spotToken) {
    window.location.replace('http://localhost:3000/login');
  }

  useEffect(() => {
    returnWidgets().then((widgets) => {
      setWidgets(widgets);
    });
  }, []);

  console.log('Widgets:', widgets);
  const layouts = getLayouts(widgets);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Theme>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Input
          placeholder="/genre, /tag, /person"
          id="input-with-icon-adornment"
          endAdornment={
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          }
          disableUnderline
          sx={{
            alignSelf: 'center',
            width: '33%',
            minWidth: '300px',
            borderRadius: '40px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.primary.light
                : theme.palette.background.default,
            padding: '5px 15px',
            border: '0px solid #ccc',
            zIndex: 100,
          }}
        />
        <Typography>Dashboard</Typography>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 6, md: 4, sm: 2, xs: 1, xxs: 1 }}
          // cols={6}
          rowHeight={420}
          width={windowWidth}
          // onLayoutChange={onLayoutChange}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {widget.component}
            </div>
          ))}
        </ResponsiveGridLayout>
      </Box>
    </Theme>
  );
};
