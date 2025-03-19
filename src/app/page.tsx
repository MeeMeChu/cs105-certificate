"use client";

import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Fragment } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const handleEnrollClick = (eventId) => {
    router.push(`/event-detail?event=${eventId}`);
  };

  return (
    <Fragment>
      <Header />
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <TextField variant="standard" placeholder="ชื่อกิจกรรม" sx={{ mt: 1 }}></TextField>
          <Button variant="contained" sx={{ ml: 3, fontSize: 16, px: 3 }}>
            ค้นหา
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            my: 3,
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.3)",
            padding: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              กิจกรรมที่ กำลังจะเกิดขึ้น
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mt: 4,
            }}
          >
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ width: "100%" }}>
                <Card sx={{ width: "100%", height: 300 }}>
                  <CardActionArea
                    sx={{
                      height: "100%",
                      "&[data-active]": {
                        backgroundColor: "action.selected",
                        "&:hover": {
                          backgroundColor: "action.selectedHover",
                        },
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={`/images/Event-${item}.jpg`}
                      alt={`Event-${item}`}
                      sx={{ height: 150 }}
                    />
                    <CardContent sx={{ height: "100%" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#13469" }}
                      >
                        Event {item}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Description for event {item}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "80%", fontSize: "16px", py: 1 }}
                    onClick={() => handleEnrollClick(item)}
                  >
                    Enroll
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default HomePage;
