"use client";

import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Event as EventIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { FC, useEffect, useState } from "react";
import { api } from "@lib/axios-config";
import { Event } from "@type/event";
import { useRouter } from "next/navigation";

const DashboardPage: FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Calculate statistics from API data
  const calculateStats = () => {
    const totalEvents = events.length;
    const totalParticipants = events.reduce(
      (sum, event) => sum + event.participants,
      0
    );

    // Events this month (assuming current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const eventsThisMonth = events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    }).length;

    // New registrations (participants in active/upcoming events)
    const newRegistrations = events
      .filter((event) => event.status === "Approved")
      .reduce((sum, event) => sum + event.participants, 0);

    return [
      {
        title: "กิจกรรมทั้งหมด",
        value: totalEvents.toString(),
        icon: <EventIcon sx={{ fontSize: 40 }} />,
        color: "#1976d2",
        bgColor: "#e3f2fd",
      },
      {
        title: "สมาชิกที่ลงทะเบียน",
        value: totalParticipants.toString(),
        icon: <GroupIcon sx={{ fontSize: 40 }} />,
        color: "#2e7d32",
        bgColor: "#e8f5e8",
      },
      {
        title: "กิจกรรมเดือนนี้",
        value: eventsThisMonth.toString(),
        icon: <CalendarIcon sx={{ fontSize: 40 }} />,
        color: "#ed6c02",
        bgColor: "#fff3e0",
      },
      {
        title: "ผู้เข้าร่วมใหม่",
        value: newRegistrations.toString(),
        icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
        color: "#9c27b0",
        bgColor: "#f3e5f5",
      },
    ];
  };

  const stats = calculateStats();

  // Get recent events (latest 5)
  const recentEvents = events
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "กำลังดำเนินการ":
        return "success";
      case "เปิดรับสมัคร":
        return "primary";
      case "กำลังวางแผน":
        return "warning";
      case "ปิดรับสมัครแล้ว":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: { sm: "100%", md: "1700px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography variant="h6" color="error" textAlign="center">
          เกิดข้อผิดพลาด: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          แดชบอร์ด
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ยินดีต้อนรับสู่ระบบจัดการกิจกรรมชุมนุมคอมพิวเตอร์
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          sx={{
            mr: 2,
            mb: { xs: 1, sm: 0 },
            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
            color: "white",
          }}
          onClick={() => router.push("/admin/event/create")}
        >
          สร้างกิจกรรมใหม่
        </Button>
        <Button
          variant="outlined"
          size="large"
          sx={{ mb: { xs: 1, sm: 0 } }}
          onClick={() => router.push("/admin/event")}
        >
          ดูรายงานทั้งหมด
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: stat.bgColor,
                      color: stat.color,
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Events */}
      <Card sx={{ boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              กิจกรรมล่าสุด
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => router.push("/admin/event")}
            >
              ดูทั้งหมด
            </Button>
          </Box>

          {recentEvents.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              py={4}
            >
              ไม่มีข้อมูลกิจกรรม
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      ชื่อกิจกรรม
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>วันที่</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>สถานะ</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      ผู้เข้าร่วม
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentEvents.map((event) => (
                    <TableRow key={event.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {event.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(event.startDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.status}
                          color={getStatusColor(event.status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {event.participants}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;
