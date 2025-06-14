"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import {
  Box,
  Container,
  Grid2 as Grid,
  TextField,
  Typography,
  Button,
  styled,
  Alert,
  CircularProgress,
  Card,
  CardMedia
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";
import { api } from "@lib/axios-config";
import { IconButton } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CreateSignaturePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError("");
    setUploadResult(null);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a signature file first");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await api.post("/file/upload", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadResult(response.data);
        console.log("Upload successful:", response.data);
      } else {
        setError(response.data.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.error || "Upload failed. Please try again.";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!uploadResult) {
      await handleUpload();
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please fill in both first name and last name");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const signatureData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        path: uploadResult.url
      };

      const response = await api.post("/signatures", signatureData);

      if (response.status === 201) {
        router.push("/admin/signature");
      }
    } catch (error: any) {
      console.error("Error creating signature:", error);
      setError("Failed to create signature. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold">
              Create a new signature
            </Typography>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Signatures", path: "/admin/signature" },
                { title: "New signature" },
              ]}
            />
          </Grid>
          <Grid size={12}>
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
              }}
            >
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      Upload Signature
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      name="firstName"
                      label="ชื่อจริง"
                      fullWidth
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      name="lastName"
                      label="นามสกุล"
                      fullWidth
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4}}>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploading}
                      fullWidth
                      sx={{
                        height: "100%",
                        color: "white",
                        textTransform: "none",
                        boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                      }}
                    >
                      {uploading ? "Uploading..." : "Choose Signature File"}
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </Button>
                  </Grid>

                  {file && (
                    <Grid size={12}>
                      <Typography variant="body2" color="text.secondary">
                        Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    </Grid>
                  )}

                  {previewUrl && (
                    <Grid size={12}>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: 300,
                          overflow: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border: "2px dashed #aaa",
                          backgroundColor: "#f8f8f8",
                          mt: 1,
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          component="img"
                          src={previewUrl}
                          alt="Signature Preview"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            m: 1,
                            backgroundColor: "rgba(255,255,255,0.8)",
                          }}
                          onClick={() => {
                            setFile(null);
                            setPreviewUrl("");
                            setUploadResult(null);
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 32 }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  )}

                  {file && !uploadResult && (
                    <Grid size={12}>
                      <Button
                        variant="outlined"
                        onClick={handleUpload}
                        disabled={uploading}
                        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                      >
                        {uploading ? "Uploading..." : "Upload File"}
                      </Button>
                    </Grid>
                  )}

                  {error && (
                    <Grid size={12}>
                      <Alert severity="error">{error}</Alert>
                    </Grid>
                  )}

                  {uploadResult && (
                    <Grid size={12}>
                      <Alert severity="success">
                        File uploaded successfully! You can now save the signature.
                      </Alert>
                    </Grid>
                  )}

                  <Grid size={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Button
                        onClick={() => router.push("/admin/signature")}
                        color="primary"
                        sx={{
                          textTransform: "none",
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        disabled={!uploadResult || submitting}
                        startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{
                          color: "white",
                          textTransform: "none",
                          boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                        }}
                      >
                        {submitting ? "Creating..." : "Create Signature"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateSignaturePage;
