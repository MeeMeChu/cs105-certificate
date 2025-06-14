"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";
import {
  Box,
  Button,
  Grid2 as Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Pagination,
  Stack,
  Divider,
} from "@mui/material";
import AddCircle from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { api } from "@lib/axios-config";
import { Signature } from "@type/signature";
import dayjs from "dayjs";

const SignaturePage = () => {
  const router = useRouter();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    signature: Signature | null;
  }>({
    open: false,
    signature: null,
  });

  useEffect(() => {
    fetchSignatures();
  }, []);

  const fetchSignatures = async (page: number = 1, limit: number = itemsPerPage) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/signatures?page=${page}&limit=${limit}`
      );
      setSignatures(response.data.data);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error: any) {
      console.error("Error fetching signatures:", error);
      setError("Failed to load signatures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignatures(currentPage, itemsPerPage);
  }, []);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    fetchSignatures(value, itemsPerPage);
  };


  const handleDelete = async (signature: Signature) => {
    try {
      await api.delete(`/signatures/${signature.id}`);
      // Refresh current page after deletion
      fetchSignatures(currentPage);
      setDeleteDialog({ open: false, signature: null });
    } catch (error: any) {
      console.error("Error deleting signature:", error);
      setError("Failed to delete signature");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 8, md: 9 }}>
          <Typography variant="h5" fontWeight="bold">
            Signatures Managements
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
            onClick={() => router.push("signature/create")}
          >
            Create Signature
          </Button>
        </Grid>
        <Grid size={12}>
          <NavbarBreadcrumbLayout
            pages={[
              { title: "Dashboard", path: "/admin/dashboard" },
              { title: "Signatures" },
            ]}
          />
        </Grid>

        {error && (
          <Grid size={12}>
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          </Grid>
        )}

        <Grid size={12}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : signatures.length === 0 ? (
            <Card
              sx={{
                p: 4,
                textAlign: "center",
                boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No signatures found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Click "Create Signature" to add your first signature
              </Typography>
            </Card>
          ) : (
            <>
              <Grid container spacing={3}>
                {signatures.map((signature) => (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    key={signature.id}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                      }}
                    >
                      <Box
                        component="img"
                        src={signature.path}
                        alt={signature.firstName}
                        sx={{ 
                          height: 160,
                          objectFit: "contain", 
                          p: 1,
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" noWrap>
                          {signature.firstName} {signature.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Created:{" "}
                          {dayjs(signature.createdAt).format("DD/MM/YYYY")}
                        </Typography>
                      </CardContent>
                      <CardActions
                        sx={{ justifyContent: "space-evenly", px: 2 }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            window.open(
                              `${signature.path}`,
                              "_blank"
                            )
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setDeleteDialog({ open: true, signature })
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={3} alignItems="center">
                  {/* Pagination Controls */}
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontSize: '1rem',
                      },
                      '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  />
                </Stack>
              </Box>
            </>
          )}
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, signature: null })}
      >
        <DialogTitle>Delete Signature</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "
            {deleteDialog.signature?.firstName}{" "}
            {deleteDialog.signature?.lastName}" ?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, signature: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              deleteDialog.signature && handleDelete(deleteDialog.signature)
            }
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignaturePage;
