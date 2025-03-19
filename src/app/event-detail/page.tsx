"use client";
import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import IosShareIcon from "@mui/icons-material/IosShare";
import React, { Fragment, useState } from "react";

const EventDetailPage = () => {
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
    <Fragment>
      <Header />
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            my: 3,
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.3)",
            padding: 8,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mb: 2,
                gap: 4,
              }}
            >
              <Card
                sx={{
                  width: "50%",
                  height: "50%",
                }}
              >
                <CardMedia
                  component="img"
                  src="/images/Event1.jpg"
                  alt="Event-1"
                  sx={{
                    height: "70%",
                  }}
                />
              </Card>
              <Card
                sx={{
                  width: "50%",
                  height: "50%",
                }}
              >
                <CardContent sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#13469" }}
                      >
                        ชื่อกิจกรรม
                      </Typography>
                    </Box>
                    <Divider variant="middle" sx={{ mb: 3 }} />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      px: 2,
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    <EventRoundedIcon fontSize="medium" />
                    <Typography>21-24 มีนาคม 2568</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      px: 2,
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    <LocationOnIcon fontSize="medium" />
                    <Typography>โรงเรียนสถิงพระ จ.สงขลา</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      px: 2,
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    <PeopleRoundedIcon fontSize="medium" />
                    <Typography>สมาชิกลงทะเบียน</Typography>
                  </Box>
                  <Divider variant="middle" sx={{ my: 3 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      px: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        width: "100%",
                      }}
                      onClick={() => setOpen(true)}
                    >
                      ลงทะเบียน
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      px: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        width: "100%",
                      }}
                    >
                      <IosShareIcon fontSize="small" />
                      แชร์
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6">คำอธิบายกิจกรรม</Typography>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  mt: 1,
                }}
              >
                <Typography>
                  เปิดประสบการณ์สุดยิ่งใหญ่ด้าน Cyber Security
                  ที่คุณจะได้เรียนรู้และเข้าใจถึงความสำคัญของการปกป้องข้อมูล
                  และระบบต่างๆ
                  พร้อมเรียนรู้เทคนิคและกลยุทธ์ในการรับมือกับภัยคุกคามไซเบอร์อย่างมีประสิทธิภาพ
                </Typography>
              </Box>
            </Box>
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
                ลงทะเบียนกิจกรรม
              </Typography>

              {/* เปลี่ยนจาก Name of Event เป็น ชื่อ นามสกุล */}
              <TextField
                fullWidth
                label="ชื่อ (ไม่ต้องใส่คำนำหน้า)"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="นามสกุล"
                variant="outlined"
                sx={{ mb: 2 }}
              />

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
              <TextField
                fullWidth
                label="Secret Pass"
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Box
                sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setOpen(false)}
                >
                  ยกเลิก
                </Button>
                <Button variant="contained" color="primary">
                  ยืนยัน
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default EventDetailPage;
