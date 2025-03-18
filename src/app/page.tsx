import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import { Box, Container } from "@mui/material";
import { Fragment } from "react";

const HomePage = () => {
  return (
    <Fragment>
      <Header />
      <Container
        maxWidth="xl"
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            
          }}

        >

        </Box>
      </Container>
      <Footer />
    </Fragment>
  );
}

export default HomePage;