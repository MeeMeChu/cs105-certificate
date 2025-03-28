import { Fragment } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Chip,
  Container,
  Divider,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";

import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import { api } from "@lib/axios-config";
import dayjs from "dayjs";
import Image from "next/image";
import { truncateText } from "@util/truncate-text";
import { Event, eventStatus } from "@type/event";

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
        <Grid container spacing={2} sx={{ alignItems: "center", mb: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box 
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Image
                src="/svgs/home-image.svg"
                alt="image-home-page"
                width={480}
                height={480}
                style={{
                  padding: 16,
                  marginTop: 64,
                  marginBottom: 64,
                }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h4" fontWeight="bold">
                ระบบกิจกรรม ชุมนุมคอมพิวเตอร์
              </Typography>
              <Typography variant="h5">
                มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่
              </Typography>
            </Box>
          </Grid>
          <Grid size={12}>
            <Divider sx={{ my: 3 }} />
          </Grid>
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                กิจกรรมที่กำลังจะเกิดขึ้น
              </Typography>
              {/* <Box>
                <TextField
                  variant="outlined"
                  placeholder="ชื่อกิจกรรม"
                  sx={{ mt: 1 }}
                />
                <Button variant="contained" sx={{ ml: 3, fontSize: 16, px: 3 }}>
                  ค้นหา
                </Button>
              </Box> */}
            </Box>
          </Grid> 
          {events.length > 0 ? (
            events.map((event: Event) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                key={event?.id}
                sx={{
                  cursor: "pointer",
                  boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Box href={`/event/${event.slug}`} component={Link}>
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#13469" }}
                    >
                      {event?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textOverflow: "ellipsis"}}>
                      {truncateText(event?.description)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", mt: 1 }}
                    >
                      <EventRoundedIcon sx={{ fontSize: 16, mr: 1 }} />
                      {dayjs(event?.startDate).format("DD MMMM YYYY")}
                    </Typography>
                    <Box>
                      <Chip
                        label={`${event?.status === eventStatus.approved ? "กำลังจัดกิจกรรม" : "กิจกรรมสิ้นสุดแล้ว"}`}
                        variant="outlined"
                        color={event?.status === eventStatus.approved ? "success" : "error"}
                      />
                    </Box>
                  </Box>
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
      {/* <ScrollVelocity
        texts={["Computer Science"]}
        velocity={50}
        className="custom-scroll-text"
      /> */}
      <Footer />
    </Fragment>
  );
};

export default HomePage;
