"use client"

import { ChangeEvent, FC, FormEvent, useActionState, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { Alert, Box, Button, Container, Grid2 as Grid, IconButton, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import NavbarBreadcrumbLayout from '@components/navbar-breadcrumbs';
import { Role, User } from '@type/user';
import { api } from '@lib/axios-config';

const UpdateUserPage: FC = () => {
  const router = useRouter();
  const { id } = useParams<{ id : string }>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [state, setState] = useState<{
    message: string | null;
    success: boolean;
  }>({
    message: null,
    success: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: Role.member,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.put(`/users/${id}`, {
        ...formData,
      });
      setState({ message: "แก้ไขข้อมูลสำเร็จเสร็จสิ้น!", success: true });
    } catch (error) {
      console.error("Error update user : ", error);
      setState({ message: "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง!", success: false });
    }
  } 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${id}`);
        setFormData({
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user : ", error);
      }
    }
    fetchUser();
  }, [])

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold">Update user</Typography>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Users", path: "/admin/user"},
                { title: "Update user" },
              ]}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="ชื่อจริง"
                  fullWidth
                  value={formData?.firstName}
                  name="firstName"
                  type="text"
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="นามสกุล"
                  fullWidth
                  value={formData?.lastName}
                  name="lastName"
                  type="text"
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField 
                  label="อีเมล" 
                  fullWidth 
                  name="email" 
                  type="text"
                  value={formData?.email}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="รหัสผ่าน"
                  fullWidth
                  name="password"
                  onChange={handleChange}
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
                  value={formData?.role}
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
                    disabled={loading}
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
                    disabled={loading}
                  >
                    Update User
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default UpdateUserPage;