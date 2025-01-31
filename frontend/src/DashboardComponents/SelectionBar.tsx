import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const SelectionBar: React.FC = () => {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Box
      sx={{
        minWidth: 200,
        padding: '5px 15px',
        marginRight: '10px',
      }}
    >
      <FormControl fullWidth>
        <InputLabel
          id="demo-simple-select-label"
          sx={{
            width: '30ch',
          }}
        >
          Select Playlists
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem>Playlist</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectionBar;
