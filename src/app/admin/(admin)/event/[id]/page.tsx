"use client";

import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Chip, Grid2 as Grid, InputAdornment, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";

import { api,apiDownload } from "@lib/axios-config";
import SkeletonTable from "@components/loading/skelete-table";

export default function DataGridDemo() {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [eventName, setEventName] = useState<string>("");
  const [participants, setParticipants] = useState<any[]>([]); // สำหรับเก็บข้อมูลผู้เข้าร่วม
  const [openSnackbar, setOpenSnackbar] = useState(false); // สถานะของ Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // ข้อความของ Snackbar
  const [loading, setLoading] = useState<boolean>(false);

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
      setLoading(true);
      const response = await api.get(`/enroll/${eventId}`);
      const eventResponse = await api.get(`/events/${eventId}`)
      setEventName(eventResponse.data.title);
      setParticipants(response.data);
      setFilteredRows(response.data); // กรองข้อมูลหลังจากดึงมา
      setLoading(false);
    } catch (error) {
      console.error("Error fetching participants:", error);
      setLoading(false);
    }
  };

  // เรียก API เมื่อ eventId เปลี่ยนแปลง
  useEffect(() => {
    if (id) {
      fetchParticipants(id); // ดึงข้อมูลผู้เข้าร่วมของ event ที่เลือก
    }
  }, [id]);

  // ฟังก์ชันสำหรับส่งเกียรติบัตรทั้งหมด
  const handleSendCertificates = async () => {
    if (!window.confirm("Are you sure you want to send this certificates?")) return;

    try {
      // ส่งคำขอให้ส่งเกียรติบัตรทั้งหมด
      await api.post(`/certificate/${id}`);
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
  const columns: GridColDef[] = [
    { field: "firstName", headerName: "ชื่อจริง", width: 200},
    { field: "lastName", headerName: "นามสกุล", width: 200},
    { field: "email", headerName: "อีเมล", width: 250},
    { 
      field: "year", 
      headerName: "ชั้นปี", 
      width: 100, 
    },
    { 
      field: "schoolName", 
      headerName: "โรงเรียน", 
      width: 250, 
    },
    { 
      field: "checkedIn", 
      headerName: "ลงทะเบียน", 
      width: 150, 
      renderCell(param) {
        return (
          <Box
            sx={{
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {param?.row?.publish ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CancelIcon sx={{ color: red[500] }} />
            )}
          </Box>
        );
      },
    },
    { 
      field: "registrationDate", 
      headerName: "วันที่ลงทะเบียน", 
      width: 150, 
      renderCell(params) {
        return <>{dayjs(params?.row?.registrationDate).format("DD/MM/YYYY")}</>;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 180,
      getActions: (params) => {
        return [
          <Tooltip key={1} title="ดาวห์โหลด Certificate">
            <GridActionsCellItem
              key={1}
              icon={<DownloadIcon color="primary" />}
              label="Download Certificate"
              onClick={() => handleDownloadCertificate(String(params.row.id),params.row.firstName+params.row.lastName)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip key={2} title="แก้ไขข้อมูล">
            <GridActionsCellItem
              key={2}
              icon={<EditIcon color="primary" />}
              label="Update registration"
              onClick={() => {}}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip key={3} title="ลบข้อมูล">
            <GridActionsCellItem
              key={3}
              icon={<DeleteIcon color="primary" />}
              label="Delete registration"
              onClick={() => {}}
              color="inherit"
            />
          </Tooltip>,
        ];
      },
    },
  ];

  return (
    <Fragment>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 8, md: 9 }}>
            <Typography variant="h5" fontWeight="bold">Events Name: {eventName}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                color: "white",
                boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
              }}
              startIcon={<EmojiEventsIcon />}
              onClick={handleSendCertificates}
            >
              Send Certificate All
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
          <>
            {filteredRows.length > 0 ? (
              <DataGrid
                rows={filteredRows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[10, 20, 30]}
                disableRowSelectionOnClick
              />
            ) : (
              <Grid size={12}>
                <Alert severity="warning">ไม่มีข้อมูลผู้เข้าร่วมกิจกรรม</Alert>
              </Grid>
            )}
          </>
          
        )}

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
      </Box>
    </Fragment>
  );
}
