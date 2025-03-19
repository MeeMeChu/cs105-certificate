"use client";

import { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "../header/header";
import Footer from "@components/footer/footer";

const SIDEBAR_WIDTH = 250; 

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      
      
      <Sidebar open={open} setOpen={setOpen} />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          transition: "margin 0.3s ease",
          marginLeft: open ? `${SIDEBAR_WIDTH}px` : "0px", 
          width: open ? `calc(100% - ${SIDEBAR_WIDTH}px)` : "100%", 
        }}
      >
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 5, mt: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
