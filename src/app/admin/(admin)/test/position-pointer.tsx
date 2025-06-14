"use client";
import { Grid2 as Grid, Button } from "@mui/material";
import { FC } from "react";
import { Position, CanvasSize } from "@/src/types/certificate";

const PositionPointer: FC<{
  position: Position;
  canvas: CanvasSize;
  func: Function;
}> = ({ position, canvas, func }) => {
  return (
    <Grid container spacing={2} size={12}>
      <Grid size={{ xs: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => func(position.id, "up")}
        >
          ↑
        </Button>
      </Grid>
      <Grid size={{ xs: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => func(position.id, "left")}
        >
          ←
        </Button>
      </Grid>
      <Grid size={{ xs: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => func(position.id, "down")}
        >
          ↓
        </Button>
      </Grid>
      <Grid size={{ xs: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => func(position.id, "right")}
        >
          →
        </Button>
      </Grid>
    </Grid>
  );
};

export default PositionPointer;
