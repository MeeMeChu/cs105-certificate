"use client"

import { FC } from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuContent from "./menu-content";
import { Grid2 as Grid, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { stringAvatar } from "@util/string-avatar";
import OptionsMenu from "./options-menu";
import { useSession } from "next-auth/react";

const drawerWidth = 260;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

const ScrollableBox = styled(Box)({
  overflowY: "auto",
  flexGrow: 1,
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
});

const SideMenu : FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Drawer
      anchor="left"
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
          gap: 2,
          cursor: "pointer"
        }}
        onClick={() => router.push("/admin/dashboard")}
      >
        <Avatar
          variant="rounded"
          alt="psu-app-logo"
          src="/images/logo.jpg"
          sx={{ width: 36, height: 36 , objectFit: "cover" }}
        />
        <Typography variant="body1" sx={{ fontWeight: "bold"}}>
          PSU COMSCI CLUB
        </Typography>
      </Box>
      <Divider />

      <ScrollableBox>
        <MenuContent />
      </ScrollableBox>
      
      {/* <CardAlert /> */}
      <Grid container spacing={3} sx={{ px: 1, py: 2, alignItems: "center", borderTop: "1px solid",
          borderColor: "divider", }}>
        <Grid size={2}>
          <Tooltip title={session?.user?.email}>
            <Avatar {...stringAvatar(`${session?.user?.email}`)}/>
          </Tooltip>
        </Grid>
        <Grid size={8} sx={{ pl: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {session?.user?.firstName} {session?.user?.lastName} 
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Role : {session?.user?.role}
          </Typography>
        </Grid>
        <Grid size={2}>
          <OptionsMenu />
        </Grid>
      </Grid>
      {/* <Stack
        direction="row"
        sx={{
          py: 2,
          px: 1,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "space-between",
        }}
      >
        <Tooltip title={auth?.currentUser?.email}>
          <Avatar {...stringAvatar(`${auth?.currentUser?.email}`)} sx={{ width: 42, height: 42}} />
        </Tooltip>
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {auth?.currentUser?.displayName}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {auth?.currentUser?.email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack> */}
    </Drawer>
  );
}

export default SideMenu;