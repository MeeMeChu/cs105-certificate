"use client";
import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Card,
  CardMedia,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import React, { Fragment } from "react";
import { useEffect,useState } from "react";
import axios from "axios";


interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  status: string;
}



const EventDetailPage = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event"); // ดึงค่า event จาก URL
  console.log(eventId)
  const [event, setEvent] = useState<Event | null>(null); // Proper initialization for the event state    // ฟังก์ชันดึงข้อมูลจาก API
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/v1/events/${eventId}`);
          setEvent(response.data); 
          
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };
  
      fetchEvents();
    }, []);
  if (!event) {
    return (
      <Fragment>
        <Header />
        <Container maxWidth="xl">
          <Typography variant="h5">Loading event details...</Typography>
        </Container>
        <Footer />
      </Fragment>
    );
  }


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
            padding: 4,
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
              }}
            >
              <Card
                sx={{
                  width: "30%",
                  height: "30%",
                }}
              >
                <CardMedia
                  component="img"
                  src="/images/Event1.jpg"
                  alt="Event-1"
                  sx={{
                    height: "50%",
                  }}
                />
              </Card>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6">{event.description}</Typography>
              <Divider 
                sx={{
                  width: "30%"
                }}
              />
            </Box>
          </Box>
        </Box>
       
      </Container>
      <Footer />
    </Fragment>
  );
};

export default EventDetailPage;
