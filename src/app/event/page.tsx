import { FC, Fragment } from "react";
import {
  Alert,
  Box,
  CardContent,
  Container,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";

import { api } from "@lib/axios-config";
import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  status: string;
}

async function getData() {
  const res = await api.get("/events");
  return res.data;
}

const EventPage: FC = async () => {
  const events = await getData();

  return (
    <Fragment>
      <Header />
      <Container>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold">
              รายการกิจกรรม
            </Typography>
          </Grid>
          {events.length > 0 ? (
            events.map((event: Event) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                key={event.id}
                sx={{
                  cursor: "pointer",
                  boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Box href={`/event/${event.id}`} component={Link}>
                  <Box
                    component="img"
                    src={`${event.image}`}
                    alt={event.title}
                    sx={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#13469" }}
                    >
                      {event?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event?.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", mt: 1 }}
                    >
                      <EventRoundedIcon sx={{ fontSize: 16, mr: 1 }} />
                      {new Date(event.date).toLocaleDateString("th-TH")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: event.status === "Active" ? "green" : "red",
                      }}
                    >
                      สถานะ: {event?.status}
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Alert severity="warning">ไม่มีข้อมูลกิจกรรม</Alert>
            </Grid>
          )}
        </Grid>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default EventPage;
