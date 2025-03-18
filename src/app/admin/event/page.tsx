"use client";

import Layout from "../../../components/admin/Layout";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/navigation";
import DialogTitle from "@mui/material/DialogTitle";

interface Event {
  id: number;
  Title: string;
  description: string;
  image: string;
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  registrations: string;
}

const initialRows: Event[] = [
  {
    id: 1,
    Title: "Event 1",
    description: "Description of Event 1",
    image: "image1.jpg",
    date: "2024-03-18",
    status: "Active",
    createdAt: "2024-03-18",
    updatedAt: "2024-03-18",
    registrations: "100",
  },
  {
    id: 2,
    Title: "Event 2",
    description: "Description of Event 2",
    image: "image2.jpg",
    date: "2024-03-19",
    status: "Pending",
    createdAt: "2024-03-18",
    updatedAt: "2024-03-18",
    registrations: "50",
  },
];

export default function DataGridDemo() {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [filteredRows, setFilteredRows] = React.useState<Event[]>(initialRows);
  const [open, setOpen] = React.useState(false); 
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = React.useState<number | null>(null);
  const [newEvent, setNewEvent] = React.useState<Event>({
    id: Date.now(),
    Title: "",
    description: "",
    image: "",
    date: "",
    status: "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
    registrations: "0",
  });

  const router = useRouter();

  // ฟังก์ชันสำหรับค้นหา Event
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = initialRows.filter(
      (event) =>
        event.Title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.status.toLowerCase().includes(query)
    );
    setFilteredRows(filtered);
  };

  // ฟังก์ชันสำหรับเปิด/ปิด Create Dialog
  const handleCreateOpen = () => setCreateOpen(true);
  const handleCreateClose = () => setCreateOpen(false);

  // ฟังก์ชันสำหรับเปลี่ยนแปลงข้อมูลในฟอร์ม Create
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันสำหรับบันทึกข้อมูล Event ใหม่
  const handleCreateSave = () => {
    setFilteredRows([...filteredRows, { ...newEvent, id: Date.now() }]);
    setCreateOpen(false);
    setNewEvent({
      id: Date.now(),
      Title: "",
      description: "",
      image: "",
      date: "",
      status: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      registrations: "0",
    });
  };

  // ฟังก์ชันสำหรับเปิด Edit Dialog
  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  // ฟังก์ชันสำหรับปิด Edit Dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  // ฟังก์ชันสำหรับเปลี่ยนแปลงข้อมูลในฟอร์ม Edit
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedEvent) {
      setSelectedEvent({ ...selectedEvent, [e.target.name]: e.target.value });
    }
  };

  // ฟังก์ชันสำหรับบันทึกการแก้ไข Event
  const handleSave = () => {
    setFilteredRows(
      filteredRows.map((e) => (e.id === selectedEvent?.id ? selectedEvent! : e))
    );
    handleClose();
  };

  // ฟังก์ชันสำหรับเปิด Delete Dialog
  const handleDeleteClick = (id: number) => {
    setEventToDelete(id);
    setDeleteOpen(true);
  };

  // ฟังก์ชันสำหรับยืนยันการลบ Event
  const handleConfirmDelete = () => {
    if (eventToDelete !== null) {
      setFilteredRows(filteredRows.filter((event) => event.id !== eventToDelete));
    }
    setDeleteOpen(false);
    setEventToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteOpen(false);
    setEventToDelete(null);
  };

  // กำหนดคอลัมน์สำหรับ DataGrid รวมถึงปุ่ม Edit, Delete และ Show participants
  const columns: GridColDef<Event>[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "Title", headerName: "Title", width: 110 },
    { field: "description", headerName: "Description", width: 180 },
    { field: "image", headerName: "Image", width: 130 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "createdAt", headerName: "Created At", width: 130 },
    { field: "updatedAt", headerName: "Updated At", width: 130 },
    { field: "registrations", headerName: "Registrations", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
        {
        field: "Show participants",
        headerName: "Show participants",
        width: 180,
        renderCell: () => (
          <Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#64b5f6",
                "&:hover": { backgroundColor: "#42a5f5" },
                mr: 1,
              }}
              onClick={() => router.push("/admin/event/showparticipant")}
            >
              Show participants
            </Button>
          </Box>
          ),
        },
  ];

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Events Management
        </Typography>
        <Button variant="contained" color="success" onClick={handleCreateOpen}>
          Create Event
        </Button>
      </Box>
      <TextField
        label="Search Events"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      <Box sx={{ height: 400, width: "100%", mt: 5 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      {/* Dialog สำหรับ Edit Event */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            name="Title"
            label="Title"
            fullWidth
            margin="dense"
            value={selectedEvent?.Title || ""}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            margin="dense"
            value={selectedEvent?.description || ""}
            onChange={handleChange}
          />
          <TextField
            name="date"
            label="Date"
            fullWidth
            margin="dense"
            value={selectedEvent?.date || ""}
            onChange={handleChange}
          />
          <TextField
            name="status"
            label="Status"
            fullWidth
            margin="dense"
            value={selectedEvent?.status || ""}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog สำหรับ Delete Event */}
      <Dialog open={deleteOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this event?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog สำหรับ Create New Event */}
      <Dialog open={createOpen} onClose={handleCreateClose} fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField
            name="Title"
            label="Title"
            fullWidth
            margin="dense"
            value={newEvent.Title}
            onChange={handleCreateChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            margin="dense"
            value={newEvent.description}
            onChange={handleCreateChange}
          />
          <TextField
            name="date"
            label="Date"
            fullWidth
            margin="dense"
            value={newEvent.date}
            onChange={handleCreateChange}
          />
          <TextField
            name="status"
            label="Status"
            fullWidth
            margin="dense"
            value={newEvent.status}
            onChange={handleCreateChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleCreateSave} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
