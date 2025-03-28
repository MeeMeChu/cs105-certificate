"use client";

import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Grid2,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";

import { api } from "@lib/axios-config";
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";
import { Event, eventStatus } from "@type/event";
import dayjs from "dayjs";

const UpdateEventPage: FC = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<{
    message: string | null;
    success: boolean;
  }>({
    message: null,
    success: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Event>({
    id: "",
    slug: "",
    title: "",
    description: "",
    image: "",
    startDate: new Date(""),
    endDate: new Date(""),
    location: "",
    status: eventStatus.draft,
    secretPass: "",
  });
  console.log("🚀 ~ formData:", formData)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.put(`/events/${id}`, {
        ...formData,
      });
      setState({ message: "แก้ไขข้อมูลสำเร็จเสร็จสิ้น!", success: true });
    } catch (error) {
      console.error("Error update event : ", error)
      setState({ message: "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง!", success: false });
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        setFormData({
          ...response.data,
          startDate: new Date(response.data.startDate),
          endDate: new Date(response.data.endDate),
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event : ", error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold">
              Update event
            </Typography>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Events", path: "/admin/event" },
                { title: "Update event" },
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
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  name="title"
                  label="ชื่อกิจกรรม"
                  fullWidth
                  type="text"
                  value={formData?.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  name="slug"
                  label="slug"
                  fullWidth
                  type="text"
                  value={formData?.slug}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  multiline
                  rows={4}
                  name="description"
                  label="คำอธิบายกิจกรรม"
                  fullWidth
                  type="text"
                  value={formData?.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  name="image"
                  label="รูปภาพ (URL)"
                  fullWidth
                  type="text"
                  value={formData?.image}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  name="startDate"
                  label="วันที่เริ่มกิจกรรม"
                  fullWidth
                  type="date"
                  value={dayjs(formData?.startDate).format("YYYY-MM-DD")}
                  onChange={handleChange}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  name="endDate"
                  label="วันที่สิ้นสุดกิจกรรม"
                  fullWidth
                  type="date"
                  value={dayjs(formData?.endDate).format("YYYY-MM-DD")}
                  onChange={handleChange}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  name="location"
                  label="สถานที่"
                  fullWidth
                  type="text"
                  value={formData?.location}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  select
                  label="status"
                  name="status"
                  fullWidth
                  defaultValue={eventStatus.draft}
                  value={formData?.status}
                  onChange={handleChange}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                >
                  <MenuItem value={eventStatus.draft}>Draft</MenuItem>
                  <MenuItem value={eventStatus.approved}>Approved</MenuItem>
                </TextField>
              </Grid>
              <Grid size={12}>
                <TextField
                  label="รหัสเชิญเข้าร่วม"
                  name="secretPass"
                  fullWidth
                  type="text"
                  value={formData?.secretPass}
                  onChange={handleChange}
                />
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
                    onClick={() => router.push("/admin/event")}
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
                    Update Event
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default UpdateEventPage;
