"use client";

import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
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
import DialogPopup from "@components/dialog-popup";
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";

export default function EventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [openDialogRemove, setOpenDialogRemove] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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

  const handleDelete = useCallback(async () => {
    try {
      await api.delete(`/events/${selectId}`);
      setFilteredEvents((prevData) => prevData.filter((event) => event.id !== selectId));
    } catch (e) {
      console.error("Error : ", e);
    }
  }, [selectId]);

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
      field: "statusEvent",
      sortable: false,
      headerName: "สถานะกิจกรรม", 
      width: 150,
      renderCell(params) {
        return (
          <Chip
            label={
              dayjs(params?.row?.startDate).isAfter(dayjs()) // ถ้า startDate อยู่ในอนาคต
                ? "กิจกรรมที่จะเกิดขึ้นเร็วๆ นี้"
                : dayjs(params?.row?.endDate).isAfter(dayjs()) // ถ้าอยู่ระหว่าง startDate และ endDate
                ? "กำลังจัดกิจกรรม"
                : "กิจกรรมสิ้นสุดแล้ว"
            }
            variant="outlined"
            color={
              dayjs(params?.row?.startDate).isAfter(dayjs())
                ? "warning" // กิจกรรมในอนาคต → สีเหลือง
                : dayjs(params?.row?.endDate).isAfter(dayjs())
                ? "success" // กิจกรรมกำลังจัด → สีเขียว
                : "error" // กิจกรรมสิ้นสุดแล้ว → สีแดง
            }
          /> 
        );
      }, 
    },
    { 
      field: "status", 
      headerName: "สถานะ", 
      width: 150,
      renderCell(params) {
        // ฟังก์ชันกำหนดสีของ Chip
        const getChipColor = (role: string) => {
          switch (role) {
            case eventStatus.draft:
              return "info";
            case eventStatus.approved:
              return "success";
            default:
              return "default";
          }
        };

        return (
          <Chip
            variant="filled"
            label={params?.row?.status}
            color={getChipColor(params?.row?.status)}
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
              onClick={() => router.push(`event/update/${params?.row?.slug}`)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip key={2} title="ลบกิจกรรม">
            <GridActionsCellItem
              key={2}
              icon={<DeleteIcon color="primary" />}
              label="DeleteEvent"
              onClick={() => {
                setSelectId(params?.row?.id);
                setOpenDialogRemove(true);
              }}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip key={3} title="ผู้เข้าร่วมกิจกรรม">
            <GridActionsCellItem
              key={3}
              icon={<PeopleIcon color="primary" />}
              label="Registrations"
              onClick={() => router.push(`/admin/event/${params?.row?.slug}`)}
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
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Events" },
              ]}
            />
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

        <DialogPopup
          title="คุณแน่ใจ?"
          body="คุณแน่ใจมั้ยที่จะลบข้อมูลที่คุณเลือก คุณจะไม่สามารถที่กู้คืนข้อมูลที่ลบได้!"
          open={openDialogRemove}
          setOpen={setOpenDialogRemove}
          onClickFunction={handleDelete}
        />
      </Box>
    </>
  );
}
