"use client";

import { useState, useRef, useEffect, MouseEvent, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  styled,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { api } from "@lib/axios-config";
import { Position } from "@type/certificate";
import { Signature } from "@prisma/client";
import { Event } from "@type/event";
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";
import SkeletonTable from "@components/loading/skelete-table";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: "100%",
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UpdateCertificatePage = () => {
  const router = useRouter();
  const params = useParams();
  const certificateId = params.id as string;
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // File upload states
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  // Certificate data
  const [certificate, setCertificate] = useState<any>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [positionId, setPositionId] = useState<number>(1);

  // Canvas size for positioning
  const [actualCanvasSize, setActualCanvasSize] = useState({ width: 595, height: 842 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [previewName, setPreviewName] = useState<string>("สมชาย ใจดี");

  // Fetch certificate data
  useEffect(() => {
    fetchCertificateData();
    fetchSignatures();
    fetchEvents();
  }, [certificateId]);

  const fetchCertificateData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/certificates/${certificateId}`);
      const data = response.data;
      
      setCertificate(data);
      setSelectedEventId(data.eventId);
      setPdfUrl(data.templateUrl);
      
      // Convert positions and set proper IDs
      const convertedPositions = data.positions.map((pos: Position, index: number) => ({
        id: pos.id,
        certificateId: pos.certificateId,
        fontSize: pos.fontSize || 24,
        name: pos.name || (pos.type === 'text' ? `Text ${index}` : `Signature ${index}`),
        x: pos.x,
        y: pos.y,
        type: pos.type,
        width: pos.width || (pos.type === 'signature' ? 100 : 0),
        height: pos.height || (pos.type === 'signature' ? 50 : 0),
        signatureId: pos.signatureId || null,
        createdAt: pos.createdAt,
        updatedAt: pos.updatedAt,
      }));
      setPositions(convertedPositions);
      setPositionId(convertedPositions.length);
      
      if (convertedPositions.length > 0) {
        setSelectedId(data.positions[0].id);
      }
      
      // Set template size
      if (data.templateWidth && data.templateHeight) {
        setActualCanvasSize({ 
          width: data.templateWidth * 0.8, 
          height: data.templateHeight * 0.8 
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching certificate:', error);
      setError('ไม่สามารถดึงข้อมูลใบประกาศได้');
      setLoading(false);
    }
  };

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      const response = await api.get('/signatures');
      setSignatures(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching signatures:', error);
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError("");
    setUploadResult(null);
    
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPdfUrl(url);
      setActualCanvasSize({ width: 595 * 0.8, height: 842 * 0.8 });
    } else {
      if (selectedFile) {
        setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      }
    }
  };

  const handleImageLoad = () => {
    const img = imageRef.current;
    if (img) {
      const displayWidth = img.clientWidth;
      const displayHeight = img.clientHeight;
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      
      const scaleX = displayWidth / originalWidth;
      const scaleY = displayHeight / originalHeight;
      const actualScale = Math.min(scaleX, scaleY);
      
      setActualCanvasSize({ 
        width: displayWidth, 
        height: displayHeight 
      });
      setImageLoaded(true);
      
      // Convert positions from original size to display size if needed
      if (certificate && certificate.templateWidth && certificate.templateHeight) {
        const scaleFactorX = displayWidth / certificate.templateWidth;
        const scaleFactorY = displayHeight / certificate.templateHeight;
        
        setPositions(prev => prev.map(pos => ({
          ...pos,
          x: pos.x * scaleFactorX,
          y: pos.y * scaleFactorY,
        })));
      }
    }
  };

  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging || !imageLoaded) return;
    
    const img = imageRef.current;
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const x = e.clientX - imgRect.left;
    const y = e.clientY - imgRect.top;

    const constrainedX = Math.max(0, Math.min(x, actualCanvasSize.width));
    const constrainedY = Math.max(0, Math.min(y, actualCanvasSize.height));

    updatePosition(selectedId, { x: constrainedX, y: constrainedY });
  };

  const handleMouseDown = (e: React.MouseEvent, positionId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedId(positionId);
    setIsDragging(true);
    
    const img = imageRef.current;
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    const offsetX = e.clientX - imgRect.left - position.x;
    const offsetY = e.clientY - imgRect.top - position.y;
    
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !imageLoaded) return;
    
    const img = imageRef.current;
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const position = positions.find(p => p.id === selectedId);
    if (!position) return;
    
    const x = e.clientX - imgRect.left - dragOffset.x;
    const y = e.clientY - imgRect.top - dragOffset.y;
    
    const constrainedX = Math.max(0, Math.min(x, actualCanvasSize.width));
    const constrainedY = Math.max(0, Math.min(y, actualCanvasSize.height));

    updatePosition(selectedId, { x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleUpload = async () => {
    if (!file) {
      setError("กรุณาเลือกไฟล์ก่อน");
      return;
    }

    setUploading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/file/upload", formData, {
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
        setError(response.data.error || "อัพโหลดไม่สำเร็จ");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.error || "อัพโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const addPosition = (type: 'text' | 'signature') => {
    const newPosition: Position = {
      id: positionId,
      name: type === 'text' ? `Text ${positionId}` : `Signature ${positionId}`,
      x: 100 + (positionId * 20),
      y: 100 + (positionId * 30),
      fontSize: type === 'text' ? 24 : 16,
      type,
      width: type === 'signature' ? 100 : 0,
      height: type === 'signature' ? 50 : 0,
    };
    
    setPositions([...positions, newPosition]);
    setPositionId(positionId + 1);
    setSelectedId(newPosition.id);
  };

  const deletePosition = (id: number) => {
    if (positions.length <= 1) { 
      setError("ต้องมีตำแหน่งอย่างน้อย 1 ตำแหน่ง");
      return;
    }
    
    const filteredPositions = positions.filter(pos => pos.id !== id);
    setPositions(filteredPositions);
    
    if (selectedId === id) {
      setSelectedId(filteredPositions[0]?.id || 0);
    }
  };

  const movePosition = (id: number, direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 10;
    setPositions(prev => prev.map(pos => {
      if (pos.id !== id) return pos;
      
      let newX = pos.x;
      let newY = pos.y;
      
      switch (direction) {
        case 'up':
          newY = Math.max(0, newY - step);
          break;
        case 'down':
          newY = Math.min(actualCanvasSize.height, newY + step);
          break;
        case 'left':
          newX = Math.max(0, newX - step);
          break;
        case 'right':
          newX = Math.min(actualCanvasSize.width, newX + step);
          break;
      }
      
      return { ...pos, x: newX, y: newY };
    }));
  };

  const updatePosition = (id: number, updates: Partial<Position>) => {
    setPositions(prev => prev.map(pos => 
      pos.id === id ? { ...pos, ...updates } : pos
    ));
  };

  const selectedPosition = positions.find(p => p.id === selectedId) || positions[0];

  const getPreviewTextStyle = (position: Position) => {
    const img = imageRef.current;
    if (!img) return {};

    const displayScale = actualCanvasSize.width / (img.naturalWidth || actualCanvasSize.width);
    const fontSize = position.fontSize * displayScale;

    return {
      position: 'absolute' as const,
      left: position.x,
      top: position.y,
      fontSize: `${fontSize}px`,
      fontWeight: 'bold',
      color: '#333',
      transform: 'translate(-50%, -50%)',
      whiteSpace: 'nowrap' as const,
      pointerEvents: 'none' as const,
      zIndex: 15,
      textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
      fontFamily: position.type === 'text' ? 'inherit' : 'monospace'
    };
  };

  const getPreviewSignatureStyle = (position: Position) => {
    const img = imageRef.current;
    if (!img) return {};

    const displayScale = actualCanvasSize.width / (img.naturalWidth || actualCanvasSize.width);
    const width = (position.width || 100) * displayScale;
    const height = (position.height || 50) * displayScale;

    return {
      position: 'absolute' as const,
      left: position.x - (width / 2),
      top: position.y - (height / 2),
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: 'rgba(200, 200, 200, 0.7)',
      border: '2px dashed #666',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      color: '#666',
      pointerEvents: 'none' as const,
      zIndex: 15
    };
  };

  const handleUpdateCertificate = async () => {
    if (!selectedEventId) {
      setError("กรุณาเลือกกิจกรรมสำหรับใบประกาศนี้");
      return;
    }

    try {
      setSaving(true);
      const img = imageRef.current;
      const templateWidth = img?.naturalWidth || certificate?.templateWidth || actualCanvasSize.width;
      const templateHeight = img?.naturalHeight || certificate?.templateHeight || actualCanvasSize.height;

      const updateData = {
        templatePath: uploadResult?.path || certificate?.templatePath,
        templateUrl: uploadResult?.url || certificate?.templateUrl,
        templateWidth: templateWidth,
        templateHeight: templateHeight,
        positions: positions.map(pos => ({
          ...pos,
          x: (pos.x / actualCanvasSize.width) * templateWidth,
          y: (pos.y / actualCanvasSize.height) * templateHeight,
        })),
        eventId: selectedEventId,
      };
      console.log("🚀 ~ handleUpdateCertificate ~ updateData:", updateData)

      const response = await api.put(`/certificates/${certificateId}`, updateData);
      
      if (response.status === 200) {
        router.push('/admin/certificate');
      }
    } catch (error: any) {
      console.error('Error updating certificate:', error);
      setError('ไม่สามารถอัปเดตใบประกาศได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold">
              Update Certificate
            </Typography>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Certificates", path: "/admin/certificate" },
                { title: "Update Certificate" },
              ]}
            />
          </Grid>
          { loading ? (
            <Grid size={12}>
              <SkeletonTable count={1} height={650} />
            </Grid>
          ) : (
            <Grid size={12}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 2,
                  boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                }}
              >
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      แก้ไขใบประกาศ
                    </Typography>
                  </Grid>
                  
                  <Grid size={12}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                        <TextField
                          select
                          fullWidth
                          label="เลือกกิจกรรม"
                          value={selectedEventId}
                          onChange={(e) => setSelectedEventId(e.target.value)}
                          size="small"
                          required
                        >
                          {events.map((event) => (
                            <MenuItem key={event.id} value={event.id}>
                              {event.title}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                          disabled={uploading}
                          fullWidth
                          sx={{ mb: 2, textTransform: 'none' }}
                        >
                          {uploading ? "กำลังอัพโหลด..." : "เปลี่ยนไฟล์รูปภาพ (ไม่บังคับ)"}
                          <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </Button>
                      </Grid>
                    </Grid>
                    
                    {file && (
                      <Typography variant="body2" color="text.secondary">
                        ไฟล์ใหม่ที่เลือก: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    )}
                  </Grid>

                  {error && (
                    <Grid size={12}>
                      <Alert severity="error">{error}</Alert>
                    </Grid>
                  )}

                  {/* Position Editor */}
                  <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      เครื่องมือกำหนดตำแหน่ง
                    </Typography>
                  </Grid>

                  <Grid size={12}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<AddIcon />}
                          onClick={() => addPosition('text')}
                          sx={{ bgcolor: 'primary.main', color: 'white' }}
                        >
                          เพิ่มชื่อ
                        </Button>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2}}>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<AddIcon />}
                          onClick={() => addPosition('signature')}
                          sx={{ bgcolor: 'secondary.main' }}
                        >
                          เพิ่มลายเซ็น
                        </Button>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                        <Button
                          variant={previewMode ? "contained" : "outlined"}
                          fullWidth
                          startIcon={previewMode ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          onClick={() => setPreviewMode(!previewMode)}
                          sx={{ 
                            bgcolor: previewMode ? 'success.main' : 'transparent',
                            color: previewMode ? 'white' : 'success.main',
                            borderColor: 'success.main',
                            '&:hover': {
                              bgcolor: previewMode ? 'success.dark' : 'success.light',
                            }
                          }}
                        >
                          {previewMode ? 'ซ่อน Preview' : 'แสดง Preview'}
                        </Button>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>เลือกตำแหน่ง</InputLabel>
                          <Select
                            label="เลือกตำแหน่ง"
                            value={selectedId}
                            onChange={(e) => setSelectedId(Number(e.target.value))}
                          >
                            {positions.map((pos) => (
                              <MenuItem key={pos.id} value={pos.id}>
                                {pos.name} ({pos.type})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          startIcon={<DeleteIcon />}
                          onClick={() => deletePosition(selectedId)}
                          disabled={positions.length <= 1}
                        >
                          ลบ
                        </Button>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          จำนวน: {positions.length}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  {previewMode && (
                    <Grid size={12}>
                      <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1, mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: 'success.main' }}>
                          🎯 โหมด Preview - ดูตัวอย่างผลลัพธ์
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                              label="ชื่อสำหรับ Preview"
                              value={previewName}
                              onChange={(e) => setPreviewName(e.target.value)}
                              size="small"
                              fullWidth
                              placeholder="ป้อนชื่อเพื่อดูตัวอย่าง"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                            <Typography variant="caption" color="text.secondary">
                              ตัวอย่างจะแสดงข้อความและกรอบลายเซ็นในตำแหน่งที่คุณกำหนด
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  )}

                  {/* Position List */}
                  <Grid size={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        ตำแหน่งที่เลือกทั้งหมด
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {positions.map((pos) => (
                          <Box
                            key={pos.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              border: selectedId === pos.id ? '2px solid #ff4444' : '1px solid #ddd',
                              borderRadius: 1,
                              backgroundColor: selectedId === pos.id ? 'rgba(255,68,68,0.1)' : 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => setSelectedId(pos.id)}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              {pos.type === 'signature' ? '✍️' : '📝'}
                            </Typography>
                            <Typography variant="caption">
                              {pos.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ({Math.round(pos.x)}, {Math.round(pos.y)})
                            </Typography>
                            {positions.length > 1 && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deletePosition(pos.id);
                                }}
                                sx={{ ml: 0.5, p: 0.25 }}
                              >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Position Settings */}
                  {selectedPosition && (
                    <Grid size={12}>
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          แก้ไขตำแหน่งที่เลือก: {selectedPosition?.name}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                              label="ชื่อตำแหน่ง"
                              value={selectedPosition?.name || ""}
                              onChange={(e) => updatePosition(selectedId, { name: e.target.value })}
                              size="small"
                              fullWidth
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                              label="ขนาดตัวอักษร"
                              type="number"
                              value={selectedPosition.fontSize}
                              onChange={(e) => updatePosition(selectedId, { fontSize: Number(e.target.value) })}
                              size="small"
                              fullWidth
                              slotProps={{ 
                                htmlInput: {
                                  min: 8, max: 72 
                                }
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                              label="ตำแหน่ง X"
                              type="number"
                              value={Math.round(selectedPosition.x)}
                              onChange={(e) => {
                                const newX = Number(e.target.value);
                                const constrainedX = Math.max(0, Math.min(newX, actualCanvasSize.width));
                                updatePosition(selectedId, { x: constrainedX });
                              }}
                              size="small"
                              fullWidth
                              slotProps={{
                                htmlInput: {
                                  min: 0,
                                  max: Math.floor(actualCanvasSize.width)
                                }
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                              label="ตำแหน่ง Y"
                              type="number"
                              value={Math.round(selectedPosition.y)}
                              onChange={(e) => {
                                const newY = Number(e.target.value);
                                const constrainedY = Math.max(0, Math.min(newY, actualCanvasSize.height));
                                updatePosition(selectedId, { y: constrainedY });
                              }}
                              size="small"
                              fullWidth
                              slotProps={{
                                htmlInput: {
                                  min: 0,
                                  max: Math.floor(actualCanvasSize.height)
                                }
                              }}
                            />
                          </Grid>
                          {selectedPosition.type === 'signature' && (
                            <>
                              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>เลือกลายเซ็น</InputLabel>
                                  <Select
                                    label="เลือกลายเซ็น"
                                    value={selectedPosition.signatureId || ''}
                                    onChange={(e) => {
                                      const sig = signatures.find(s => s.id === e.target.value);
                                      updatePosition(selectedId, { 
                                        signatureId: e.target.value,
                                        signatureImage: sig?.path || ''
                                      });
                                    }}
                                  >
                                    {signatures.map((sig) => (
                                      <MenuItem key={sig.id} value={sig.id}>
                                        {sig.firstName} {sig.lastName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                  label="ความกว้าง (Width)"
                                  type="number"
                                  value={selectedPosition.width}
                                  onChange={(e) => {
                                    const newWidth = Number(e.target.value);
                                    const constrainedWidth = Math.max(0, Math.min(newWidth, 300));
                                    updatePosition(selectedId, { width: constrainedWidth });
                                  }}
                                  size="small"
                                  fullWidth
                                  slotProps={{ 
                                    htmlInput: {
                                      min: 0, max: 300 
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                  label="ความสูง (Height)"
                                  type="number"
                                  value={selectedPosition.height}
                                  onChange={(e) => {
                                    const newHeight = Number(e.target.value);
                                    const constrainedHeight = Math.max(0, Math.min(newHeight, 300));
                                    updatePosition(selectedId, { height: constrainedHeight });
                                  }}
                                  size="small"
                                  fullWidth
                                  slotProps={{ 
                                    htmlInput: {
                                      min: 0, max: 300 
                                    }
                                  }}
                                />
                              </Grid>
                            </>
                          )}
                        </Grid>
                        
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="caption">เลื่อนด้วยลูกศร:</Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => movePosition(selectedId, 'up')}
                              sx={{ bgcolor: 'white' }}
                            >
                              <ArrowUpwardIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => movePosition(selectedId, 'down')}
                              sx={{ bgcolor: 'white' }}
                            >
                              <ArrowDownwardIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => movePosition(selectedId, 'left')}
                              sx={{ bgcolor: 'white' }}
                            >
                              <ArrowBackIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => movePosition(selectedId, 'right')}
                              sx={{ bgcolor: 'white' }}
                            >
                              <ArrowForwardIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {/* Image Preview with Positions */}
                  <Grid size={12}>
                    <Box 
                      ref={pdfContainerRef}
                      sx={{ 
                        position: 'relative', 
                        display: 'flex', 
                        justifyContent: 'center',
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        p: 2,
                        backgroundColor: '#f5f5f5',
                        cursor: isDragging ? 'grabbing' : 'crosshair',
                        userSelect: 'none'
                      }}
                      onClick={handleImageClick}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      <Box sx={{ position: 'relative' }}>
                        {pdfUrl && (
                          <img
                            ref={imageRef}
                            src={pdfUrl}
                            alt="Certificate Template"
                            style={{
                              maxWidth: "800px",
                              width: "auto",
                              height: "auto",
                              maxHeight: "600px",
                              border: "1px solid #ccc",
                              backgroundColor: 'white',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                            onLoad={handleImageLoad}
                          />
                        )}
                        
                        {/* Preview Mode - Show actual text and signature placeholders */}
                        {previewMode && imageLoaded && positions.map((position) => {
                          if (position.type === 'text') {
                            return (
                              <div
                                key={`preview-text-${position.id}`}
                                style={getPreviewTextStyle(position)}
                              >
                                {previewName || "ชื่อตัวอย่าง"}
                              </div>
                            );
                          } else if (position.type === 'signature') {
                            return (
                              <div
                                key={`preview-signature-${position.id}`}
                                style={getPreviewSignatureStyle(position)}
                              >
                                {position.signatureImage ? (
                                  <img 
                                    src={position.signatureImage} 
                                    alt="ลายเซ็น" 
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'contain'
                                    }}
                                  />
                                ) : (
                                  "📝 ลายเซ็น"
                                )}
                              </div>
                            );
                          }
                          return null;
                        })}
                        
                        {/* Position Markers */}
                        {!previewMode && imageLoaded && positions.map((position) => {
                          return (
                            <Box
                              key={position.id}
                              sx={{
                                position: 'absolute',
                                top: position.y - 8,
                                left: position.x - 8,
                                width: 16,
                                height: 16,
                                backgroundColor: selectedId === position.id ? '#ff4444' : '#4444ff',
                                borderRadius: '50%',
                                border: '3px solid white',
                                cursor: 'grab',
                                zIndex: 10,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'scale(1.2)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                  cursor: 'grab'
                                },
                                '&:active': {
                                  cursor: 'grabbing'
                                }
                              }}
                              onMouseDown={(e) => handleMouseDown(e, position.id)}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(position.id);
                              }}
                            />
                          );
                        })}
                        
                        {/* Position Labels */}
                        {!previewMode && imageLoaded && positions.map((position) => {
                          return (
                            <Box
                              key={`label-${position.id}`}
                              sx={{
                                position: 'absolute',
                                top: position.y + 12,
                                left: position.x - 20,
                                minWidth: 40,
                                backgroundColor: selectedId === position.id ? 'rgba(255,68,68,0.9)' : 'rgba(68,68,255,0.9)',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                pointerEvents: 'none',
                                zIndex: 11,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                {position.type === 'signature' ? '✍️' : '📝'}
                                <span>{position.name}</span>
                              </Box>
                            </Box>
                          );
                        })}

                        {/* Preview Mode Indicators */}
                        {previewMode && imageLoaded && positions.map((position) => {
                          return (
                            <Box
                              key={`preview-indicator-${position.id}`}
                              sx={{
                                position: 'absolute',
                                top: position.y - 4,
                                left: position.x - 4,
                                width: 8,
                                height: 8,
                                backgroundColor: selectedId === position.id ? '#ff4444' : '#4444ff',
                                borderRadius: '50%',
                                border: '2px solid white',
                                zIndex: 20,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                                opacity: 0.8
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(position.id);
                              }}
                            />
                          );
                        })}

                        {/* Coordinate Display */}
                        {selectedPosition && !previewMode && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -50,
                              left: 10,
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontFamily: 'monospace',
                              zIndex: 20,
                              pointerEvents: 'none'
                            }}
                          >
                            {selectedPosition.name}: ({Math.round(selectedPosition.x)}, {Math.round(selectedPosition.y)})
                            {isDragging && " - Dragging"}
                          </Box>
                        )}

                        {/* Preview Mode Info */}
                        {previewMode && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -50,
                              left: 10,
                              backgroundColor: 'rgba(76, 175, 80, 0.9)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              zIndex: 20,
                              pointerEvents: 'none'
                            }}
                          >
                            🎯 โหมด Preview - ดูตัวอย่างผลลัพธ์
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Upload and Save Buttons */}
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Box>
                        {file && !uploadResult && (
                          <Button
                            variant="outlined"
                            onClick={handleUpload}
                            disabled={uploading}
                            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                          >
                            {uploading ? "กำลังอัพโหลด..." : "อัพโหลดไฟล์ใหม่"}
                          </Button>
                        )}
                        {uploadResult && (
                          <Alert severity="success" sx={{ display: 'inline-flex' }}>
                            อัพโหลดไฟล์ใหม่เรียบร้อยแล้ว!
                          </Alert>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() => router.push('/admin/certificate')}
                          color="error"
                          disabled={saving}
                        >
                          ยกเลิก
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                          onClick={handleUpdateCertificate}
                          sx={{ 
                            textTransform: 'none',
                            color: 'white',
                          }}
                          disabled={saving || !selectedEventId}
                        >
                          {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default UpdateCertificatePage;
