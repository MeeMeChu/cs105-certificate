
import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import { Container } from "@mui/material";
import { Fragment } from "react";

const HomePage = () => {
  return (
    <Fragment>
      <Header />
      <Container>
        HomePage
      </Container>
      <Footer />
    </Fragment>
  );
}

export default HomePage;