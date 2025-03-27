import dayjs from "dayjs";
import {
  Box,
  Container,
  Divider,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

import EnrollmentModal from "@components/Enrollments/EnrollmentModal";
import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import { Fragment } from "react";

const prisma = new PrismaClient();

async function getData(slug: string) {
  const eventById = await prisma.event.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { registrations: true }, // นับ registration ใน event เดียวกัน
      },
    },
  });
  if (!eventById) return null;  
  const { _count, ...eventData } = eventById;
  return { ...eventData, count_total: _count.registrations };
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
    <Fragment>
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
              <Typography variant="h5" fontWeight="bold">รายละเอียดกิจกรรม</Typography>
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
                  borderRadius: 2,
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
                    {dayjs(event?.startDate).format("DD MMMM YYYY")}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LocationOnIcon fontSize="medium" />
                  <Typography>{event?.location}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <PeopleRoundedIcon fontSize="medium" />
                  <Typography>สมาชิก {event?.count_total} คน</Typography>
                </Box>
                <Divider sx={{ mt: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <EnrollmentModal eventId={event.id} />
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
    </Fragment>
  );
}
