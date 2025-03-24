"use client";

import { FC, useActionState, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";

import { Role } from "@type/user";
import { createUser } from "./action";
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";

const initialState: { success: boolean; message: string | null } = {
  success: false,
  message: null,
};

const CreateUserPage: FC = () => {
  const router = useRouter();
  const [state, formAction] = useActionState(createUser, initialState);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold">Create a new user</Typography>
          </Grid>
        </Grid>
        <Grid size={12}>
          <NavbarBreadcrumbLayout
            pages={[
              { title: "Dashboard", path: "/admin/dashboard" },
              { title: "User" },
            ]}
          />
        </Grid>
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
          }}
        >
          <form action={formAction}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="ชื่อจริง"
                  fullWidth
                  name="firstName"
                  type="text"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="นามสกุล"
                  fullWidth
                  name="lastName"
                  type="text"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="อีเมล" fullWidth name="email" type="text" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="รหัสผ่าน"
                  fullWidth
                  name="password"
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
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  label="ตำแหน่ง"
                  fullWidth
                  name="role"
                  defaultValue={Role.member}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                >
                  <MenuItem value={Role.admin}>Admin</MenuItem>
                  <MenuItem value={Role.staff}>Staff</MenuItem>
                  <MenuItem value={Role.member}>Member</MenuItem>
                </TextField>
              </Grid>

              {state.message && (
                <Grid size={12}>
                  <Alert severity={state.success ? "success" : "error"}>
                    {state.message}
                  </Alert>
                </Grid>
              )}

              <Grid size={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <Button
                    onClick={() => router.push("/admin/user")}
                    color="primary"
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                    }}
                  >
                    Create User
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateUserPage;
