"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Fragment, JSX, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BorderColorIcon from '@mui/icons-material/BorderColor';

import { Role } from "@type/user";

type Content = {
  text: string;
  icon: JSX.Element;
  roles: string[];
  to?: string;
  children?: Content[];
}

const mainListItems : Content[] = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    to: "/admin/dashboard",
    roles: [Role.admin, Role.staff],
  },
  {
    text: "Users",
    icon: <PersonIcon />,
    to: "/admin/user",
    roles: [Role.admin],
  },
  {
    text: "Event Management",
    icon: <EmojiEventsIcon />,
    roles: [Role.admin, Role.staff],
    children: [
      {
        text: "Events",
        icon: <EventNoteIcon />,
        to: "/admin/event",
        roles: [Role.admin, Role.staff],
      },
      {
        text: "Certificates",
        icon: <WorkspacePremiumIcon />,
        to: "/admin/certificate",
        roles: [Role.admin, Role.staff],
      },
      {
        text: "Signatures",
        icon: <BorderColorIcon />,
        to: "/admin/signature",
        roles: [Role.admin, Role.staff],
      },
    ]
  },
];

// const secondaryListItems = [
//   { text: "Settings", icon: <CampaignIcon />, to: "#" },
//   { text: "About", icon: <CampaignIcon /> },
//   { text: "Feedback", icon: <CampaignIcon /> },
// ];

export default function MenuContent() {
  const { data: session } = useSession();
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>("0");

  const isOpen = (index: number) => openIndexes.includes(index);
  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const userRole = session?.user?.role ?? Role.member;
  const filteredListItems = mainListItems.filter(item => item.roles.includes(userRole ?? Role.member));

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {filteredListItems.map((item, index) => (
          <Fragment key={index}>
            <ListItem disablePadding sx={{ display: "block", my: 1 }}>
              <ListItemButton
                onClick={() => {
                  if (item.children) {
                    toggleOpen(index);
                  } else {
                    setSelectedIndex(index.toString());
                  }
                }}
                {...(!item.children && { component: Link, to: item.to })}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.children ? (
                  isOpen(index) ? (
                    <ExpandMoreIcon />
                  ) : (
                    <ChevronRightIcon />
                  )
                ) : null}
              </ListItemButton>
            </ListItem>

            {/* Submenu */}
            {item.children && (
              <Collapse in={isOpen(index)} timeout="auto" unmountOnExit>
                <List dense disablePadding sx={{ display: "block" }}>
                  {item.children.map((subItem, subIndex) => {
                    const key = `${index}-${subIndex}`;
                    return (
                      <ListItem key={subIndex} disablePadding sx={{ pl: 2, display: "block" }}>
                        <ListItemButton
                          component={Link}
                          href={subItem.to!}
                          onClick={() => setSelectedIndex(key)}
                          selected={selectedIndex === key}
                        >
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            )}
          </Fragment>
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
    </Stack>
  );
}