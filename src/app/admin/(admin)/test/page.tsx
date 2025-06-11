"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import {
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  SelectChangeEvent,
  Alert,
} from "@mui/material";
import PositionField from "./position-fields";
import SkeletonTable from "@components/loading/skelete-table";
import { api } from "@lib/axios-config";
import { handleDowLoad } from "./func";
import { Position, CanvasSize, Event } from "@type/certificate";
import {
  Box,
  Grid2 as Grid,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { Fragment } from "react";
import SaveIcon from "@mui/icons-material/Save";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import Image from "next/image";
import UploadFiles from "./upload-files";
import NavbarBreadcrumbLayout from "@/src/components/navbar-breadcrumbs";

const Canvas: FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [eventId, setEventId] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([
    {
      id: 0,
      name: "Text Position",
      x: 0,
      y: 0,
      fontSize: 16,
      sigId:"",
      sigImage: "",
      width: 0,
      height: 0,
    },
  ]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [cssCanvasSize, setCssCanvasSize] = useState<CanvasSize>({
    width: 0,
    height: 0,
  });
  const selectedPosition =
    positions.find((p) => p.id === selectedId) || positions[0];
  const [id, setId] = useState<number>(1);
  const [templateCer, setTemplateCer] = useState<string>("");
  const [upLoadTemplate, isUploadTemplate] = useState<boolean>(false);
  const [byte, setByte] = useState<ArrayBuffer | undefined>();
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    async function loadPDF() {
      try {
        if (!byte) return;
        
        // Create blob URL for PDF
        const blob = new Blob([byte], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        
        // Set default canvas size for positioning (A4 size approximation)
        setCssCanvasSize({ width: 595, height: 842 });
        
        setPositions((prev) =>
          prev.map((position) => {
            return position.id === 0
              ? {
                  ...position,
                  y: 0,
                  x: (595 - position.fontSize / 2) / 2,
                }
              : position;
          })
        );
        
      } catch (e: any) {
        console.error(e);
        setError("Cannot load PDF: " + e.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (upLoadTemplate && byte) {
      loadPDF();
    }
    fetchEvent();
    
    // Cleanup blob URL
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [upLoadTemplate, byte]);

  useEffect(() => {
    // console.log("cssCanvasSize updated:", cssCanvasSize);
  }, [cssCanvasSize]);

  const addIcon = () => {
    if (positions.length >= 4) {
      setError("Can not add more than three");
    } else {
      setPositions([
        ...positions,
        {
          id: id,
          name: `Signature ${id}`,
          x: 0,
          y: 0,
          fontSize: 16,
          sigId:"",
          sigImage: "",
          width: 0,
          height: 0,
        },
      ]);
    }

    setId((id) => id + 1);
  };

  const handleChange = (e: SelectChangeEvent<string>) => {
    const newId = parseInt(e.target.value);
    setSelectedId(newId);
    setError(null);
  };

  const handleChangePosition = (
    id: number,
    direction: "up" | "down" | "left" | "right"
  ) => {
    // จำนวนพิกเซลที่จะเลื่อนแต่ละครั้ง
    const step = 10;

    setPositions((prev) =>
      prev.map((pos) => {
        if (pos.id !== id) return pos;
        let newX = pos.x;
        let newY = pos.y;

        switch (direction) {
          case "up":
            newY = Math.max(0, newY - step);
            break;
          case "down":
            newY = Math.min(cssCanvasSize.height - pos.fontSize, newY + step);
            break;
          case "left":
            newX = Math.max(0, newX - step);
            break;
          case "right":
            newX = Math.min(cssCanvasSize.width - pos.fontSize, newX + step);
            break;
        }

        return { ...pos, x: newX, y: newY };
      })
    );
  };

  const handleSelectSignature = (id: number, file: {id : string,path : string}) => {
    setPositions((prev) =>
      prev.map((p) => {
        if (p.id !== id) {
          return p;
        } else {
          return { ...p, sigImage : file.path,sigId : file.id };
        }
      })
    );
  };

  const fetchEvent = async () => {
    try {
      const response = await api.get("/events");
      console.log(response.data);
      setEvents(
        response.data.map((event: Event) => ({
          id: event.id,
          title: event.title,
        }))
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const setFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value);
    if (isNaN(inputValue)) {
      console.error("Invalid font size input");
      return;
    }
    setPositions((prev) =>
      prev.map((p) => {
        if (p.id === 0 && cssCanvasSize.width > 0) {
          const fontSize =
            inputValue <= 16
              ? Math.max(16, inputValue)
              : inputValue >= 48
              ? Math.min(48, inputValue)
              : inputValue;
          return {
            ...p,
            fontSize: fontSize,
            x: (cssCanvasSize.width - fontSize / 2) / 2,
          };
        } else {
          return p;
        }
      })
    );
  };

  const handleUpLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTemplateCer(file.name);
      const bytes = await file.arrayBuffer();
      if (bytes) {
        setByte(bytes);
        isUploadTemplate(true);
      }
    }
  };

  const savePosition = async () => {
    try {
      // 1) โหลด PDF เป็น ArrayBuffer
      if (!byte) {
        throw new Error("Byte data is undefined");
      }
      console.log(byte)
      const blob = new Blob([byte]);
      const url = URL.createObjectURL(blob);
      const pdfBuf = await fetch(url).then(r => r.arrayBuffer());
      URL.revokeObjectURL(url);
      // 2) แปลงเป็น Base64
      const u8 = new Uint8Array(pdfBuf);
      let binary = '';
      for (let i = 0; i < u8.length; i++) {
        binary += String.fromCharCode(u8[i]);
      }
      const originalPdfBase64 = btoa(binary).toString();
  
      console.log(originalPdfBase64)
      const response = await api.post('/testcertificate', {
        eventId,
        positions,
        originalPdfBase64,     // ส่งเป็น Base64 string แทน ArrayBuffer
      });
  
      console.log(response.data);
    } catch (err: any) {
      console.error(err);
    }
  };
  

  return (
    <Fragment>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 8, md: 9 }}>
            <Typography variant="h5" fontWeight="bold">
              Select Positions
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
              startIcon={<SaveIcon />}
              onClick={() => {
                savePosition()
              }}
            >
              Save Positions
            </Button>
          </Grid>
          <Grid size={12}>
            <NavbarBreadcrumbLayout
              pages={[
                { title: "Dashboard", path: "/admin/dashboard" },
                { title: "Certificate", path: "/admin/certificate" },
                { title: "Edit Template" },
              ]}
            />
          </Grid>
          <Grid size={6} container spacing={2}>
            <Grid size={6}>
              <UploadFiles handleUpload={handleUpLoad} />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel id="event">Event</InputLabel>
                <Select
                  labelId="event"
                  label="event"
                  value={eventId}
                  onChange={(e) => {
                    setEventId(e.target.value);
                  }}
                  sx={{ height: "100%" }}
                >
                  {events.map((event, index) => {
                    return (
                      <MenuItem key={index} value={event.id}>
                        {event.title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {upLoadTemplate && eventId !== "" ? (
            <Grid container spacing={2} size={{ xs: 12 }}>
              <Grid container size={12} sx={{ m: 0 }}>
                <Grid size={3}>
                  <Button
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                    }}
                    fullWidth
                    onClick={addIcon}
                  >
                    Add Signature
                  </Button>
                </Grid>
              </Grid>
              {positions.length > 0 && (
                <Grid container spacing={2} size={12}>
                  <Grid size={2}>
                    <FormControl fullWidth error={!!error}>
                      <InputLabel id="positions-label">Position</InputLabel>
                      <Select
                        labelId="positions-label"
                        value={selectedId.toString()}
                        label="Position"
                        id="positions"
                        onChange={handleChange}
                        fullWidth
                      >
                        {positions.map((position, index) => {
                          return (
                            <MenuItem
                              key={index}
                              value={position.id.toString()}
                            >
                              {position.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {error && <FormHelperText>{error}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <PositionField
                    position={selectedPosition}
                    canvas={cssCanvasSize}
                    func={handleChangePosition}
                    onSelectSignature={handleSelectSignature}
                    onFontSizeChange={setFontSize}
                  />
                </Grid>
              )}
            </Grid>
          ) : (
            <Grid size={12}>
              <Alert severity="warning">
                กรุณา upload certificate template และ เลือก event
              </Alert>
            </Grid>
          )}
        </Grid>
      </Box>
      {(upLoadTemplate && eventId !== "") && (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {loading && <SkeletonTable count={4} height={400} />}
          
          {pdfUrl && !loading && (
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              style={{
                width: "595px",
                height: "842px",
                border: "1px solid #ccc",
                display: loading ? "none" : "block",
              }}
              title="PDF Preview"
            />
          )}
          
          {positions.map((position, index) => {
            // const colors = ["lightgreen", "yellow", "red", "blue"];
            if (position.id === 0) {
              return (
                <GpsFixedIcon
                  key={index}
                  sx={{
                    position: "absolute",
                    top: position.y,
                    left: position.x,
                    width: position.fontSize,
                    height: position.fontSize,
                    pointerEvents: "none",
                    zIndex: 20,
                    color: "lightgreen",
                  }}
                />
              );
            } else {
              if (position.sigImage !== "") {
                return (
                  <Image
                    key={index}
                    src={"/signatures/" + position.sigImage}
                    alt="signature"
                    width={position.width || 100} // Default width if not set
                    height={position.height || 100} // Default height if not set
                    onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                      setPositions((prev) =>
                        prev.map((p, i) =>
                          i === index
                            ? {
                                ...p,
                                width: naturalWidth,
                                height: naturalHeight,
                              }
                            : p
                        )
                      );
                    }}
                    style={{
                      position: "absolute",
                      top: position.y,
                      left: position.x,
                      pointerEvents: "none",
                      zIndex: 20,
                    }}
                  />
                );
              }
            }
          })}
        </Box>
      )}
    </Fragment>
  );
};

export default Canvas;
