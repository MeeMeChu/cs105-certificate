"use client"

import { AppBar, Box, Button, Container, Toolbar } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { Fragment } from 'react'

const HeaderAdmin = () => {

  const router = useRouter();

  return (
    <Fragment>
      <AppBar
        // position="fixed"
        sx={(theme) => ({
          boxShadow:
            theme.palette.mode === "dark"
              ? "none"
              : "0px 8px 24px rgba(149, 157, 165, 0.2)",
          backgroundColor: theme.palette.mode === "dark" ? "black" : "white",
          display: { xs: 'none', md: 'block' },
        })}
      >
        <Toolbar>
            <Box
              sx={{
                width: "100%"
              }}
            > 
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end"
                }}
              >
                <Button variant="outlined" onClick={() => router.push('/')}>กลับหน้าหลัก</Button>
              </Box>
            </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ my: 1, display: { xs: "none", md: "block"} }} />
    </Fragment>
  )
}

export default HeaderAdmin
