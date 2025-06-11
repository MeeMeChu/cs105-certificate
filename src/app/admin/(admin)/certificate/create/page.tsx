"use client";

import axios from "axios";
import { FormEvent, useState, useRef, useEffect } from "react";
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
import NavbarBreadcrumbLayout from "@components/navbar-breadcrumbs";
import { api } from "@lib/axios-config";

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

interface Position {
  id: number;
  name: string;
  x: number;
  y: number;
  fontSize: number;
  type: 'text' | 'signature';
  sigId?: string;
  sigImage?: string;
  width?: number;
  height?: number;
}

interface Signature {
  id: string;
  firstName: string;
  lastName: string;
  path: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
}

const CreateCertificate = () => {
  const router = useRouter();
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pdfScale, setPdfScale] = useState<number>(1);

  // Position management
  const [positions, setPositions] = useState<Position[]>([
    {
      id: 0,
      name: "Name Position",
      x: 297,
      y: 100,
      fontSize: 24,
      type: 'text',
      width: 0,
      height: 0,
    },
  ]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [positionId, setPositionId] = useState<number>(1);

  // Canvas size for positioning
  const [actualCanvasSize, setActualCanvasSize] = useState({ width: 595, height: 842 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError("");
    setUploadResult(null);
    
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf')) {
      const url = URL.createObjectURL(selectedFile);
      setPdfUrl(url);
      // Set default scale for positioning
      setPdfScale(0.8);
      setActualCanvasSize({ width: 595 * 0.8, height: 842 * 0.8 });
    } else {
      setPdfUrl("");
    }
  };

  const handleImageLoad = () => {
    const img = imageRef.current;
    if (img) {
      const displayWidth = img.clientWidth;
      const displayHeight = img.clientHeight;
      
      // Calculate the scale based on the displayed size vs original size
      const scaleX = displayWidth / img.naturalWidth;
      const scaleY = displayHeight / img.naturalHeight;
      const actualScale = Math.min(scaleX, scaleY);
      
      setPdfScale(actualScale);
      setActualCanvasSize({ 
        width: displayWidth, 
        height: displayHeight 
      });
      setImageLoaded(true);
      
      console.log('Image loaded:', {
        natural: { width: img.naturalWidth, height: img.naturalHeight },
        displayed: { width: displayWidth, height: displayHeight },
        scale: actualScale
      });
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !imageLoaded) return;
    
    const container = pdfContainerRef.current;
    const img = imageRef.current;
    if (!container || !img) return;

    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    // Calculate position relative to the image, not the container
    const x = (e.clientX - imgRect.left);
    const y = (e.clientY - imgRect.top);

    // Update selected position (no need to divide by scale since we're using actual display coordinates)
    updatePosition(selectedId, { x, y });
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageLoaded) return;
    
    const img = imageRef.current;
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - imgRect.left - dragOffset.x, actualCanvasSize.width - 100));
    const y = Math.max(0, Math.min(e.clientY - imgRect.top - dragOffset.y, actualCanvasSize.height - 50));

    updatePosition(selectedId, { x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const getScaledPosition = (position: Position) => ({
    x: position.x,
    y: position.y,
    width: position.width || 100,
    height: position.height || 50,
    fontSize: position.fontSize
  });

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

  useEffect(() => {
    if (uploadResult && file?.type === 'application/pdf') {
      const blob = new Blob([file], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setLoading(false);
    }
    
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [uploadResult, file]);

  useEffect(() => {
    fetchSignatures();
    fetchEvents();
  }, []);

  const fetchSignatures = async () => {
    try {
      const response = await api.get('/signatures');
      setSignatures(response.data.data || []);
    } catch (error) {
      console.error('Error fetching signatures:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const addPosition = (type: 'text' | 'signature') => {
    const newPosition: Position = {
      id: positionId,
      name: type === 'text' ? `Text ${positionId}` : `Signature ${positionId}`,
      x: 100 + (positionId * 20), // Offset new positions slightly
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
      setError("Must have at least one position");
      return;
    }
    
    const filteredPositions = positions.filter(pos => pos.id !== id);
    setPositions(filteredPositions);
    
    // Select another position if the deleted one was selected
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
          newY = Math.min(actualCanvasSize.height - 50, newY + step);
          break;
        case 'left':
          newX = Math.max(0, newX - step);
          break;
        case 'right':
          newX = Math.min(actualCanvasSize.width - 100, newX + step);
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

  // Submit form
  const handleSaveCertificate = async () => {
    if (!uploadResult) {
      setError("Please upload a file first");
      return;
    }

    if (!selectedEventId) {
      setError("Please select an event for this certificate");
      return;
    }

    try {
      const certificateData = {
        templatePath: uploadResult.path,
        templateUrl: uploadResult.url,
        positions: positions,
        eventId: selectedEventId,
      };
      console.log("🚀 ~ handleSaveCertificate ~ certificateData:", certificateData)

      const response = await api.post('/certificates', certificateData);
      
      if (response.status === 201) {
        router.push('/admin/certificate');
      }
    } catch (error: any) {
      console.error('Error saving certificate:', error);
      setError('Failed to save certificate. Please try again.');
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Container maxWidth="xl">
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
              <Grid container spacing={3}>
                {/* Upload Section */}
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>
                    Upload Certificate Template (Image or PDF)
                  </Typography>
                </Grid>
                
                {/* Event Selection */}
                <Grid size={12}>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploading}
                        sx={{ mb: 2 }}
                      >
                        {uploading ? "Uploading..." : "Choose Image/PDF File"}
                        <VisuallyHiddenInput
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*,.pdf,application/pdf"
                        />
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <FormControl fullWidth>
                        <InputLabel>Select Event *</InputLabel>
                        <Select
                          value={selectedEventId}
                          onChange={(e) => setSelectedEventId(e.target.value)}
                          label="Select Event *"
                          required
                        >
                          {events.map((event) => (
                            <MenuItem key={event.id} value={event.id}>
                              {event.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  {file && (
                    <Typography variant="body2" color="text.secondary">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                  )}
                </Grid>

                {/* Error Display */}
                {error && (
                  <Grid size={12}>
                    <Alert severity="error">{error}</Alert>
                  </Grid>
                )}

                {/* Image/PDF Preview and Position Editor - Show when file is selected */}
                {file && (file.type.startsWith('image/') || file.type === 'application/pdf') && (
                  <>
                    <Grid size={12}>
                      <Alert severity="info">
                        {file.type.startsWith('image/') ? 'Image' : 'PDF'} selected! 
                        {selectedEventId ? ` Event: ${events.find(e => e.id === selectedEventId)?.title || 'Selected'}` : ' Please select an event.'}
                        {selectedEventId && ' You can now set positions for name and signatures. Drag the markers to position them.'}
                      </Alert>
                    </Grid>

                    {selectedEventId && (
                      <>
                        <Grid size={12}>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="h6" gutterBottom>
                            Position Editor
                          </Typography>
                        </Grid>

                        {/* Position Controls */}
                        <Grid size={12}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={2}>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<AddIcon />}
                                onClick={() => addPosition('text')}
                                sx={{ bgcolor: 'primary.main' }}
                              >
                                Add Name
                              </Button>
                            </Grid>
                            <Grid size={2}>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<AddIcon />}
                                onClick={() => addPosition('signature')}
                                sx={{ bgcolor: 'secondary.main' }}
                              >
                                Add Signature
                              </Button>
                            </Grid>
                            <Grid size={3}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Select Position</InputLabel>
                                <Select
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
                            <Grid size={2}>
                              <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                startIcon={<DeleteIcon />}
                                onClick={() => deletePosition(selectedId)}
                                disabled={positions.length <= 1}
                              >
                                Delete
                              </Button>
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="body2" color="text.secondary">
                                Total positions: {positions.length}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Position List */}
                        <Grid size={12}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Current Positions:
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
                                Edit Selected Position: {selectedPosition.name}
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid size={3}>
                                  <TextField
                                    label="Position Name"
                                    value={selectedPosition.name}
                                    onChange={(e) => updatePosition(selectedId, { name: e.target.value })}
                                    size="small"
                                    fullWidth
                                  />
                                </Grid>
                                <Grid size={2}>
                                  <TextField
                                    label="Font Size"
                                    type="number"
                                    value={selectedPosition.fontSize}
                                    onChange={(e) => updatePosition(selectedId, { fontSize: Number(e.target.value) })}
                                    size="small"
                                    fullWidth
                                    inputProps={{ min: 8, max: 72 }}
                                  />
                                </Grid>
                                <Grid size={2}>
                                  <TextField
                                    label="X Position"
                                    type="number"
                                    value={Math.round(selectedPosition.x)}
                                    onChange={(e) => updatePosition(selectedId, { x: Number(e.target.value) })}
                                    size="small"
                                    fullWidth
                                  />
                                </Grid>
                                <Grid size={2}>
                                  <TextField
                                    label="Y Position"
                                    type="number"
                                    value={Math.round(selectedPosition.y)}
                                    onChange={(e) => updatePosition(selectedId, { y: Number(e.target.value) })}
                                    size="small"
                                    fullWidth
                                  />
                                </Grid>
                                {selectedPosition.type === 'signature' && (
                                  <Grid size={3}>
                                    <FormControl fullWidth size="small">
                                      <InputLabel>Select Signature</InputLabel>
                                      <Select
                                        value={selectedPosition.sigId || ''}
                                        onChange={(e) => {
                                          const sig = signatures.find(s => s.id === e.target.value);
                                          updatePosition(selectedId, { 
                                            sigId: e.target.value,
                                            sigImage: sig?.path || ''
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
                                )}
                              </Grid>
                              
                              {/* Arrow Controls */}
                              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="caption">Move with arrows:</Typography>
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

                        {/* Image/PDF Preview with Positions */}
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
                                <>
                                  {file.type.startsWith('image/') ? (
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
                                  ) : (
                                    <iframe
                                      ref={iframeRef}
                                      src={pdfUrl}
                                      style={{
                                        width: "476px", // 595 * 0.8
                                        height: "674px", // 842 * 0.8
                                        border: "1px solid #ccc",
                                        backgroundColor: 'white',
                                        pointerEvents: 'none' // Prevent iframe from capturing clicks
                                      }}
                                      title="PDF Preview"
                                    />
                                  )}
                                </>
                              )}
                              
                              {/* Position Markers - Only show when image is loaded */}
                              {imageLoaded && positions.map((position) => {
                                const scaledPos = getScaledPosition(position);
                                return (
                                  <Box
                                    key={position.id}
                                    sx={{
                                      position: 'absolute',
                                      top: scaledPos.y,
                                      left: scaledPos.x,
                                      width: position.type === 'signature' ? scaledPos.width : Math.max(scaledPos.fontSize * 4, 50),
                                      height: position.type === 'signature' ? scaledPos.height : scaledPos.fontSize + 10,
                                      border: selectedId === position.id ? '3px solid #ff4444' : '2px solid #4444ff',
                                      backgroundColor: selectedId === position.id ? 'rgba(255,68,68,0.2)' : 'rgba(68,68,255,0.2)',
                                      cursor: 'grab',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '12px',
                                      color: selectedId === position.id ? '#ff4444' : '#4444ff',
                                      fontWeight: 'bold',
                                      borderRadius: '4px',
                                      transition: 'all 0.2s ease',
                                      zIndex: 10,
                                      '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
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
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pointerEvents: 'none' }}>
                                      {position.type === 'signature' ? '✍️' : '📝'}
                                      <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                        {position.name}
                                      </Typography>
                                    </Box>
                                  </Box>
                                );
                              })}
                              
                              {/* Coordinate Display */}
                              {selectedPosition && (
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
                            </Box>
                          </Box>
                        </Grid>

                        {/* Upload and Save Buttons */}
                        <Grid size={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Box>
                              {!uploadResult && (
                                <Button
                                  variant="outlined"
                                  onClick={handleUpload}
                                  disabled={uploading}
                                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                >
                                  {uploading ? "Uploading..." : "Upload File"}
                                </Button>
                              )}
                              {uploadResult && (
                                <Alert severity="success" sx={{ display: 'inline-flex' }}>
                                  File uploaded successfully!
                                </Alert>
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Button
                                onClick={() => router.push('/admin/certificate')}
                                color="inherit"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveCertificate}
                                disabled={!uploadResult || !selectedEventId}
                              >
                                Save Certificate Template
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {/* Upload Button for files not yet uploaded */}
                {file && !uploadResult && !file.type.startsWith('image/') && file.type !== 'application/pdf' && (
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

                {/* Previous Success and Position Editor section removed as it's now above */}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateCertificate;
