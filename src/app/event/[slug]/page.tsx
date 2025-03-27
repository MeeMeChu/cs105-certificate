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
        <Box>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
          <Grid 
            container
            sx={{
              display: "flex",
              flexDirection: "row"
            }}
          >
            <Grid
              size={4}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 4,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <Typography variant="h2">
                      {dayjs(event?.startDate).format("DD")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{
                        color: "#666666",
                        fontWeight: "normal",
                      }}
                    >
                      ถึงวันที่ {dayjs(event?.endDate).format("DD MMMM YYYY")}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", mt: 3, gap: 1 }}>
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
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
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
              </Box>
            </Grid>
            <Grid
              size={5}
              direction="column"
              sx={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  py: 5,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {event?.title}
                </Typography>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography>{event?.description}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              size={5}
              sx={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <EnrollmentModal eventId={event?.id} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
