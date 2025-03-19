"use client";

import { FC, useEffect, useState, Fragment } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Modal,
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import Image from "next/image";
import Header from "@components/header/header";
import Footer from "@components/footer/footer";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;  // It's a string that represents the event date, likely in ISO 8601 format
  status: string;
}

interface EnrollData {
  email: string;
  firstName: string;
  lastName: string;
  secretPass: string;
  eventId: string | null;
  year: string;
  schoolName: string;
}

const Enroll: FC = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event"); // Get event ID from URL
  const [event, setEvent] = useState<Event | null>(null);
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [secretPass, setSecretPass] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [schoolName, setSchoolName] = useState<string>("");

  // Fetch event details from API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/events/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // Handle form submission
  const handleSubmit = async () => {
    // Convert the event.date to Date object before sending it to the API
    const dateTime = new Date(event?.date || '');  // Ensure it's a Date object

    const data: EnrollData = {
      email,
      firstName,
      lastName,
      secretPass,
      eventId,
      year,
      schoolName,
    };

    try {
      const response = await axios.post(`http://localhost:3000/api/v1/enroll/${eventId}`, data);
      if (response.status === 200) {
        alert("Enrollment successful!");
        setOpen(false); // Close modal after submission
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("An error occurred. Please try again.");
    }
  };

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
    <>
      <Header />
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
        {/* Display event image */}
        <Image
          src={event.image || "/images/Event1.jpg"}
          alt={event.title}
          width={800}
          height={400}
          style={{ borderRadius: 8 }}
        />

        {/* Event title */}
        <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
          {event.title}
        </Typography>

        {/* Event details */}
        <Card sx={{ mt: 3, width: "60%", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              Description
            </Typography>
            <Typography variant="body1" sx={{ width: "60%", mb: 2 }}>
              {event.description}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              📅 {event.date} {/* Display event date */}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              📍 {event.status}
            </Typography>
          </CardContent>
        </Card>

        {/* Buttons for sharing and enrolling */}
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

            {/* Form for Email, FirstName, LastName, School, Secret Pass */}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="ชื่อ (ไม่ต้องใส่คำนำหน้า)"
              variant="outlined"
              sx={{ mb: 2 }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label="นามสกุล"
              variant="outlined"
              sx={{ mb: 2 }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
               <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="grade-select-label">เลือกชั้นปี</InputLabel>
              <Select
                labelId="grade-select-label"
                id="grade-select"
                value={year}
                label="เลือกชั้นปี"
                onChange={(e) => setYear(e.target.value as string)}
              >
                <MenuItem value="ม.1">ม.1</MenuItem>
                <MenuItem value="ม.2">ม.2</MenuItem>
                <MenuItem value="ม.3">ม.3</MenuItem>
                <MenuItem value="ม.4">ม.4</MenuItem>
                <MenuItem value="ม.5">ม.5</MenuItem>
                <MenuItem value="ม.6">ม.6</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="โรงเรียน"
              variant="outlined"
              sx={{ mb: 2 }}
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Secret Pass"
              type="password"
              variant="outlined"
              sx={{ mb: 2 }}
              value={secretPass}
              onChange={(e) => setSecretPass(e.target.value)}
            />

            {/* Select for Year */}
         

            {/* Submit and Cancel Buttons */}
            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
      <Footer />
    </>
  );
};

export default Enroll;
