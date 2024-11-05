import { useEffect, useState } from 'react';
import React from 'react';
import {
  Box,
  Typography,
  Input,
  InputAdornment
} from '@mui/material';
import { 
  Search, 
  Dehaze 
} from '@mui/icons-material';
import GridLayout, { Layout } from 'react-grid-layout';

interface Widget {
  id: string;
  component: JSX.Element;
}

export const Dashboard = ({ widgets }: { widgets: Widget[] }) => {
  const [layout, setLayout] = React.useState<Layout[]>(
    widgets.map((widget, index) => ({
        i: widget.id,
        x: (index % 3) * 4,
        y: Math.floor(index / 3) * 4,
        w: 4,
        h: 4,
    }))
  );
  const gridWidth = 1200; // Customize as needed

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  const renderWidget = (id: string) => (
    <Box
      sx={{
        backgroundColor: 'orange',
        borderRadius: '10px',
        padding: '10px',
        height: '100%',
        textAlign: 'center'
      }}
    >
      <Typography variant="h6">{id}</Typography>
      <Typography>Playlist content for {id}</Typography>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Input
        placeholder='/genre, /tag, /person'
        id="input-with-icon-adornment"
        startAdornment={
          <InputAdornment position="start">
            <Dehaze />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        }
        disableUnderline
        sx={{
          borderRadius: '20px',
          backgroundColor: 'white', 
          padding: '5px 15px',
          border: '1px solid #ccc', 
        }}
      />
      <Typography>
        Dashboard
      </Typography>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={60}
        width={gridWidth}
        onLayoutChange={onLayoutChange}
      >
        {widgets.map((widget) => (
          <div key={widget.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {widget.component}
          </div>
        ))}
      </GridLayout>
    </Box>
  );
};

