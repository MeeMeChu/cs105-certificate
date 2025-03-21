"use client";

import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const columns: GridColDef<User>[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "firstName", headerName: "First Name", width: 110, editable: true },
  { field: "lastName", headerName: "Last Name", width: 180, editable: true },
  { field: "email", headerName: "Email", width: 180, editable: true },
  { field: "password", headerName: "Password", width: 180, editable: true },
  { field: "role", headerName: "Role", width: 180, editable: true },
  { field: "createdAt", headerName: "Created At", width: 180, editable: true },
  { field: "updatedAt", headerName: "Updated At", width: 180, editable: true },
];

const initialRows: User[] = [
  {
    id: 1,
    firstName: "Jon",
    lastName: "Snow",
    email: "jon@example.com",
    password: "12345",
    role: "User",
    createdAt: "2024-03-18",
    updatedAt: "2024-03-18",
  },
  {
    id: 2,
    firstName: "Cersei",
    lastName: "Lannister",
    email: "cersei@example.com",
    password: "54321",
    role: "Admin",
    createdAt: "2024-03-18",
    updatedAt: "2024-03-18",
  },
];

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredRows, setFilteredRows] = useState<User[]>(initialRows);
  const { data: session, status } = useSession();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = initialRows.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
    setFilteredRows(filtered);
  };

  return (
    <>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography variant="h4" gutterBottom>
          Users Management
        </Typography>

        <TextField
          label="Search users"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />
        <Box sx={{ height: 400, width: "100%", mt: 5 }}>
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
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </>
  );
}
