import { Fragment } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  CardContent,
  Container,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";

import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import { api } from "@lib/axios-config";

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

const HomePage = async () => {
  const events = await getData();

  return (
    <Fragment>
      <Header />
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              กิจกรรมที่กำลังจะเกิดขึ้น
            </Typography>
          </Box>
          <Box>
            <TextField
              variant="standard"
              placeholder="ชื่อกิจกรรม"
              sx={{ mt: 1 }}
            />
            <Button variant="contained" sx={{ ml: 3, fontSize: 16, px: 3 }}>
              ค้นหา
            </Button>
          </Box>
        </Box>
        <Grid container spacing={2}>
          {events.length > 0 ? (
            events.map((event: Event) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3}}
                key={event.id}
                sx={{
                  cursor: "pointer",
                  boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                  borderRadius: 4,
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
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#13469" }}
                    >
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
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
                      สถานะ: {event.status}
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

export default HomePage;
