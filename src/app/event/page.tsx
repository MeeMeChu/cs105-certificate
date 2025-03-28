import { FC, Fragment } from "react";
import { Alert, Container, Grid2 as Grid, Typography } from "@mui/material";

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
    });
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
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
          <EventsList events={events}/>
        </Grid>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default EventPage;
