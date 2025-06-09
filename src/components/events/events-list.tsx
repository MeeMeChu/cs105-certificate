import dayjs from "dayjs";
import Link from "next/link";
import { FC, Fragment } from "react";
import { Alert, Box, Chip, Grid2 as Grid, Typography } from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";

import { truncateText } from "@util/truncate-text";
import { Event } from "@type/event";

type EventProps = {
  events: any[];
};

const EventsList: FC<EventProps> = ({ events }) => {
  return (
    <Fragment>
      {events.length > 0 ? (
        events.map((event: Event) => (
          <Grid
            key={event.id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textOverflow: "ellipsis" }}
                >
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
                    label={
                      dayjs(event?.startDate).isAfter(dayjs()) // ถ้า startDate อยู่ในอนาคต
                        ? "กิจกรรมที่จะเกิดขึ้นเร็วๆ นี้"
                        : dayjs(event?.endDate).isAfter(dayjs()) // ถ้าอยู่ระหว่าง startDate และ endDate
                        ? "กำลังจัดกิจกรรม"
                        : "กิจกรรมสิ้นสุดแล้ว"
                    }
                    variant="outlined"
                    color={
                      dayjs(event?.startDate).isAfter(dayjs())
                        ? "warning" // กิจกรรมในอนาคต → สีเหลือง
                        : dayjs(event?.endDate).isAfter(dayjs())
                        ? "success" // กิจกรรมกำลังจัด → สีเขียว
                        : "error" // กิจกรรมสิ้นสุดแล้ว → สีแดง
                    }
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
    </Fragment>
  );
};

export default EventsList;
