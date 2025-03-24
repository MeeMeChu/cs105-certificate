"use client";

import { Fragment, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddCircle from "@mui/icons-material/AddCircle";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

import { api } from "@lib/axios-config";
import { User } from "@type/user";
import SkeletonTable from "@components/loading/skelete-table";
import {
  Box,
  Button,
  Grid2 as Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

const columns: GridColDef<User>[] = [
  { field: "id", headerName: "หมายเลขผู้ใช้งาน", width: 250 },
  { field: "firstName", headerName: "ชื่อจริง", width: 150 },
  { field: "lastName", headerName: "นามสกุล", width: 150 },
  {
    field: "fullName",
    headerName: "ชื่อเต็ม",
    sortable: false,
    width: 160,
    valueGetter: (value: any, row: { firstName: any; lastName: any }) =>
      `${row.firstName || ""} ${row.lastName || ""}`,
  },
  { field: "email", headerName: "อีเมล", width: 250 },
  { field: "role", headerName: "ตำแหน่ง", width: 150 },
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
            onClick={() => {}}
            color="inherit"
          />
        </Tooltip>,
        <Tooltip key={1} title="ลบผู้ใช้งาน">
          <GridActionsCellItem
            key={1}
            icon={<DeleteIcon color="primary" />}
            label="Transaction"
            onClick={() => {}}
            color="inherit"
          />
        </Tooltip>,
      ];
    },
  },
];

export default function UserPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredRows, setFilteredRows] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = filteredRows.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
    setFilteredRows(filtered);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users`);
        setFilteredRows(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users : ", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Fragment>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 8, md: 9 }}>
            <Typography variant="h5" fontWeight="bold">Users Managements</Typography>
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
              onClick={() => router.push("user/create")}
            >
              Create User
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
        )}
      </Box>
    </Fragment>
  );
}
