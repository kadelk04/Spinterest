import {
    Box,
    Paper,
    Typography,
  } from '@mui/material';


export const Settings = () => {
    return (
        <Paper sx={{ p: 3, bgcolor: '#ECE6F9' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Settings
          </Typography>
    
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '100%',
                      bgcolor: '#FEF7FF',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid #ddd',
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        textAlign: 'center',
                        padding: '4px',
                        fontSize: '12px',
                      }}
                    >
                    </Typography>
                  </Box>
        </Paper>
      );
};