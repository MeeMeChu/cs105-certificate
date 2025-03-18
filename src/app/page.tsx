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
  TextField,
  Typography,
} from "@mui/material";
import { Fragment } from "react";

const HomePage = () => {
  return (
    <Fragment>
      <Header />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <TextField variant="standard" placeholder="ชื่อกิจกรรม"></TextField>
          <Button variant="contained" sx={{ ml : 3 , fontSize : 16, px : 3 }}>
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
            padding: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight : 'bold' }} >กิจกรรมที่ กำลังจะเกิดขึ้น</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              mt: 4,
            }}
          >
            <Box
              sx={{
                mr: 2,
              }}
            >
              <Card sx={{ width: 450, height: 300 }}>
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
                    src="/images/Event-1.jpg"
                    alt="Event-1"
                    sx={{
                      height : 150
                    }}
                  />
                  <CardContent sx={{ height: "100%" }}>
                    <Typography 
                      variant="h6"
                      sx={{
                        fontWeight : 'bold',
                        color : '#13469'
                      }}
                    >
                      Hello
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    ></Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                {/* <CardMedia
                  component="img"
                  height="140"
                  image="/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                /> */}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default HomePage;
