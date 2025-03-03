import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    IconButton,
  } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 

export const Settings = () => {
    return (
        <Box sx={{ display: 'flex', width: '100%', height: '100vh', bgcolor: '#ECE6F9' }}>
            {/* Left Side: Settings Menu */}
            <Paper sx={{ width: '20%', p: 3, borderRight: '1px solid #ddd', bgcolor: '#ECE6F0' }}>                 
                <Typography variant="h5" sx={{ mb: 2 }}>
                    SETTINGS
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="text" sx={{ justifyContent: 'flex-start', color: 'inherit' }}>
                        Edit Profile
                    </Button>
                    <Button variant="text" sx={{ justifyContent: 'flex-start', color: 'inherit' }}>
                        Account Privacy
                    </Button>
                    <Button variant="text" sx={{ justifyContent: 'flex-start', color: 'inherit' }}>
                        Blocked
                    </Button>
                    <Button variant="text" sx={{ justifyContent: 'flex-start', color: 'inherit' }}>
                        Delete Account
                    </Button>
                    <Button variant="text" sx={{ justifyContent: 'flex-start', color: 'inherit' }}>
                        Edit Profile
                    </Button>
                </Box>
            </Paper>

            {/* Right Side: Edit Profile */}
            <Paper sx={{ width: '80%', p: 3, bgcolor: '#ECE6F0' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    EDIT PROFILE
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Profile Picture */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: '#ECE6F0',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: '1px solid #ddd',
                                marginRight: 2,
                            }}
                        >
                            {/* Replace with actual image or icon */}
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">John Doe</Typography>
                            <Button variant="outlined" size="small" sx={{ mt: 1, textTransform: 'none' }}>
                                CHANGE PHOTO
                            </Button>
                        </Box>
                    </Box>

                    {/* Bio */}
                    <TextField
                        multiline
                        rows={4}
                        placeholder="Bio"
                        inputProps={{ maxLength: 150 }}
                        helperText="0/150"
                        sx={{ bgcolor: '#ECE6F0' }}
                    />

                    {/* Edit Username */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            defaultValue="John Doe"
                            variant="outlined"
                            size="small"
                            sx={{ flexGrow: 1, bgcolor: '#ECE6F0' }}
                        />
                        <IconButton aria-label="edit">
                            <EditIcon />
                        </IconButton>
                    </Box>

                    {/* Additional Fields (Add more as needed) */}
                    <TextField variant="outlined" size="small" placeholder="Field 1" sx={{ bgcolor: '#ECE6F0' }} />
                    <TextField variant="outlined" size="small" placeholder="Field 2" sx={{ bgcolor: '#ECE6F0' }} />
                    <TextField variant="outlined" size="small" placeholder="Field 3" sx={{ bgcolor: '#ECE6F0' }} />
                </Box>
            </Paper>
        </Box>
        
    );
};