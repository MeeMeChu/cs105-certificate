"use client";

import { useEffect, useState } from "react";
import { styled, Button } from "@mui/material";
import { FC } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Fragment } from "react";
import {
  Grid2 as Grid,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";

const UploadFiles: FC<{ handleUpload: Function }> = ({ handleUpload }) => {
  const [events, setEvents] = useState([]);
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
  return (
    <Button
      component="label"
      variant="contained"
      tabIndex={-1}
      startIcon={<UploadFileIcon />}
      sx={{
        p: 2,
        height: "100%",
        boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
        color: "white",
      }}
      fullWidth
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleUpload(event)
        }
        multiple
      />
    </Button>
  );
};

export default UploadFiles;
