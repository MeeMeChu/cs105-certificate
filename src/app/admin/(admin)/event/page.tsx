"use client";

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
import { Event } from "@type/event";
import SkeletonTable from "@components/loading/skelete-table";
import dayjs from "dayjs";

export default function EventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    title: "",
    description: "",
    image: "",
    date: "",
    location: "",
    status: "",
    secretPass: "",
    createdAt: "",
    updateAt: "",
  });

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

  // ✅ เปิด Dialog แก้ไข
  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setOpenEditDialog(true);
  };

  // ✅ เปิด Dialog สร้างใหม่
  const handleCreateClick = () => {
    setNewEvent({
      id: "",
      title: "",
      description: "",
      image: "",
      date: "",
      location: "",
      status: "",
      secretPass: "",
      createdAt: "",
      updateAt: "",
    });
    setOpenCreateDialog(true);
  };

  // ✅ ปิด Dialog แก้ไข
  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setOpenCreateDialog(false);
    setSelectedEvent(null);
  };

  // ✅ บันทึกการแก้ไข
  const handleSaveEdit = async () => {
    if (!selectedEvent) return;
    try {
      await api.put(`/events/${selectedEvent.id}`, selectedEvent);
      setSnackbar({
        open: true,
        message: "Event updated successfully!",
        severity: "success",
      });
      fetchEvents(); // โหลดข้อมูลใหม่
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update event.",
        severity: "error",
      });
      console.error("Error updating event:", error);
    }
    handleCloseDialog();
  };

  // ✅ บันทึกการสร้างใหม่
  const handleSaveCreate = async () => {
    try {
      // Make sure date is correctly formatted
      const formattedDate = new Date(newEvent.date).toISOString();
      const eventToSave = { ...newEvent, date: formattedDate };

      await api.post("/events", eventToSave);
      setSnackbar({
        open: true,
        message: "Event created successfully!",
        severity: "success",
      });
      fetchEvents(); // โหลดข้อมูลใหม่
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create event.",
        severity: "error",
      });
      console.error("Error creating event:", error);
    }
    handleCloseDialog();
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
      field: "date",
      headerName: "วันที่จัดกิจกรรม",
      width: 130,
      renderCell(params) {
        return <>{dayjs(params?.row?.date).format("DD/MM/YYYY")}</>;
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
            label={`${params?.row?.status === "active" ? "กำลังจัดกิจกรรม" : "กิจกรรมสิ้นสุดแล้ว"}`}
            variant="outlined"
            color={params?.row?.status === "active" ? "success" : "error"}
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
              onClick={() => handleEditClick(params?.row)}
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
              onClick={handleCreateClick}
            >
              Create Event
            </Button>
          </Grid>
        </Grid>

        <TextField
          label="Search users"
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
        )}

        {/* Dialog Edit */}
        <Dialog open={openEditDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              margin="dense"
              value={selectedEvent?.title || ""}
              onChange={(e) =>
                setSelectedEvent(
                  (prev) => prev && { ...prev, title: e.target.value }
                )
              }
            />
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              value={selectedEvent?.description || ""}
              onChange={(e) =>
                setSelectedEvent(
                  (prev) => prev && { ...prev, description: e.target.value }
                )
              }
            />
            <TextField
              label="Image URL"
              fullWidth
              margin="dense"
              value={selectedEvent?.image || ""}
              onChange={(e) =>
                setSelectedEvent(
                  (prev) => prev && { ...prev, image: e.target.value }
                )
              }
            />
            <TextField
              label="Date"
              fullWidth
              margin="dense"
              type="date"
              value={selectedEvent?.date || ""}
              onChange={(e) =>
                setSelectedEvent(
                  (prev) => prev && { ...prev, date: e.target.value }
                )
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Location"
              fullWidth
              margin="dense"
              value={selectedEvent?.location || ""}
              onChange={(e) =>
                setSelectedEvent(
                  (prev) => prev && { ...prev, location: e.target.value }
                )
              }
            />
            <TextField
              label="Status"
              fullWidth
              margin="dense"
              value={selectedEvent?.status || ""}
              onChange={(e) =>
                setSelectedEvent(
                  (prev) => prev && { ...prev, status: e.target.value }
                )
              }
            />
            <TextField
              label="Invitation Code"
              fullWidth
              margin="dense"
              value={selectedEvent?.secretPass || ""}
              onChange={(e) =>
                setSelectedEvent(
                  (prev) => prev && { ...prev, secretPass: e.target.value }
                )
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Create */}

        <Dialog open={openCreateDialog} onClose={handleCloseDialog}>
          <DialogTitle>Create Event</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              margin="dense"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <TextField
              label="Image URL"
              fullWidth
              margin="dense"
              value={newEvent.image}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, image: e.target.value }))
              }
            />
            <TextField
              label="Date"
              fullWidth
              margin="dense"
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, date: e.target.value }))
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Location"
              fullWidth
              margin="dense"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, location: e.target.value }))
              }
            />
            <TextField
              label="Status"
              fullWidth
              margin="dense"
              value={newEvent.status}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, status: e.target.value }))
              }
            />
            <TextField
              label="Invitation Code"
              fullWidth
              margin="dense"
              value={newEvent.secretPass}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, secretPass: e.target.value }))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveCreate} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>

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
