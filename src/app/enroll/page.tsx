"use client";

import { FC, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Modal,
  Card,
  CardContent,
} from "@mui/material";
import Image from "next/image";

const Enroll: FC = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null); // State for storing image
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview

  // Get current date and time
  const currentDateTime = new Date().toLocaleString();

  // Handle image upload and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image preview
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 4,
      }}
    >
      {/* ภาพของกิจกรรม */}
      <Image
        src="/images/cybersecurity-event.jpg"
        alt="Cybersecurity Innovation Day 2025"
        width={800}
        height={400}
        style={{ borderRadius: 8 }}
      />

      {/* ชื่อกิจกรรม */}
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
        Cyber Security Innovation Day 2025
      </Typography>

      {/* รายละเอียดกิจกรรม */}
      <Card sx={{ mt: 3, width: "60%", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            📅 21 March 2025, 09:00 - 24 March 2025, 09:00
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            📍 Sathing Phra, Songkhla
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            🔒 Entry is allowed only for registered participants
          </Typography>
        </CardContent>
      </Card>

      {/* คำอธิบายกิจกรรม */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
        Description
      </Typography>
      <Typography variant="body1" sx={{ width: "60%", textAlign: "center" }}>
        เปิดประสบการณ์สุดยิ่งใหญ่ด้าน Cyber Security ที่คุณจะได้เรียนรู้และเข้าใจถึงความสำคัญของการปกป้องข้อมูล
        และระบบต่างๆ พร้อมเรียนรู้เทคนิคและกลยุทธ์ในการรับมือกับภัยคุกคามไซเบอร์อย่างมีประสิทธิภาพ
      </Typography>

      {/* ปุ่ม Share และ Enroll */}
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button variant="outlined" color="info">
          Share
        </Button>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Enroll
        </Button>
      </Box>

      {/* Modal for Enrollment Form */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Register for Event
          </Typography>

          {/* เปลี่ยนจาก Name of Event เป็น ชื่อ นามสกุล */}
          <TextField fullWidth label="ชื่อ (ไม่ต้องใส่คำนำหน้า)" variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="นามสกุล" variant="outlined" sx={{ mb: 2 }} />

          {/* Date & Time is pre-filled with current date and time */}
          <TextField
            fullWidth
            label="Date & Time"
            variant="outlined"
            value={currentDateTime}
            sx={{ mb: 2 }}
            disabled
          />

          {/* เปลี่ยนจาก Name of Event เป็น ชื่อ นามสกุล */}
          <TextField fullWidth label="Secret Pass" variant="outlined" sx={{ mb: 2 }} />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Enroll;
