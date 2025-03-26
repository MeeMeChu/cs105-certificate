"use client";

import React, { FC } from "react";
import NextLink from "next/link";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export type PageType = {
  title: string;
  path?: string;
  // icon?: React.ReactNode;
};

export type NavbarBreadcrumbLayoutProps = {
  pages: PageType[];
};

const NavbarBreadcrumbLayout: FC<NavbarBreadcrumbLayoutProps> = ({ pages }) => {
  return (
    <>
      <Box sx={{ my: 2 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {pages.map((page: PageType) => 
            page?.path ? (
              <Typography
                key={page?.title}
                color="primary"
                component={NextLink}
                href={page?.path}
                sx={{ textDecoration: "none"}}
                // icon={page?.icon ? <>{page?.icon}</> : <></>}
              >
                {page?.title}
              </Typography>
            ) : (
              <Typography
                key={page?.title}
                // icon={page?.icon ? <>{page?.icon}</> : <></>}
              >
                {page?.title}
              </Typography>
            )
          )}
        </Breadcrumbs>
      </Box>
    </>
  );
};

export default NavbarBreadcrumbLayout;