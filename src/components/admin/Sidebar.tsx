"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Toolbar,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Person from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";

const menuItems = [
  { text: "Users", path: "/admin", icon: <Person /> },
  { text: "Events", path: "/admin/event", icon: <EventIcon /> },
];

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Menu Button */}
      <IconButton
        onClick={toggleDrawer}
        sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar Drawer */}
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
                {/* ไอคอน */}
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
