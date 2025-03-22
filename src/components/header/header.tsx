"use client";

import Image from "next/image";
import React, { FC, MouseEvent, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { useApp } from "@context/app-context";
import { useSession } from "next-auth/react";
import { Role } from "@type/user";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

const path = [
  { label: "Home", path: "/" },
  { label: "Event", path: "/event" },
];

const Header: FC<Props> = (props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const appContext = useApp();
  if (!appContext) return null;
  const { toggleTheme, mode } = appContext;

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: string | null
  ) => {
    if (newMode) toggleTheme(); // สลับโหมดเมื่อเลือกปุ่มใหม่
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        component="div"
        sx={{
          color: "black",
          cursor: "pointer",
        }}
        onClick={() => router.push("/")}
      >
        <Image src="/images/logo.png" alt="logo" width={64} height={64} />
      </Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: 1,
          p: 1,
        }}
      >
        {path.map(({ label, path }, index) => (
          <Typography
            key={index}
            sx={(theme) => ({
              p: 1,
              cursor: "pointer",
              transition: "color 0.3s ease",
              "&:hover": {
                color: "primary.main",
                fontWeight: "bold",
              },
              color: theme.palette.mode === "dark" ? "white" : "black",
            })}
            variant="h6"
            onClick={() => router.push(path)}
          >
            {label}
          </Typography>
        ))}
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <AppBar
        // position="fixed"
        sx={(theme) => ({
          boxShadow:
            theme.palette.mode === "dark"
              ? "none"
              : "0px 8px 24px rgba(149, 157, 165, 0.2)",
          backgroundColor: theme.palette.mode === "dark" ? "black" : "white",
        })}
      >
        <Toolbar>
          <Container>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={(theme) => ({
                    ml: 1,
                    display: { sm: "none" },
                    color: theme.palette.mode === "dark" ? "white" : "black",
                  })}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    cursor: "pointer",
                  }}
                  onClick={() => router.push("/")}
                >
                  <Image
                    src="/images/logo.png"
                    alt="logo"
                    width={64}
                    height={64}
                  />
                </Typography>
                <Box
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    color: "black",
                  }}
                >
                  {path.map(({ label, path }, index) => (
                    <Typography
                      key={index}
                      sx={(theme) => ({
                        ml: 4,
                        p: 1,
                        cursor: "pointer",
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: "primary.main",
                          fontWeight: "bold",
                        },
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                      })}
                      variant="h6"
                      onClick={() => router.push(path)}
                    >
                      {label}
                    </Typography>
                  ))}
                </Box>
              </Box>
              {session?.user?.role === Role.admin && (
                <Button
                  variant="contained"
                  onClick={() => router.push("/admin/user")}
                  sx={{ 
                    boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.3)",
                    textTransform: "none",
                    color: "white"
                  }}
                >
                  Admin dashborad
                </Button>
              )}
              {/* <Box sx={{ display: "block" }}>
                <Tooltip title="Account settings">
                  <IconButton
                    aria-label="profile"
                    onClick={handleClick}
                    sx={{ color: "black" }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <PersonIcon
                      fontSize="medium"
                      sx={(theme) => ({
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                      })}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  // onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        width: 180,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={() => router.push("/profile")}>
                    <Avatar /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Avatar /> My account
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={() => router.push("/sign-in")}>
                    <ListItemIcon>
                      <LoginIcon fontSize="small" />
                    </ListItemIcon>
                    Sign In
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Sign Out
                  </MenuItem>
                  <Divider />
                  <ToggleButtonGroup
                    color="primary"
                    value={mode}
                    exclusive
                    onChange={handleChange}
                    aria-label="mode"
                    size="small"
                    fullWidth
                    sx={{ px: 2 }}
                  >
                    <ToggleButton value="light">
                      <LightModeIcon />
                    </ToggleButton>
                    <ToggleButton value="dark">
                      <DarkModeIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Menu>
              </Box> */}
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={(theme) => ({
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor:
                theme.palette.mode === "dark" ? "black" : "white",
            },
          })}
        >
          {drawer}
        </Drawer>
      </nav>
      <Toolbar sx={{ my: 1 }} />
    </Box>
  );
};

export default Header;
