"use client";

import { Drawer, List, ListItem, ListItemText, IconButton, Toolbar, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const menuItems = [
  { text: "Users", path: "/admin" },
  { text: "Events", path: "/admin/event" },
];

export default function Sidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
     
      <IconButton onClick={toggleDrawer} sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}>
        <MenuIcon />
      </IconButton>

      
      <Drawer anchor="left" open={open} onClose={toggleDrawer} variant="persistent">
        <Toolbar />
        <Box sx={{ width: 250 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                key={item.text} 
                component="a" 
                href={item.path} 
                sx={{ cursor: "pointer" }} 
                onClick={toggleDrawer}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
