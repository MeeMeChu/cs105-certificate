"use client";

import { useState } from "react";
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
} from "@mui/material";
import { api } from "@lib/axios-config";

interface EnrollmentModalProps {
  eventId: string;
}

export default function EnrollmentModal({ eventId }: EnrollmentModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [year, setYear] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [secretPass, setSecretPass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // ข้อความของ Snackbar

  async function handleSubmit() {
    if (!email || !firstName || !lastName || !year || !schoolName || !secretPass) {
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
      } else {
        
        setSnackbarMessage(res.data.error || "ลงทะเบียนล้มเหลว โปรดลองใหม่");
        setSnackbarOpen(true);
      }
    } catch (error: any) {
      // ถ้ามีข้อผิดพลาดจาก API
  
      const errorMessage = error?.response?.data?.error || "การลงทะเบียนล้มเหลว โปรดลองอีกครั้ง";
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
      console.error("Enroll error:", error);
    } finally {
      setIsSubmitting(false);
    }
  
  
  }

  function resetForm() {
    setEmail("");
    setFirstName("");
    setLastName("");
    setYear("");
    setSchoolName("");
    setSecretPass("");
    setSuccess(false);
  }

  return (
    <>
      <Button variant="contained" color="primary" sx={{ width: "100%" }} onClick={() => setOpen(true)}>
        ลงทะเบียน
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            สมัครเข้าร่วมกิจกรรม
          </Typography>

          <TextField fullWidth label="Email" variant="outlined" type="email" sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField fullWidth label="ชื่อ (ไม่ต้องใส่คำนำหน้า)" variant="outlined" sx={{ mb: 2 }} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <TextField fullWidth label="นามสกุล" variant="outlined" sx={{ mb: 2 }} value={lastName} onChange={(e) => setLastName(e.target.value)} />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="grade-select-label">เลือกชั้นปี</InputLabel>
            <Select labelId="grade-select-label" id="grade-select" value={year} label="เลือกชั้นปี" onChange={(e) => setYear(e.target.value as string)}>
              <MenuItem value="ม.1">ม.1</MenuItem>
              <MenuItem value="ม.2">ม.2</MenuItem>
              <MenuItem value="ม.3">ม.3</MenuItem>
              <MenuItem value="ม.4">ม.4</MenuItem>
              <MenuItem value="ม.5">ม.5</MenuItem>
              <MenuItem value="ม.6">ม.6</MenuItem>
            </Select>
          </FormControl>

          <TextField fullWidth label="โรงเรียน" variant="outlined" sx={{ mb: 2 }} value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
          <TextField fullWidth label="Invitation Code" variant="outlined" sx={{ mb: 2 }} value={secretPass} onChange={(e) => setSecretPass(e.target.value)} />

          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">ลงทะเบียนสำเร็จ!</Typography>}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" color="error" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "กำลังส่ง..." : "Submit"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar สำหรับแจ้งเตือน */}
      <Snackbar 
        open={snackbarOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // ตำแหน่งที่มุมขวาบน
        sx={{
          position: 'fixed', // กำหนดให้เป็นตำแหน่ง fixed
          top: 20,           // ระยะห่างจากด้านบน
          right: 20,         // ระยะห่างจากด้านขวา
          width: '400px',
        }}
        autoHideDuration={3000} 
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={error ? "error" : "success"} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
