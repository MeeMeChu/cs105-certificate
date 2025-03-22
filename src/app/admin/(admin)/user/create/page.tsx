"use client";

import { FC, useState } from "react";
import {
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

const CreateUserPage: FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h4">Create User</Typography>
        </Grid>
      </Grid>
      <Container maxWidth="md">
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
          }}
        >
          <Box component="form" action={createUser}>
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
                <TextField
                  label="อีเมล"
                  fullWidth
                  name="email"
                  type="text"
                />
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
              <Grid size={12}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    mr: 2,
                    boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                  }}
                >
                  Create
                </Button>
                <Button
                  onClick={() => router.push("/admin/user")}
                  color="primary"
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateUserPage;
