"use client";

import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  status: string;
}



const HomePage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);

  // ฟังก์ชันดึงข้อมูลจาก API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/events");
        setEvents(response.data); // ตั้งค่าข้อมูลที่ดึงมา
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // ฟังก์ชันเมื่อกดปุ่ม "Enroll"
  const handleEnrollClick = (eventId) => {
    router.push(`/enroll?event=${eventId}`);
  };

  return (
    <Fragment>
      <Header />
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <TextField variant="standard" placeholder="ชื่อกิจกรรม" sx={{ mt: 1 }} />
          <Button variant="contained" sx={{ ml: 3, fontSize: 16, px: 3 }}>
            ค้นหา
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            my: 3,
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.3)",
            padding: 4,
          }}
        >
          <Box sx={{ display: "flex", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              กิจกรรมที่กำลังจะเกิดขึ้น
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mt: 4,
            }}
          >
            {events.length > 0 ? (
              events.map((event: Event) => (
                <Box key={event.id} sx={{ width: "100%" }}>
                  <Card sx={{ width: "100%", height: 320 }}>
                    <CardActionArea sx={{ height: "100%" }}>
                      <CardMedia
                        component="img" 
                        src={event.image}
                        alt={event.title}
                        sx={{ height: 150 }}
                      />
                      <CardContent sx={{ height: "100%" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#13469" }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.description}
                        </Typography>
                        <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                          <EventRoundedIcon sx={{ fontSize: 16, mr: 1 }} />
                          {new Date(event.date).toLocaleDateString("th-TH")}
                        </Typography>
                        <Typography variant="body2" sx={{ color: event.status === "Active" ? "green" : "red" }}>
                          สถานะ: {event.status}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ width: "80%", fontSize: "16px", py: 1 }}
                      onClick={() => handleEnrollClick(event.id)}
                    >
                      Enroll
                    </Button>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                ไม่มีข้อมูลกิจกรรม
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default HomePage;
