"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddCircle from "@mui/icons-material/AddCircle";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

import { api } from "@lib/axios-config";
import { Certificate } from "@type/certificate";
import SkeletonTable from "@components/loading/skelete-table";
import {
  Alert,
  Box,
  Button,
  Grid2 as Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import DialogPopup from "@components/dialog-popup";
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";

export default function CertificatePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialogRemove, setOpenDialogRemove] = useState<boolean>(false);
    const [selectId, setSelectId] = useState<string>("");

    const handleDelete = useCallback(async () => {
        try {
          await api.delete(`/Certificates/${selectId}`);
          setFilteredCertificates ((prevCertificates) => prevCertificates.filter((Certificates) => Certificates.id !== selectId));
        } catch (e) {
          console.error("Error : ", e);
        }
      }, [selectId]);
    
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = filteredCertificates.filter(
            (Certificate) =>
              Certificate.id.toLowerCase().includes(query) ||
              Certificate.eventId.toLowerCase().includes(query) ||
              Certificate.name.toLowerCase().includes(query) ||
              Certificate.templatePath.toLowerCase().includes(query) ||
              Certificate.outputPath.toLowerCase().includes(query) 
          );
          setFilteredCertificates(filtered);
      };
      const columns: GridColDef<Certificates>[] = [
          { field: "id", headerName: "ประกาศนียบัตร", width: 250 },
          { field: "firstName", headerName: "ชื่อจริง", width: 150 },
          { field: "templatePath", headerName: "เทมเพส", width: 250 },
          { field: "OutputPath", headerName: "เทมเพสที่ออกมา", width: 150 },
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
                      router.push(`certificates/update/${params?.row?.id}`)
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
                setFilteredCertificates(response.data);
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
                    <Typography variant="h5" fontWeight="bold">Certificates Managements</Typography>
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
                      onClick={() => router.push("Certificate/create")}
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
                  </Fragment>
                )}
              </Box>
            </Fragment>
          );
}



