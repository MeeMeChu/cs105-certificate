"use client"

import { Backdrop, CircularProgress } from '@mui/material'
import React, { FC } from 'react'

const BackdropLoading: FC = () => {
  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default BackdropLoading;