"use client";

import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Grid2 as Grid, InputAdornment, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SearchIcon from "@mui/icons-material/Search";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";

import { api, apiDownload } from "@lib/axios-config";
import SkeletonTable from "@components/loading/skelete-table";
import DialogPopup from "@components/dialog-popup";
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";
import AlertBar from "@components/alert-bar";

export default function RegistrationPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [eventName, setEventName] = useState<string>("");
  const [eventId, setEventId] = useState<string>("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [openDialogRemove, setOpenDialogRemove] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [viewState, setViewState] = useState({
    searchTerm: "",
  });
  const [dialog, setDialog] = useState<AlertBar>({
    open: false,
    title: "",
    content: "",
    severity: "info",
  });

  const handleDelete = useCallback(async () => {
    try {
      await api.delete(`/events/${selectId}`);
      setParticipants((prevData) =>
        prevData.filter((event) => event.id !== selectId)
      );
    } catch (e) {
      console.error("Error : ", e);
    }
  }, [selectId]);

  // เมื่อมีการค้นหา
  const filteredUsers = useMemo(() => {
    const { searchTerm } = viewState;

    return participants.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [viewState, participants]);

  // ฟังก์ชันสำหรับดึงข้อมูลผู้เข้าร่วมจาก API
  const fetchParticipants = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/enroll/${eventId}`);
      setEventName(response.data[0].event.title);
      setEventId(response.data[0].event.id);
      setParticipants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching participants:", error);
      setLoading(false);
    }
  };

  // เรียก API เมื่อ eventId เปลี่ยนแปลง
  useEffect(() => {
    if (slug) {
      fetchParticipants(slug); // ดึงข้อมูลผู้เข้าร่วมของ event ที่เลือก
    }
  }, [slug]);

  // ฟังก์ชันสำหรับส่งเกียรติบัตรทั้งหมด
  const handleSendCertificates = async () => {
    if (!window.confirm("Are you sure you want to send this certificates?"))
      return;

    try {
      // ส่งคำขอให้ส่งเกียรติบัตรทั้งหมด
      await api.post(`/certificates/sends`, {
        eventId: eventId,
      });
      setDialog({
        open: true,
        title: "Success",
        content: "Certificates sent successfully to all participants!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error sending certificates:", error);
      setDialog({
        open: true,
        title: "Error",
        content: "Failed to send certificates. Please try again.",
        severity: "error",
      });
    }
  };

  const handleSendCertificateByRegId = async (
    eventId: string,
    regId: string
  ) => {
    try {
      // ส่งคำขอให้ส่งเกียรติบัตรทั้งหมด
      await api.post(`/certificates/event/${eventId}/send/${regId}`);
      setDialog({
        open: true,
        title: "Success",
        content: "Certificates sent successfully to participants!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error sending certificates:", error);
      setDialog({
        open: true,
        title: "Error",
        content: "Failed to send certificate by user. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDownloadCertificate = async (
    eventId: string,
    regId: string,
    fullName: string
  ) => {
    try {
      const response = await apiDownload.get(
        `/certificates/event/${eventId}/send/${regId}`
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${fullName}.pdf`);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setDialog({
        open: true,
        title: "Success",
        content: "Certificate Downloaded!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error download certificates:", error);
      setDialog({
        open: true,
        title: "Error",
        content: "Failed to download certificates. Please try again.",
        severity: "error",
      });
    }
  };

  const columns: GridColDef[] = [
    { field: "firstName", headerName: "ชื่อจริง", width: 200 },
    { field: "lastName", headerName: "นามสกุล", width: 200 },
    { field: "email", headerName: "อีเมล", width: 250 },
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
            {param?.row?.checkedIn ? (
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
              onClick={() =>
                handleDownloadCertificate(
                  params?.row?.eventId,
                  params?.row?.id,
                  params?.row?.firstName + params?.row?.lastName
                )
              }
              color="inherit"
            />
          </Tooltip>,
          <Tooltip key={2} title="ส่งเกียรติบัตร">
            <GridActionsCellItem
              key={2}
              icon={<EmojiEventsIcon color="primary" />}
              label="Send Certificate"
              onClick={() =>
                handleSendCertificateByRegId(
                  params?.row?.eventId,
                  params?.row?.id
                )
              }
              color="inherit"
            />
          </Tooltip>,
          <Tooltip key={3} title="แก้ไขข้อมูล">
            <GridActionsCellItem
              key={3}
              icon={<EditIcon color="primary" />}
              label="Update registration"
              onClick={() => {
                router.push(`${slug}/update/${params?.row?.id}`);
              }}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip key={4} title="ลบข้อมูล">
            <GridActionsCellItem
              key={4}
              icon={<DeleteIcon color="primary" />}
              label="Delete registration"
              onClick={() => {
                setSelectId(params?.row?.id);
                setOpenDialogRemove(true);
              }}
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
            <Typography variant="h5" fontWeight="bold">
              ชื่อกิจกรรม: {eventName}
            </Typography>
            <Typography variant="subtitle1">
              รายชื่อผู้สมัครเข้าร่วมกิจกรรม
            </Typography>
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
              disabled={eventId === ""}
            >
              Send Certificate All
            </Button>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Events", path: "/admin/event" },
                { title: "Registration" },
              ]}
            />
          </Grid>
        </Grid>

        <TextField
          label="Search users"
          variant="outlined"
          value={viewState.searchTerm}
          onChange={(e) =>
            setViewState((prev) => ({ ...prev, searchTerm: e.target.value }))
          }
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
            {filteredUsers.length > 0 ? (
              <DataGrid
                rows={filteredUsers}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
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

            <DialogPopup
              title="คุณแน่ใจ?"
              body="คุณแน่ใจมั้ยที่จะลบข้อมูลที่คุณเลือก คุณจะไม่สามารถที่กู้คืนข้อมูลที่ลบได้!"
              open={openDialogRemove}
              setOpen={setOpenDialogRemove}
              onClickFunction={handleDelete}
            />
          </>
        )}
        <AlertBar
          dialog={dialog}
          setDialog={setDialog}
          position={{
            vertical: "bottom",
            horizontal: "left",
          }}
        />
      </Box>
    </Fragment>
  );
}
