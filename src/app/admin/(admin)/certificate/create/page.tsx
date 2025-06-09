"use client";

import axios from "axios";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  styled,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";

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

const CreateCertificate = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

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
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/v1/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!uploadResult) {
      await handleUpload();
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold">
              Create a new certificate
            </Typography>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Certificate", path: "/admin/certificate" },
                { title: "New Certificate" },
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
                      Upload Certificate Template
                    </Typography>
                  </Grid>
                  
                  <Grid size={12}>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploading}
                      sx={{ mb: 2 }}
                    >
                      {uploading ? "Uploading..." : "Choose File"}
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,.pdf,application/pdf"
                      />
                    </Button>
                    
                    {file && (
                      <Typography variant="body2" color="text.secondary">
                        Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    )}
                  </Grid>

                  {previewUrl && (
                    <Grid size={12}>
                      <Card sx={{ maxWidth: 400 }}>
                        {file?.type.startsWith('image/') ? (
                          <CardMedia
                            component="img"
                            height="200"
                            image={previewUrl}
                            alt="Preview"
                            sx={{ objectFit: "contain" }}
                          />
                        ) : file?.type === 'application/pdf' ? (
                          <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                              PDF Preview
                            </Typography>
                            <iframe
                              src={previewUrl}
                              width="100%"
                              height="300"
                              style={{ border: 'none' }}
                              title="PDF Preview"
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {file.name}
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body1">
                              File selected: {file?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Preview not available for this file type
                            </Typography>
                          </Box>
                        )}
                      </Card>
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
                      <Alert 
                        severity="success" 
                        icon={<CheckCircleIcon />}
                      >
                        File uploaded successfully!
                        <br />
                        <strong>URL:</strong> {uploadResult.url}
                        <br />
                        <strong>Size:</strong> {(uploadResult.size / 1024 / 1024).toFixed(2)} MB
                        <br />
                        <strong>Type:</strong> {uploadResult.type}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateCertificate;
