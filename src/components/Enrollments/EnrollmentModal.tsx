"use client";

import { Fragment, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { api } from "@lib/axios-config";

interface EnrollmentModalProps {
  eventId: string | undefined;
}

export default function EnrollmentModal({ eventId }: EnrollmentModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [year, setYear] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [secretPass, setSecretPass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // ข้อความของ Snackbar

  async function handleSubmit() {
    if (
      !email &&
      !firstName &&
      !lastName &&
      !year &&
      !schoolName &&
      !secretPass &&
      !prefix
    ) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      setSnackbarMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
      setSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.post(`/enroll/${eventId}`, {
        email,
        prefix,
        firstName,
        lastName,
        year,
        schoolName,
        secretPass,
      });

      if (res.status === 200) {
        setSuccess(true);
        setSnackbarMessage("ลงทะเบียนสำเร็จ!");
        setSnackbarOpen(true);
        setTimeout(() => {
          setOpen(false);
          resetForm();
        }, 2000);
      }
    } catch (error: any) {
      // ถ้ามีข้อผิดพลาดจาก API

      const errorMessage =
        error?.response?.data?.error || "การลงทะเบียนล้มเหลว โปรดลองอีกครั้ง";
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
      console.error("Enroll error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setEmail("");
    setPrefix("");
    setFirstName("");
    setLastName("");
    setYear("");
    setSchoolName("");
    setSecretPass("");
    setSuccess(false);
  }

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        fullWidth
        sx={{
          boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.3)",
        }}
      >
        ลงทะเบียน
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs">
        <Typography component={DialogTitle} variant="h6" fontWeight="bold">
          สมัครเข้าร่วมกิจกรรม
        </Typography>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            sx={{ my: 1 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            select
            label="คำนำหน้า"
            variant="outlined"
            sx={{ my: 1 }}
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          >
            <MenuItem value="เด็กชาย">เด็กชาย</MenuItem>
            <MenuItem value="เด็กหญิง">เด็กหญิง</MenuItem>
            <MenuItem value="นาย">นาย</MenuItem>
            <MenuItem value="นางสาว">นางสาว</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="ชื่อ (ไม่ต้องใส่คำนำหน้า)"
            variant="outlined"
            sx={{ my: 1 }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            fullWidth
            label="นามสกุล"
            variant="outlined"
            sx={{ my: 1 }}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel id="grade-select-label">เลือกชั้นปี</InputLabel>
            <Select
              labelId="grade-select-label"
              id="grade-select"
              value={year}
              label="เลือกชั้นปี"
              onChange={(e) => setYear(e.target.value as string)}
            >
              <MenuItem value="ม.1">ม.1</MenuItem>
              <MenuItem value="ม.2">ม.2</MenuItem>
              <MenuItem value="ม.3">ม.3</MenuItem>
              <MenuItem value="ม.4">ม.4</MenuItem>
              <MenuItem value="ม.5">ม.5</MenuItem>
              <MenuItem value="ม.6">ม.6</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="โรงเรียน"
            variant="outlined"
            sx={{ my: 1 }}
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Invitation Code"
            variant="outlined"
            sx={{ my: 1 }}
            value={secretPass}
            onChange={(e) => setSecretPass(e.target.value)}
          />
          {error && (
            <Alert severity="error" color="error" sx={{ my: 1 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" color="success" sx={{ my: 1 }}>
              ลงทะเบียนสำเร็จ!
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.3)",
              my: 1,
            }}
          >
            {isSubmitting ? "กำลังส่ง..." : "Submit"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>

      {/* Snackbar สำหรับแจ้งเตือน */}
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // ตำแหน่งที่มุมขวาบน
        sx={{
          position: "fixed", // กำหนดให้เป็นตำแหน่ง fixed
          top: 20, // ระยะห่างจากด้านบน
          right: 20, // ระยะห่างจากด้านขวา
          width: "400px",
        }}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
