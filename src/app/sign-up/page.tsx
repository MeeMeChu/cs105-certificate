"use client";

import { FC, FormEvent, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import Image from "next/image";

const RegisterPage: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(false);

  const validateForm = (username: string, password: string) => {
    // Check if both username and password have values
    if (username.trim() !== "" && password.trim() !== "") {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    validateForm(event.target.value, password);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    validateForm(email, event.target.value);
  };

  const handleSignInWithEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
    } catch (e) {
      console.error("Error : ", e);
      setOpenSnackbar(true);
    }
  };

  return (
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
          p: 4,
          borderRadius: 2,
          boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.3)",
          width: 500,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/svgs/logo.svg"
            alt="logo"
            width={120}
            height={120}
            style={{ marginBottom: 8 }}
          />
        </Box>

        <Box
          gap={1.5}
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mb: 5 }}
        >
          <Typography variant="h5" fontWeight="bold">Sign Up</Typography>
        </Box>

        <form onSubmit={handleSignInWithEmail}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6}}>
              <TextField
                fullWidth
                name="firstName"
                label="First name"
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6}}>
              <TextField
                fullWidth
                name="lastName"
                label="Last name"
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                name="email"
                label="Email address"
                placeholder="example@gmail.com"
                onChange={handleEmailChange}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                onChange={handlePasswordChange}
                type={showPassword ? "text" : "password"}
                slotProps={{
                  // inputLabel: { shrink: true },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                onChange={handlePasswordChange}
                type={showPassword ? "text" : "password"}
                slotProps={{
                  // inputLabel: { shrink: true },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={12}>
              <Button
                fullWidth
                size="large"
                type="submit"
                color="primary"
                variant="contained"
                disabled={!formValid}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>

        <Typography sx={{ my: 2, textAlign: "center" }}>
          Already have an account? <Box component={Link} href="/sign-in" sx={{ textDecoration: "underline", color: "primary.main" }}>Sign In</Box>
        </Typography>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            Sign Up failed. Please check your credentials and try again.
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default RegisterPage;
