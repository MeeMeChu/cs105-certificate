"use client";

import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useParams, useSearchParams } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { api,apiDownload } from "@lib/axios-config";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}


export default function DataGridDemo() {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredRows, setFilteredRows] = useState<User[]>([]);
  const [participants, setParticipants] = useState<User[]>([]); // สำหรับเก็บข้อมูลผู้เข้าร่วม
  const [openSnackbar, setOpenSnackbar] = useState(false); // สถานะของ Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // ข้อความของ Snackbar

  // เมื่อมีการค้นหา
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = participants.filter((user) =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
    setFilteredRows(filtered);
  };

  // ฟังก์ชันสำหรับดึงข้อมูลผู้เข้าร่วมจาก API
  const fetchParticipants = async (eventId: string) => {
    try {
      const response = await api.get(`/enroll/${eventId}`);
      setParticipants(response.data);
      setFilteredRows(response.data); // กรองข้อมูลหลังจากดึงมา
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  // เรียก API เมื่อ eventId เปลี่ยนแปลง
  useEffect(() => {
    if (id) {
      fetchParticipants(id); // ดึงข้อมูลผู้เข้าร่วมของ event ที่เลือก
    }
  }, [id]);

  // ฟังก์ชันสำหรับส่งเกียรติบัตรทั้งหมด
  const handleSendAllCertificates = async () => {
    try {
      // ส่งคำขอให้ส่งเกียรติบัตรทั้งหมด
      await api.post(`/certificate`,{
        eventId: id
      });
      setSnackbarMessage("Certificates sent successfully to all participants!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error sending certificates:", error);
      setSnackbarMessage("Failed to send certificates. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleSendCertificate = async (id:String) => {
    try {
      // ส่งคำขอให้ส่งเกียรติบัตรทั้งหมด
      await api.post(`/certificate/${id}`,{
        id
      });
      setSnackbarMessage("Certificates sent successfully to all participants!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error sending certificates:", error);
      setSnackbarMessage("Failed to send certificates. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleDownloadCertificate = async (id:string,fullName:string) => {
    try {
      const response = await apiDownload.get(`/certificate/${id}`);
      
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
     
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${fullName}.pdf`);
      document.body.appendChild(link);
      link.click();
      
     
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setSnackbarMessage("Certificate Downloaded!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error sending certificates:", error);
      setSnackbarMessage("Failed to send certificates. Please try again.");
      setOpenSnackbar(true);
    }
  };
  const columns: GridColDef<User>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "firstName", headerName: "First Name", width: 110, editable: true },
    { field: "lastName", headerName: "Last Name", width: 180, editable: true },
    { field: "email", headerName: "Email", width: 180, editable: true },
    { field: "registrationDate", headerName: "Register At", width: 180, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            sx={(theme) => ({
              backgroundColor: theme.palette.mode === "dark" ? "white" : "blue",
              color: theme.palette.mode === "dark" ? "black" : "white",
              "&:hover": {
                backgroundColor: theme.palette.mode === "dark" ? "#ddd" : "#407cc9",
              },
            })}
            startIcon={<EmojiEventsIcon />}
            onClick={() => handleDownloadCertificate(String(params.row.id),params.row.firstName+params.row.lastName)} 
          >
            Dowload Certificate
          </Button>
          <Button
            variant="contained"
            sx={(theme) => ({
              backgroundColor: theme.palette.mode === "dark" ? "white" : "blue",
              color: theme.palette.mode === "dark" ? "black" : "white",
              "&:hover": {
                backgroundColor: theme.palette.mode === "dark" ? "#ddd" : "#407cc9",
              },
            })}
            startIcon={<EmojiEventsIcon />}
            onClick={() => handleSendCertificate(String(params.row.id))}           
          >
            Send Certificates
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Fragment>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Events Name: 
        </Typography>
        <Button
          variant="contained"
          sx={(theme) => ({
            backgroundColor: theme.palette.mode === "dark" ? "white" : "green",
            color: theme.palette.mode === "dark" ? "black" : "white",
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark" ? "#ddd" : "#0f7a0f",
            },
          })}
          startIcon={<EmojiEventsIcon />}
          onClick={() => handleSendAllCertificates()}
        >
          Send Certificate All
        </Button>
      </Box>

      <TextField
        label="Search Participants"
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
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
