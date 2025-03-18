"use client"

import { FC } from 'react';
import { Box, Container, Typography } from '@mui/material';

const QRCodeConfirmation: FC = () => {
  // ข้อมูลจำลองของผู้เข้าร่วมกิจกรรม
  const participant = {
    name: "John Doe",
    date: "March 18, 2025",
  };
  
  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.3)",
          width: 500,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Event Participation Confirmation
        </Typography>
        <Box>
          <Typography variant="h6" color="success.main" fontWeight="bold">
            ✅ You have successfully participated in this event!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Event: <strong>CS Event</strong>
          </Typography>
          <Typography>
            Participant Name: <strong>{participant.name}</strong>
          </Typography>
          <Typography>
            Date of Participation: <strong>{participant.date}</strong>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default QRCodeConfirmation;
