"use client";

import Layout from "../../../components/admin/Layout";
import * as React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddCircle from "@mui/icons-material/AddCircle";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import Person from "@mui/icons-material/Person";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  status: string;
  createdAt: string;
  updateAt: string;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [events, setEvents] = React.useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [openEditDialog, setOpenEditDialog] = React.useState<boolean>(false);
  const [openCreateDialog, setOpenCreateDialog] = React.useState<boolean>(false);
  const [newEvent, setNewEvent] = React.useState<Event>({
    id: "",
    title: "",
    description: "",
    image: "",
    date: "",
    location: "",
    status: "",
    createdAt: "",
    updateAt: "",
  });
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const router = useRouter();

  // ✅ โหลดข้อมูลจาก API
  React.useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/v1/events");
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
      await axios.put(`http://localhost:3000/api/v1/events/${selectedEvent.id}`, selectedEvent);
      setSnackbar({ open: true, message: "Event updated successfully!", severity: "success" });
      fetchEvents(); // โหลดข้อมูลใหม่
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to update event.", severity: "error" });
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

      await axios.post("http://localhost:3000/api/v1/events", eventToSave);
      setSnackbar({ open: true, message: "Event created successfully!", severity: "success" });
      fetchEvents(); // โหลดข้อมูลใหม่
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to create event.", severity: "error" });
      console.error("Error creating event:", error);
    }
    handleCloseDialog();
  };

  // ✅ ลบ Event
  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/v1/events/${id}`);
      setSnackbar({ open: true, message: "Event deleted successfully!", severity: "success" });
      fetchEvents(); // โหลดข้อมูลใหม่
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete event.", severity: "error" });
      console.error("Error deleting event:", error);
    }
  };

  // ✅ คอลัมน์ DataGrid
  const columns: GridColDef<Event>[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.image}
          alt="event"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
        />
      ),
    },
    { field: "date", headerName: "Date", width: 130 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "createdAt", headerName: "Created At", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 1 }} startIcon={<Edit />} onClick={() => handleEditClick(params.row)}>
            Edit
          </Button>
          <Button variant="contained" color="error" startIcon={<Delete />} onClick={() => handleDeleteClick(params.row.id)}>
            Delete
          </Button>
        </Box>
      ),
    },
    {
      field: "participants",
      headerName: "Participants",
      width: 160,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="info"
          startIcon={<Person />}
          onClick={() => router.push(`/admin/event/showparticipant?eventId=${params.row.id}`)}
        >
          Users
        </Button>
      ),
    }
    
  ];

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Events Managements
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: "green", color: "white" }} startIcon={<AddCircle />} onClick={handleCreateClick}>
          Create Event
        </Button>
      </Box>

      <TextField label="Search Events" variant="outlined" fullWidth value={searchQuery} onChange={handleSearch} sx={{ mb: 2 }} />

      <Box sx={{ height: 400, width: "100%", mt: 5 }}>
        {loading ? <Typography>Loading events...</Typography> : <DataGrid rows={filteredEvents} columns={columns} pageSizeOptions={[5]} checkboxSelection disableRowSelectionOnClick getRowId={(row) => row.id} />}
      </Box>

      {/* Dialog Edit */}
      <Dialog open={openEditDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="dense" value={selectedEvent?.title || ""} onChange={(e) => setSelectedEvent((prev) => prev && { ...prev, title: e.target.value })} />
          <TextField label="Description" fullWidth margin="dense" value={selectedEvent?.description || ""} onChange={(e) => setSelectedEvent((prev) => prev && { ...prev, description: e.target.value })} />
          <TextField label="Image URL" fullWidth margin="dense" value={selectedEvent?.image || ""} onChange={(e) => setSelectedEvent((prev) => prev && { ...prev, image: e.target.value })} />
          <TextField label="Date" fullWidth margin="dense" type="date" value={selectedEvent?.date || ""} onChange={(e) => setSelectedEvent((prev) => prev && { ...prev, date: e.target.value })} />
          <TextField label="Location" fullWidth margin="dense" value={selectedEvent?.location || ""} onChange={(e) => setSelectedEvent((prev) => prev && { ...prev, location: e.target.value })} />
          <TextField label="Status" fullWidth margin="dense" value={selectedEvent?.status || ""} onChange={(e) => setSelectedEvent((prev) => prev && { ...prev, status: e.target.value })} />
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
      // แลคอ่าะ
      <Dialog open={openCreateDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create Event</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="dense" value={newEvent.title} onChange={(e) => 
            setNewEvent((prev) => ({ ...prev, title: e.target.value }))} />
          <TextField label="Description" fullWidth margin="dense" value={newEvent.description} onChange={(e) => 
            setNewEvent((prev) => ({ ...prev, description: e.target.value }))} />
          <TextField label="Image URL" fullWidth margin="dense" value={newEvent.image} onChange={(e) =>
             setNewEvent((prev) => ({ ...prev, image: e.target.value }))} />
          <TextField label="Date" fullWidth margin="dense" type="date" value={newEvent.date} onChange={(e) => 
            setNewEvent((prev) => ({ ...prev, date: e.target.value }))} />
          <TextField label="Location" fullWidth margin="dense" value={newEvent.location} onChange={(e) => 
            setNewEvent((prev) => ({ ...prev, location: e.target.value }))} />
          <TextField label="Status" fullWidth margin="dense" value={newEvent.status} onChange={(e) =>
             setNewEvent((prev) => ({ ...prev, status: e.target.value }))} />
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
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
