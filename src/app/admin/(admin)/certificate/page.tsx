"use client";

import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddCircle from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";

import { api } from "@lib/axios-config";
import { Certificate } from "@type/certificate";
import SkeletonTable from "@components/loading/skelete-table";
import DialogPopup from "@components/dialog-popup";
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";

export default function CertificatePage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialogRemove, setOpenDialogRemove] = useState<boolean>(false);
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectId, setSelectId] = useState<string>("");
  const [viewState, setViewState] = useState({
    searchTerm: "",
  });

  const handleDelete = useCallback(async () => {
    try {
      // await api.delete(`/Certificates/${selectId}`);
      setCertificates((prevCertificates) =>
        prevCertificates.filter((Certificates) => Certificates.id !== selectId)
      );
    } catch (e) {
      console.error("Error : ", e);
    }
  }, [selectId]);

  const filteredCertificates = useMemo(() => {
    const { searchTerm } = viewState;

    return certificates.filter((cer) =>
      Object.values(cer)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [viewState, certificates]);

  const columns: GridColDef<Certificate>[] = [
    {
      field: "image",
      headerName: "รูปภาพ",
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={params?.row?.templateUrl || params?.row?.templatePath}
          alt={params?.row?.event?.title || "Certificate"}
          variant="rounded"
          sx={{
            mt: 0.5,
            width: 60,
            height: 40,
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
          }}
          onClick={() => {
            setSelectedImage(
              params?.row?.templateUrl || params?.row?.templatePath || ""
            );
            setOpenImageModal(true);
          }}
        />
      ),
      sortable: false,
      filterable: false,
    },
    { field: "id", headerName: "ประกาศนียบัตร", width: 150 },
    {
      field: "name",
      headerName: "ชื่อกิจกรรม",
      width: 250,
      renderCell: (params) => {
        return <>{params?.row?.event?.title}</>;
      },
    },
    { field: "templatePath", headerName: "เทมเพส", width: 250 },
    { field: "templateUrl", headerName: "เทมเพสที่ออกมา", width: 150 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => {
        return [
          <Tooltip key={1} title="แก้ไขผู้ใช้งาน">
            <GridActionsCellItem
              key={1}
              icon={<EditIcon color="primary" />}
              label="Transaction"
              onClick={() => {
                router.push(`certificates/update/${params?.row?.id}`);
              }}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip key={1} title="ลบผู้ใช้งาน">
            <GridActionsCellItem
              key={1}
              icon={<DeleteIcon color="primary" />}
              label="Transaction"
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

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/certificates`);
        setCertificates(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching certificates : ", error);
        setLoading(false);
      }
    };

    fetchCertificate();
  }, []);

  return (
    <Fragment>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 8, md: 9 }}>
            <Typography variant="h5" fontWeight="bold">
              Certificates Managements
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
              startIcon={<AddCircle />}
              onClick={() => router.push("certificate/create")}
            >
              Create Certificates
            </Button>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Certificates" },
              ]}
            />
          </Grid>
        </Grid>

        <TextField
          label="Search certificates"
          variant="outlined"
          value={viewState?.searchTerm}
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
          <Fragment>
            {filteredCertificates.length > 0 ? (
              <DataGrid
                rows={filteredCertificates}
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
                <Alert severity="warning">ไม่มีข้อมูลผู้ใช้งาน</Alert>
              </Grid>
            )}

            <DialogPopup
              title="คุณแน่ใจ?"
              body="คุณแน่ใจมั้ยที่จะลบข้อมูลที่คุณเลือก คุณจะไม่สามารถที่กู้คืนข้อมูลที่ลบได้!"
              open={openDialogRemove}
              setOpen={setOpenDialogRemove}
              onClickFunction={handleDelete}
            />

            <Dialog
              open={openImageModal}
              onClose={() => setOpenImageModal(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                ดูรูปภาพใบประกาศนียบัตร
                <IconButton onClick={() => setOpenImageModal(false)}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <img
                    src={selectedImage}
                    alt="Certificate Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "70vh",
                      objectFit: "contain",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>
              </DialogContent>
            </Dialog>
          </Fragment>
        )}
      </Box>
    </Fragment>
  );
}
