"use client";
import {
  Grid2 as Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";
import { FC, Fragment, useState, useEffect, ChangeEvent } from "react";
import PositionPointer from "./position-pointer";
import Image from "next/image";
import { Position, CanvasSize } from "@/src/types/certificate";
import { api } from "@/src/lib/axios-config";

const PositionField: FC<{
  position: Position;
  canvas: CanvasSize;
  func: Function;
  onSelectSignature: Function;
  onFontSizeChange: Function;
}> = ({ position, canvas, func, onSelectSignature, onFontSizeChange }) => {
  const [font, setFont] = useState<string>("th");
  const [open, setOpen] = useState<boolean>(false);
  const [filenames, setFilenames] = useState<{ id: string; path: string }[]>([]);
  useEffect(() => {
    async function fetchSignatures() {
      try {
        const response = await api.get("/testcertificate/signatures");
        if (response.status === 200) {
          const data = response.data;
          console.log(response.data);
          setFilenames(data);
        } else {
          console.error("Failed to fetch signatures");
        }
      } catch (error) {
        console.error("Error fetching signatures:", error);
      }
    }
    fetchSignatures();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Grid container spacing={2} size={10}>
        {position.id === 0 ? (
          <Fragment>
            <Grid size={2}>
              <TextField
                aria-readonly
                label="Text Position X"
                value={position.x}
              />
            </Grid>
            <Grid size={2}>
              <TextField
                aria-readonly
                label="Text Position Y"
                value={position.y}
              />
            </Grid>
            <Grid size={2}>
              <TextField
                type="number"
                label="Font Size"
                value={position.fontSize}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFontSizeChange(e)
                }
              />
            </Grid>
            <Grid size={2}>
              <FormControl fullWidth>
                <InputLabel id="font">Font</InputLabel>
                <Select
                  labelId="font"
                  label="font"
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                >
                  <MenuItem value={"th"}>Thai</MenuItem>
                  <MenuItem value={"en"}>Eng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <Grid size={2}>
              <TextField aria-readonly label="Position X" value={position.x} />
            </Grid>
            <Grid size={2}>
              <TextField aria-readonly label="Position Y" value={position.y} />
            </Grid>
            <Grid size={3}>
              <Button
                variant="contained"
                fullWidth
                sx={{ height: "100%" }}
                onClick={handleClickOpen}
              >
                Select Signatures
              </Button>
            </Grid>
          </Fragment>
        )}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography>Select Signature</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {filenames.map((file, i) => {
              // console.log(file.id,file.path);
              return (
                <Grid
                  key={i}
                  size={{ xs: 12, md: 4 }}
                  sx={{ justifyItems: "center" }}
                >
                  <Button
                    onClick={() => {
                      onSelectSignature(position.id, file);
                      setOpen(false);
                      console.log(position);
                    }}
                    sx={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <Image
                      src={`/signatures/${file.path}`}
                      alt={`sig ${i + 1}`}
                      width={500}
                      height={500}
                    />
                    <Typography>Signature {i + 1}</Typography>
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <PositionPointer canvas={canvas} position={position} func={func} />
    </Fragment>
  );
};

export default PositionField;
