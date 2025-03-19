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
  Divider,
  Grid2,
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
          <TextField
            variant="standard"
            placeholder="ชื่อกิจกรรม"
            sx={{ mt: 1 }}
          ></TextField>
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
            <Typography variant="h5">
              กิจกรรมที่
              <b> กำลังจะเกิดขึ้น </b>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            {[1, 2, 3].map((item) => (
              <Card key={item} sx={{ width: "100%", height: "100%" }}>
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
                  onClick={() => handleEnrollClick(item)}
                >
                  <CardMedia
                    component="img"
                    src={`/images/Event-${item}.jpg`}
                    alt={`Event-${item}`}
                    sx={{ height: 270 }}
                  />
                  <CardContent sx={{ height: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#13469" }}
                        >
                          ชื่อกิจกรรม {item}
                        </Typography>
                      </Box>
                      <Divider variant="middle" sx={{ mb: 2 }} />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        px: 2,
                        mb: 2
                      }}
                    >
                      <Typography sx={{}}>
                        รายละเอียดกิจกรรม: {item}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        px: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          width: "100%",
                        }}
                      >
                        ลงทะเบียน
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default HomePage;
