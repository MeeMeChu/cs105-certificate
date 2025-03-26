"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Chip, Grid2 as Grid, InputAdornment, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddCircle from "@mui/icons-material/AddCircle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

import { api } from "@lib/axios-config";
import { Event, eventStatus } from "@type/event";
import SkeletonTable from "@components/loading/skelete-table";


export default function EventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ โหลดข้อมูลจาก API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/events");
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ค้นหา Event
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredEvents(
      events.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.status.toLowerCase().includes(query)
      )
    );
  };

  // ✅ ลบ Event
  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${id}`);
      setSnackbar({
        open: true,
        message: "Event deleted successfully!",
        severity: "success",
      });
      fetchEvents(); // โหลดข้อมูลใหม่
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete event.",
        severity: "error",
      });
      console.error("Error deleting event:", error);
    }
  };

  // ✅ คอลัมน์ DataGrid
  const columns: GridColDef<Event>[] = [
    {
      field: "image",
      headerName: "รูปภาพ",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.image}
          alt="event"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
        />
      ),
    },
    { field: "title", headerName: "ชื่อกิจกรรม", width: 200 },
    { field: "description", headerName: "คำอธิบาย", width: 250 },
    {
      field: "startDate",
      headerName: "วันที่จัดกิจกรรม",
      width: 130,
      renderCell(params) {
        return <>{dayjs(params?.row?.startDate).format("DD/MM/YYYY")}</>;
      },
    },
    {
      field: "endDate",
      headerName: "วันที่จัดกิจกรรม",
      width: 130,
      renderCell(params) {
        return <>{dayjs(params?.row?.endDate).format("DD/MM/YYYY")}</>;
      },
    },
    { field: "location", headerName: "สถานที่", width: 150 },
    { 
      field: "status", 
      headerName: "สถานะ", 
      width: 150,
      renderCell(params) {
        return (
          <Chip
            label={`${params?.row?.status === eventStatus.approved ? "กำลังจัดกิจกรรม" : "กิจกรรมสิ้นสุดแล้ว"}`}
            variant="outlined"
            color={params?.row?.status === eventStatus.approved ? "success" : "error"}
          />  
        );
      }, 
    },
    {
      field: "createdAt",
      headerName: "วันที่สร้างกิจกรรม",
      width: 150,
      renderCell(params) {
        return <>{dayjs(params?.row?.createdAt).format("DD/MM/YYYY")}</>;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      getActions: (params) => {
        return [
          <Tooltip key={1} title="แก้ไขกิจกรรม">
            <GridActionsCellItem
              key={1}
              icon={<EditIcon color="primary" />}
              label="UpdateEvent"
              onClick={() => router.push(`event/update/${params?.row?.id}`)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip key={2} title="ลบกิจกรรม">
            <GridActionsCellItem
              key={2}
              icon={<DeleteIcon color="primary" />}
              label="DeleteEvent"
              onClick={() => handleDeleteClick(params?.row?.id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip key={3} title="ผู้เข้าร่วมกิจกรรม">
            <GridActionsCellItem
              key={3}
              icon={<PeopleIcon color="primary" />}
              label="Registrations"
              onClick={() => router.push(`/admin/event/${params.row.id}`)}
              color="inherit"
            />
          </Tooltip>,
        ];
      },
    },
  ];

  return (
    <>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 8, md: 9 }}>
            <Typography variant="h5" fontWeight="bold">Events Managements</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                color: "white",
                boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
              }}
              startIcon={<AddCircle />}
              onClick={() => {
                router.push(`event/create`)
              }}
            >
              Create Event
            </Button>
          </Grid>
        </Grid>

        <TextField
          label="Search events"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ my: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          fullWidth
        />
        {loading ? (
          <SkeletonTable count={1} height={450} />
        ) : (
          <>
            {filteredEvents.length > 0 ? (
              <DataGrid
                rows={filteredEvents}
                columns={columns}
                getRowId={(row) => row.id}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
              />
            ) : (
              <Grid size={12}>
                <Alert severity="warning">ไม่มีข้อมูลกิจกรรม</Alert>
              </Grid>
            )}
          </>
          
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
