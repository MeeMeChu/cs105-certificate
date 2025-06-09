"use client";

import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";
import { api } from "@lib/axios-config";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid2 as Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Registration } from "@type/registration";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";

const UpdateRegistrationPage: FC = () => {
  const router = useRouter();
  const { slug, regId } = useParams<{ slug: string; regId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Registration>({
    id: "",
    eventId: "",
    checkedIn: false,
    email: "",
    prefix: "",
    firstName: "",
    lastName: "",
    year: "",
    schoolName: "",
    registrationDate: new Date(),
  });
  const [state, setState] = useState<{
    message: string | null;
    success: boolean;
  }>({
    message: null,
    success: false,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (!name) return;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "checkedIn" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.put(`/registrations/${regId}`, { ...formData });
      setState({ message: "แก้ไขข้อมูลสำเร็จเสร็จสิ้น!", success: true });
    } catch (error) {
      console.error("Error update registration : ", error);
      setState({ message: "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง!", success: false });
    }
  };

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/registrations/${regId}`);
        setFormData({
          ...response.data,
          registrationDate: new Date(response.data.registrationDate),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event : ", error);
        setLoading(false);
      }
    };

    fetchRegistration();
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold">
              Update registration
            </Typography>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Events", path: "/admin/event" },
                { title: "Registrations", path: `/admin/event/${slug}` },
                { title: "Update Registration" },
              ]}
            />
          </Grid>
          <Grid size={12}>
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
              }}
            >
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name="event"
                      label="กิจกรรมที่ลงทะเบียน"
                      fullWidth
                      type="text"
                      value={formData?.event?.title || ""}
                      disabled
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      select
                      name="prefix"
                      label="คำนำหน้า"
                      fullWidth
                      type="text"
                      value={formData?.prefix}
                      onChange={handleChange}
                    >
                      <MenuItem value="เด็กชาย">เด็กชาย</MenuItem>
                      <MenuItem value="เด็กหญิง">เด็กหญิง</MenuItem>
                      <MenuItem value="นาย">นาย</MenuItem>
                      <MenuItem value="นางสาว">นางสาว</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      name="firstName"
                      label="ชื่อจริง"
                      fullWidth
                      type="text"
                      value={formData?.firstName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      name="lastName"
                      label="นามสกุล"
                      fullWidth
                      type="text"
                      value={formData?.lastName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      select
                      name="year"
                      label="เลือกชั้นปี"
                      fullWidth
                      type="text"
                      value={formData?.year}
                      onChange={handleChange}
                    >
                      <MenuItem value="ม.1">ม.1</MenuItem>
                      <MenuItem value="ม.2">ม.2</MenuItem>
                      <MenuItem value="ม.3">ม.3</MenuItem>
                      <MenuItem value="ม.4">ม.4</MenuItem>
                      <MenuItem value="ม.5">ม.5</MenuItem>
                      <MenuItem value="ม.6">ม.6</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 10 }}>
                    <TextField
                      name="schoolName"
                      label="โรงเรียน"
                      fullWidth
                      type="text"
                      value={formData?.schoolName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="email"
                      label="อีเมล"
                      fullWidth
                      type="text"
                      value={formData?.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="registrationDate"
                      label="วันที่ลงทะเบียน"
                      fullWidth
                      type="date"
                      value={dayjs(formData?.registrationDate).format(
                        "YYYY-MM-DD"
                      )}
                      onChange={handleChange}
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      select
                      name="checkedIn"
                      label="วันที่ลงทะเบียน"
                      fullWidth
                      value={formData?.checkedIn || false}
                      onChange={handleChange}
                    >
                      <MenuItem value="true">เข้าร่วม</MenuItem>
                      <MenuItem value="false">ไม่เข้าร่วม</MenuItem>
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
                        onClick={() => router.push(`/admin/event/${slug}`)}
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
                        Update Registration
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UpdateRegistrationPage;
