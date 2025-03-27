"use client";

import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";
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
import { useRouter } from "next/navigation";
import { FC, useActionState } from "react";
import { createEvent } from "./action";
import { eventStatus } from "@type/event";

const initialState: { success: boolean; message: string | null } = {
  success: false,
  message: null,
};

const CreateEventPage: FC = () => {
  const router = useRouter();
  const [state, formAction] = useActionState(createEvent, initialState);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold">
              Create a new event
            </Typography>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Events", path: "/admin/event" },
                { title: "New event" },
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
              <form action={formAction}>
                <Grid container spacing={2}>
                  <Grid size={{ xs : 12, md: 8}}>
                    <TextField
                      name="title"
                      label="ชื่อกิจกรรม"
                      fullWidth
                      type="text"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs : 12, md: 4}}>
                    <TextField
                      name="slug"
                      label="slug"
                      fullWidth
                      type="text"
                      required
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
                      required
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      name="image"
                      label="รูปภาพ (URL)"
                      fullWidth
                      type="text"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="startDate"
                      label="วันที่เริ่มกิจกรรม"
                      fullWidth
                      type="date"
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="endDate"
                      label="วันที่สิ้นสุดกิจกรรม"
                      fullWidth
                      type="date"
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      required
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      name="location"
                      label="สถานที่"
                      fullWidth
                      type="text"
                      required
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      select
                      label="status"
                      name="status"
                      fullWidth
                      defaultValue={eventStatus.draft}
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
                      required
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
                        Create Event
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateEventPage;
