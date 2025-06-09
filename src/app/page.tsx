import Image from "next/image";
import { Fragment } from "react";
import {
  Alert,
  Box,
  Container,
  Divider,
  Grid2 as Grid,
  Typography,
} from "@mui/material";

import { prisma } from "@lib/db";
import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import EventsList from "@components/events/events-list";

async function getData() {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: "Approved",
      },
      orderBy: { startDate: "desc" }, // เรียงตามวันที่เริ่มต้น
      take: 4,
    });
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

const HomePage = async () => {
  const events = await getData();

  return (
    <Fragment>
      <Header />
      <Container>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={12}>
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
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
            </Grid>
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
            </Box>
          </Grid>
          <EventsList events={events} />
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
