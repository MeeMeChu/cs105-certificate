"use client";

import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddCircle from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

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
      await api.delete(`/certificates/${selectId}`);
      setCertificates((prevCertificates) =>
        prevCertificates.filter((certificate) => certificate.id !== selectId)
      );
      setOpenDialogRemove(false);
    } catch (e) {
      console.error("Error : ", e);
    }
  }, [selectId]);

  const filteredCertificates = useMemo(() => {
    const { searchTerm } = viewState;
    
    if (!searchTerm) return certificates;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    return certificates.filter((cer) => {
      // ค้นหาจาก id, path และข้อมูลอื่นๆ
      const basicInfoMatch = Object.entries(cer)
        .filter(([key, val]) => typeof val === 'string') // เฉพาะค่าที่เป็น string
        .some(([key, val]) => val.toLowerCase().includes(searchTermLower));
      
      // ค้นหาจาก event.title
      const eventTitleMatch = cer.event?.title?.toLowerCase().includes(searchTermLower);
      
      return basicInfoMatch || eventTitleMatch;
    });
  }, [viewState.searchTerm, certificates]);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/certificates`);
        setCertificates(response.data.data || response.data);
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
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8, md: 9 }}>
            <Typography variant="h5" fontWeight="bold">
              Certificates Management
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
              Create Certificate
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
              <Box>
                {/* Certificates Grid */}
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  {filteredCertificates.map((certificate) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={certificate.id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            height: 250,
                            overflow: "hidden",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelectedImage(
                              certificate.templateUrl || certificate.templatePath || ""
                            );
                            setOpenImageModal(true);
                          }}
                        >
                          <Box
                            component="img"
                            src={certificate.templateUrl || certificate.templatePath}
                            alt={certificate.event?.title || "Certificate Template"}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease-in-out",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0,0,0,0.1)",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              "&:hover": {
                                opacity: 1,
                              },
                            }}
                          >
                            <IconButton
                              color="primary"
                              sx={{
                                backgroundColor: "rgba(255,255,255,0.9)",
                                "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Typography
                            variant="h6"
                            component="h3"
                            gutterBottom
                            noWrap
                            sx={{
                              fontWeight: "bold",
                            }}
                          >
                            {certificate.event?.title || "ไม่มีชื่อกิจกรรม"}
                          </Typography>

                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <CalendarTodayIcon
                              sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              สร้างเมื่อ:{" "}
                              {new Date(certificate.createdAt).toLocaleDateString("th-TH")}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              mb: 1,
                            }}
                          >
                            ID: {certificate.id}
                          </Typography>

                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Chip
                              label={`${certificate.positions?.length || 0} ตำแหน่ง`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            {certificate.templateUrl && (
                              <Chip
                                label="มีรูปภาพ"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </CardContent>

                        <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
                          <Box>
                            <Tooltip title="ดูรูปภาพ">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                  setSelectedImage(
                                    certificate.templateUrl || certificate.templatePath || ""
                                  );
                                  setOpenImageModal(true);
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>

                          <Box>
                            <Tooltip title="แก้ไข">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                  router.push(`certificate/update/${certificate.id}`);
                                }}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="ลบ">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSelectId(certificate.id);
                                  setOpenDialogRemove(true);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Grid size={12}>
                <Alert severity="warning">
                  {viewState.searchTerm
                    ? `ไม่พบผลการค้นหาสำหรับ "${viewState.searchTerm}"`
                    : "ไม่มีข้อมูลใบประกาศนียบัตร"}
                </Alert>
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
                  {selectedImage ? (
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
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      ไม่สามารถแสดงรูปภาพได้
                    </Typography>
                  )}
                </Box>
              </DialogContent>
            </Dialog>
          </Fragment>
        )}
      </Box>
    </Fragment>
  );
}
