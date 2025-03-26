import { Box, Typography } from '@mui/material';
import { FC } from 'react'

const DashboardPage: FC = () => {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h5" fontWeight="bold">Dashboard</Typography>
    </Box>
  )
}

export default DashboardPage;