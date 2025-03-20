"use client"

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuContent from './menu-content';
import { Box, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { stringAvatar } from '@util/string-avatar';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {

    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 1, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            {/* <Tooltip title={auth?.currentUser?.email}> */}
            <Tooltip title="6510210114@psu.ac.th">
              {/* <Avatar {...stringAvatar(`${auth?.currentUser?.email}`)} sx={{ width: 36, height: 36}} /> */}
              <Avatar {...stringAvatar(`6510210114@psu.ac.th`)} sx={{ width: 36, height: 36}} />
            </Tooltip>
            <Box>
              <Typography component="p" variant="h6">
                {/* {auth?.currentUser?.displayName?.replace(/[^a-zA-Z ]/g, "")} */}
                Thanakrit Yodmunee
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Role : Admin
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        {/* <CardAlert /> */}
        <Stack sx={{ p: 2 }}>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={handleLogout}
            startIcon={<LogoutRoundedIcon />}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}