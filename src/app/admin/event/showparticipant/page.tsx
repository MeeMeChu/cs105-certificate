"use client";

import Layout from "../../../../components/admin/Layout";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

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
  {
    field: "actions",
    headerName: "Actions",
    width: 180,
    renderCell: (params) => (
      <Box>
        <Button
          variant="contained"
          sx={(theme) => ({
            backgroundColor: theme.palette.mode === "dark" ? "white" : "blue",
            color: theme.palette.mode === "dark" ? "black" : "white",
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark" ? "#ddd" : "#407cc9",
            },
          })}
          startIcon={<EmojiEventsIcon />}
        >
          Certificate
        </Button>
      </Box>
    ),
  },


];

const eventName = "Cyber101";


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
  {
    id: 3,
    firstName: "test3",
    lastName: "test3",
    email: "test3@example.com",
    password: "54321",
    role: "member",
    createdAt: "2024-03-18",
    updatedAt: "2024-03-18",

  },
  {
    id: 4,
    firstName: "test4",
    lastName: "test4",
    email: "test3@example.com",
    password: "54321",
    role: "member",
    createdAt: "2024-03-18",
    updatedAt: "2024-03-18",

  },
  {
    id: 5,
    firstName: "test5",
    lastName: "test5",
    email: "test5@example.com",
    password: "54321",
    role: "member",
    createdAt: "2024-03-18",
    updatedAt: "2024-03-18",

  },
  {
    id: 6,
    firstName: "test6",
    lastName: "test6",
    email: "test5@example.com",
    password: "54321",
    role: "member",
    createdAt: "2024-03-18",
    updatedAt: "2024-03-18",

  },
];

export default function DataGridDemo() {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [filteredRows, setFilteredRows] = React.useState<User[]>(initialRows);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);


    const filtered = initialRows.filter((user) =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
    setFilteredRows(filtered);
  };

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Events Name : {eventName}
        </Typography>
        <Button
          variant="contained"
          sx={(theme) => ({
            backgroundColor: theme.palette.mode === "dark" ? "white" : "green",
            color: theme.palette.mode === "dark" ? "black" : "white",
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark" ? "#ddd" : "#0f7a0f",
            },
          })}
          startIcon={<EmojiEventsIcon />}
        >
          Send Certificate All
        </Button>
      </Box>

      <TextField
        label="Search Participants"
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
    </Layout>
  );
}
