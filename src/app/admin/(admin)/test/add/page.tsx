"use client";

import React, { FC, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";
import UploadFiles from "../upload-files";
import { api } from "@/src/lib/axios-config";
import { Fragment } from "react";

type Name = {
  fname: string;
  lname: string;
};
const AddSignature: FC = () => {
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [name, setName] = useState<Name>({ fname: "", lname: "" });

  const handleUpLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const addSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (file && name.fname !== "" && name.lname !== "") {
        data.append("file", file); // Use append instead of set for FormData
        data.append("fname", name.fname);
        data.append("lname", name.lname);

        // Send FormData directly without wrapping it in an object
        const response = await api.post("/testcertificate/signatures", data, {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct Content-Type
          },
        });

        console.log(response.data);
      } else {
        console.error("No file selected or Name is not set");
      }
    } catch (error: any) {
      console.error("Error uploading signature:", error.message);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold">
              Add Signature
            </Typography>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Certificate", path: "/admin/test" },
                { title: "Add Signature" },
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
              <form onSubmit={addSignature}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="ชื่อจริง"
                      fullWidth
                      name="firstName"
                      type="text"
                      value={name.fname}
                      onChange={(e) =>
                        setName({ ...name, fname: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="นามสกุล"
                      fullWidth
                      name="lastName"
                      type="text"
                      value={name.lname}
                      onChange={(e) =>
                        setName({ ...name, lname: e.target.value })
                      }
                    />
                  </Grid>

                  {/* {state.message && (
                    <Grid size={12}>
                      <Alert severity={state.success ? "success" : "error"}>
                        {state.message}
                      </Alert>
                    </Grid>
                  )} */}
                  <UploadFiles handleUpload={handleUpLoad} />
                  {!file ? (
                    <Fragment>
                      <Grid size={12}>
                        <Alert severity="warning">กรุณา upload ลายเซ็นต์</Alert>
                      </Grid>
                    </Fragment>
                  ) : (
                    <Grid size={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                        }}
                      >
                        <Button
                          type="button"
                          onClick={() => router.push("/admin/certificate")}
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
                          sx={{
                            color: "white",
                            textTransform: "none",
                            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AddSignature;
