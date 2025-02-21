import { Drawer, Box, Typography, IconButton, Button } from "@mui/material";
import { Close } from "@mui/icons-material"; 
import { useVibes } from "./VibesContext";

export const Vibes = () => {
    const { isOpen, closeVibes } = useVibes();
    const navbarWidth = 80; 

    return (
        <Drawer 
            anchor="left" 
            open={isOpen} 
            onClose={closeVibes}
            ModalProps={{
              BackdropProps: { invisible: true }, 
            }}
            sx={{
                "& .MuiDrawer-paper": {
                  width: 350,
                  bgcolor: "secondary.light",
                  padding: 3,
                  height: "100vh",
                  position: "fixed",
                  left: `${navbarWidth}px`, 
                  borderTopRightRadius: "16px",
                  borderBottomRightRadius: "16px",
                  boxShadow: "4px 0px 8px rgba(0, 0, 0, 0.2)", 
                  overflow: "hidden", 
                },
              }}>
            <Box
              sx={{
                width: 350,
                p: 3,
                bgcolor: "secondary.light",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
                <IconButton 
                    onClick={closeVibes} 
                    sx={{ position: "absolute", top: 20, right: 30 }}> 
                    <Close />
                </IconButton>
    
                <Typography variant="h6" gutterBottom>
                    🎵 Your Current Vibe
                </Typography>
    
                <Typography variant="subtitle1" fontWeight="bold">
                    Song Title - Artist Name
                </Typography>

                <Box
                    sx={{
                        width: 200,
                        height: 200, 
                        bgcolor: "grey.300", 
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Album Cover
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        borderRadius: "20px",
                        padding: "10px 20px",
                        mr: 5,
                    }}
                >
                    Find People with Similar Vibes
                </Button>
            </Box>
        </Drawer>
    );
};
