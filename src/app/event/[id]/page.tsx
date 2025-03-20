import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import {
  Box,
  Container,
  Divider,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import dayjs from "dayjs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { api } from "@lib/axios-config";
import { notFound } from "next/navigation";
import EnrollmentModal from "@components/Enrollments/EnrollmentModal";

async function getData(id: string) {
  const res = await api.get(`/events/${id}`);
  return res.data;
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getData(id);
  if (!event) return notFound();

  return (
    <>
      <Header />
      <Container>
        <Box
          sx={{
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.3)",
            padding: 4,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h6">รายละเอียดกิจกรรม</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src={event?.image || "/images/default.jpg"}
                alt={event?.title}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.3)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {event?.title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <EventRoundedIcon fontSize="medium" />
                  <Typography>
                    {dayjs(event?.date).format("DD MMMM YYYY")}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LocationOnIcon fontSize="medium" />
                  <Typography>{event?.location}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <PeopleRoundedIcon fontSize="medium" />
                  <Typography>{event?.participants} สมาชิก</Typography>
                </Box>
                <Divider sx={{ mt: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <EnrollmentModal eventId={id} />
                </Box>
              </Box>
            </Grid>
            <Grid size={12}>
              <Typography variant="h5">คำอธิบายกิจกรรม</Typography>
              <Divider sx={{ my : 2 }}/>
              <Box sx={{ display: "flex", mb: 2 }}>
                <Typography>{event?.description}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
