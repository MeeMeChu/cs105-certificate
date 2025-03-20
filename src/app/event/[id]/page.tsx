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
  Typography,
} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import IosShareIcon from "@mui/icons-material/IosShare";
import { Suspense } from "react";
import { api } from "@lib/axios-config";
import { notFound } from "next/navigation";
import EnrollmentModal from "@components/Enrollments/EnrollmentModal";

async function  getData(id:string) {
    const res = await api.get(`/events/${id}`);
    return res.data;
 
}

interface EventDetailPageProps{
  params : {id : string };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await  getData(id);
  if (!event) return notFound();

  return (
    <>
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
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", mb: 2, gap: 4 }}>
              <Card sx={{ width: "50%", height: "50%" }}>
                <CardMedia
                  component="img"
                  src={event.image || "/images/default.jpg"}
                  alt={event.title}
                  sx={{ height: "70%" }}
                />
              </Card>
              <Card sx={{ width: "50%", height: "50%" }}>
                <CardContent sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {event.title}
                      </Typography>
                    </Box>
                    <Divider variant="middle" sx={{ mb: 3 }} />
                  </Box>
                  <Box sx={{ display: "flex", px: 2, mb: 2, gap: 1 }}>
                    <EventRoundedIcon fontSize="medium" />
                    <Typography>{event.date}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", px: 2, mb: 2, gap: 1 }}>
                    <LocationOnIcon fontSize="medium" />
                    <Typography>{event.location}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", px: 2, mb: 2, gap: 1 }}>
                    <PeopleRoundedIcon fontSize="medium" />
                    <Typography>{event.participants} สมาชิก</Typography>
                  </Box>
                  <Divider variant="middle" sx={{ my: 3 }} />
                  <Box sx={{ display: "flex", justifyContent: "center", px: 2 }}>
                    
                    <EnrollmentModal eventId={id} />

                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "center", px: 2, mt: 2 }}>
                    <Button variant="contained" color="primary" sx={{ width: "100%" }}>
                      <IosShareIcon fontSize="small" /> แชร์
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6">คำอธิบายกิจกรรม</Typography>
              <Divider />
              <Box sx={{ display: "flex", mt: 1 }}>
                <Typography>{event.description}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
