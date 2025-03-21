"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { JSX, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from "@mui/material";
import { Role } from "@type/user";
import packageJson from "./../../../package.json";
import { Session } from "next-auth";

type Content = {
  text: string;
  icon: JSX.Element;
  to: string;
  roles: string[];
}

const mainListItems : Content[] = [
  {
    text: "Users",
    icon: <PersonIcon />,
    to: "/admin/user",
    roles: [Role.admin, Role.staff],
  },
  {
    text: "Events",
    icon: <EmojiEventsIcon />,
    to: "/admin/event",
    roles: [Role.admin, Role.staff],
  },
];

// const secondaryListItems = [
//   { text: "Settings", icon: <CampaignIcon />, to: "#" },
//   { text: "About", icon: <CampaignIcon /> },
//   { text: "Feedback", icon: <CampaignIcon /> },
// ];

export default function MenuContent() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { data: session, status } = useSession();

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;  // หรือแสดง Loading state ถ้ายังไม่ได้โหลด
  }
  const userRole = (session as Session & { user: { role: string } })?.user?.role ?? 'Member';

  const filteredListItems = mainListItems.filter(item => item.roles.includes(userRole ?? Role.member));

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {filteredListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              href={item?.to ?? "#"}
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item?.to ?? "#"}
              selected={selectedIndex === mainListItems.length + index}
              onClick={() => handleListItemClick(mainListItems.length + index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
      <Typography variant="caption" color="primary" textAlign="center">
        เวอร์ชั่น: {packageJson.version}
      </Typography>
    </Stack>
  );
}