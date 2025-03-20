"use client"

import { FC } from "react";
import { alpha, Box, CssBaseline, Stack } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import AppNavbar from "../app-nav-bar";
import SideMenu from "../side-menu";
import HeaderAdmin from "../header/header";

type LayoutProps = {
  children: React.ReactNode;
};

const LayoutAdmin: FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            width: { sm: `calc(100% - ${240}px)` },
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 12, md: 0 },
            }}
          >
            <HeaderAdmin />
            {children}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutAdmin;