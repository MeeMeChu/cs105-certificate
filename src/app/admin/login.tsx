"use client"

import { FC, FormEvent, useState } from 'react'
import { Alert, Box, Button, Container, Divider, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from 'next/link';
import Image from 'next/image';

const LoginPage: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(false);

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

  const validateForm = (username: string, password: string) => {
    // Check if both username and password have values
    if (username.trim() !== "" && password.trim() !== "") {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handleSignInWithEmail = async (
    event: FormEvent<HTMLFormElement>
  ) => {
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
          <Typography variant="h5" fontWeight="bold">Sign in</Typography>
        </Box>

        <form onSubmit={handleSignInWithEmail}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <TextField
              sx={{ mb: 3 }}
              fullWidth
              name="email"
              label="Email address"
              placeholder="example@gmail.com"
              onChange={handleEmailChange}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            {/* <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
              Forgot password?
            </Link> */}

            <TextField
              fullWidth
              sx={{ mb: 3 }}
              name="password"
              label="Password"
              onChange={handlePasswordChange}
              type={showPassword ? "text" : "password"}
              slotProps={{
                inputLabel: { shrink: true },
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

            <Button
              fullWidth
              size="large"
              type="submit"
              color="primary"
              variant="contained"
              disabled={!formValid}
            >
              Sign in
            </Button>
          </Box>
        </form>

        {/* <Divider
          sx={{ my: 3, "&::before, &::after": { borderTopStyle: "dashed" } }}
        >
          <Typography
            variant="overline"
            sx={{ color: "text.secondary", fontWeight: "fontWeightMedium" }}
          >
            OR
          </Typography>
        </Divider> */}

        <Typography sx={{ my: 2, textAlign: "center" }}>
          Don't have an account? <Box component={Link} href="/sign-up" sx={{ textDecoration: "underline", color: "primary.main" }}>Sign Up</Box>
        </Typography>
      </Box>
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
          Sign in failed. Please check your credentials and try again.
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default LoginPage;
