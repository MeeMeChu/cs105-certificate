import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import { PrismaClient } from "@prisma/client";

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

const prisma = new PrismaClient();

async function getData(slug: string) {
  const eventById = await prisma.event.findUnique({
    where: {
      slug: slug,
    },
  });

  const count_total = await prisma.registration.count({
    where: {
      eventId: eventById?.id,
    },
  });
  return { ...eventById, count_total };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getData(slug);
  if (!event) return notFound();

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Grid container spacing={1}>
          <Grid
            size={{ xs: 12, md: 12 }}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src={event?.image || "/images/default.jpg"}
              alt={event?.title}
              sx={{
                width: "75%",
                borderRadius: 2,
              }}
            />
          </Grid>
          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 4 }}>
              <Typography variant="h2">
                {dayjs(event?.startDate).format("DD")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <Typography
                sx={{
                  color: "#666666",
                  fontWeight: "normal",
                }}
              >
                ถึงวันที่ {dayjs(event?.endDate).format("DD MMMM YYYY")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
              <LocationOnIcon fontSize="medium" />
              <Typography
                sx={{
                  color: "#666666",
                  fontWeight: "normal",
                  fontStyle: "italic",
                }}
              >
                {event?.location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1, gap: 1 }}>
              <PeopleRoundedIcon fontSize="medium" />
              <Typography
                sx={{
                  color: "#666666",
                  fontWeight: "normal",
                  fontStyle: "italic",
                }}
              >
                สมาชิก {event?.count_total} คน
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 4 }}>
              <EnrollmentModal eventId={event?.id} />
            </Box>
          </Grid>
          <Grid
            size={{ xs: 12, md: 7 }}
            direction="column"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4 }}>
              {event?.title}
            </Typography>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography>{event?.description}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
