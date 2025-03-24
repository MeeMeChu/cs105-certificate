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
import { signOut, useSession } from 'next-auth/react';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const { data: session } = useSession();

  const handleLogout = async () => {
    signOut({ callbackUrl: '/admin' })
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
            <Tooltip title={session?.user?.email}>
              <Avatar {...stringAvatar(`${session?.user?.email}`)} sx={{ width: 36, height: 36}} />
            </Tooltip>
            <Box>
              <Typography component="p" variant="h6">
                {session?.user?.firstName} {session?.user?.lastName} 
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Role : {session?.user?.role}
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