import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { List } from '@mui/material';

interface NavbarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  items: ItemProps[];
}

interface ItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}
export const Navbar: FunctionComponent<NavbarProps> = (props) => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: props.expanded ? '180px' : '90px',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: props.expanded ? '180px' : '90px',
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          border: 'none',
          transition: 'width 0.3s ease',
          height: '100%',
        },
      }}
    >
      <List>
        <ListItem component="div" sx={{ width: '90px' }}>
          <ListItemButton
            sx={{
              overflow: 'hidden',
              borderRadius: '24px',
              opacity: 0.6,
            }}
            onClick={() => props.setExpanded(!props.expanded)}
          >
            <MenuIcon />
          </ListItemButton>
        </ListItem>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {props.items.map((item, index) => (
            <ListItem
              key={index}
              component={Link}
              to={item.href}
              sx={{ textDecoration: 'none' }}
            >
              <ListItemButton sx={{ overflow: 'hidden', borderRadius: '24px' }}>
                <ListItemIcon
                  sx={{
                    minWidth: '42px',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    style: {
                      color: 'black',
                      fontWeight: '600',
                      fontFamily: 'Roboto',
                      opacity: 0.6,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      </List>
    </Drawer>
  );
};