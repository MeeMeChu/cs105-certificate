"use client";
import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import {
  Box,
  Card,
  CardMedia,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import React, { Fragment } from "react";

const EventDetailPage = () => {
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
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mb: 2,
              }}
            >
              <Card
                sx={{
                  width: "30%",
                  height: "30%",
                }}
              >
                <CardMedia
                  component="img"
                  src="/images/Event1.jpg"
                  alt="Event-1"
                  sx={{
                    height: "50%",
                  }}
                />
              </Card>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6">Description</Typography>
              <Divider 
                sx={{
                  width: "30%"
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          hello
        </Box>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default EventDetailPage;
