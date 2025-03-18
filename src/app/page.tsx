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
  Typography,
} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Fragment } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {

  const router = useRouter();

  return (
    <Fragment>
      <Header />
      <Container maxWidth="xl">
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
          <Grid2 container spacing={4}>
            <Box
              sx={{
                display: "flex",
              }}
            >
              {/* สำหรับกิจกรรมที่มีกำหนดการ */}
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <CardActionArea
                  onClick={() => router.push('/event-detail')}
                  //data-active={selectedCard === index ? '' : undefined}
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
                    src="/images/Event1.jpg"
                    alt="Event-1"
                    sx={{
                      height: 300,
                    }}
                  />
                  <CardContent sx={{ height: "100%" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      โครงการชุมนุมคอมตะลอนทัวร์ครั้งที่ 3
                    </Typography>
                    <Divider variant="middle" />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          mb: 1,
                        }}
                      >
                        <EventRoundedIcon />
                        <Typography sx={{ px: 1 }}>
                          21-24 มีนาคม 2568
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          mb: 1,
                        }}
                      >
                        <PeopleRoundedIcon />
                        <Typography sx={{ px: 1 }}>60</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          mb: 3,
                        }}
                      >
                        <LocationOnIcon />
                        <Typography sx={{ px: 1 }}>
                          อ.สถิงพระ จ.สงขลา
                        </Typography>
                      </Box>
                      <Button variant="contained" >
                        ลงทะเบียน
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
            <Box
              sx={{
                display: "flex-warp",
              }}
            >
              {/* Lock ไว้สำหรับหากกิจกรรมยังไม่มีกำหนดการ */}
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <CardActionArea
                  //onClick={() => setSelectedCard(index)}
                  //data-active={selectedCard === index ? '' : undefined}
                  disabled
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
                    src="/images/Event1.jpg"
                    alt="Event-1"
                    sx={{
                      height: 300,
                    }}
                  />
                  <CardContent sx={{ height: "100%" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      โครงการชุมนุมคอมตะลอนทัวร์ครั้งที่ 4
                    </Typography>
                    <Divider variant="middle" />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          mb: 1,
                        }}
                      >
                        <EventRoundedIcon />
                        <Typography sx={{ px: 1 }}>โปรดติดตาม</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          mb: 1,
                        }}
                      >
                        <PeopleRoundedIcon />
                        <Typography sx={{ px: 1 }}>โปรดติดตาม</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          mb: 3,
                        }}
                      >
                        <LocationOnIcon />
                        <Typography sx={{ px: 1 }}>โปรดติดตาม </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        sx={{ border: 2 }}
                      >
                        โปรดติดตาม
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Grid2>
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
              <b> สิ้นสุดแล้ว </b>
            </Typography>
          </Box>
          <Grid2 container spacing={4}>
            <Box
              sx={{
                display: "flex",
              }}
            >
              {/* สำหรับกิจกรรมที่มีกำหนดการ */}
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <CardActionArea
                  //onClick={() => setSelectedCard(index)}
                  //data-active={selectedCard === index ? '' : undefined}
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
                    src="/images/Event1.jpg"
                    alt="Event-1"
                    sx={{
                      height: 300,
                    }}
                  />
                  <CardContent sx={{ height: "100%" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      โครงการชุมนุมคอมตะลอนทัวร์ครั้งที่ 2
                    </Typography>
                    <Divider variant="middle" />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          mb: 1,
                        }}
                      >
                        <EventRoundedIcon />
                        <Typography sx={{ px: 1 }}>
                          21-24 มีนาคม 2568
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          mb: 1,
                        }}
                      >
                        <PeopleRoundedIcon />
                        <Typography sx={{ px: 1 }}>60</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          mb: 3,
                        }}
                      >
                        <LocationOnIcon />
                        <Typography sx={{ px: 1 }}>
                          อ.สถิงพระ จ.สงขลา
                        </Typography>
                      </Box>
                      <Button variant="contained">
                        รายละเอียดกิจกรรม
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
            <Box
              sx={{
                display: "flex",
              }}
            >
              {/* สำหรับกิจกรรมที่มีกำหนดการ */}
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <CardActionArea
                  //onClick={() => setSelectedCard(index)}
                  //data-active={selectedCard === index ? '' : undefined}
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
                    src="/images/Event1.jpg"
                    alt="Event-1"
                    sx={{
                      height: 300,
                    }}
                  />
                  <CardContent sx={{ height: "100%" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      โครงการชุมนุมคอมตะลอนทัวร์ครั้งที่ 1
                    </Typography>
                    <Divider variant="middle" />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          mb: 1,
                        }}
                      >
                        <EventRoundedIcon />
                        <Typography sx={{ px: 1 }}>
                          21-24 มีนาคม 2568
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          mb: 1,
                        }}
                      >
                        <PeopleRoundedIcon />
                        <Typography sx={{ px: 1 }}>60</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          mb: 3,
                        }}
                      >
                        <LocationOnIcon />
                        <Typography sx={{ px: 1 }}>
                          อ.สถิงพระ จ.สงขลา
                        </Typography>
                      </Box>
                      <Button variant="contained">
                        รายละเอียดกิจกรรม
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Grid2>
        </Box>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default HomePage;
