"use client";

import { FC } from "react";
import { Alert, Snackbar, AlertColor } from "@mui/material";

interface AlertBar {
  open: boolean;
  title: string;
  content: string;
  severity: AlertColor;
}

interface AlertBarProps {
  dialog: AlertBar;
  setDialog: (dialog: AlertBar) => void;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  autoHideDuration?: number;
}

const AlertBar: FC<AlertBarProps> = ({ 
  dialog, 
  setDialog,
  position = { vertical: "top", horizontal: "center" },
  autoHideDuration = 6000
}) => {
  return dialog.title && dialog.content && dialog.open ? (
    <Snackbar
      open={dialog.open}
      autoHideDuration={autoHideDuration}
      onClose={() => setDialog({ ...dialog, open: false })}
      anchorOrigin={position}
    >
      <Alert
        severity={dialog.severity}
        onClose={() => setDialog({ ...dialog, open: false })}
        sx={{
          width: "100%",
        }}
      >
        <strong>{dialog.title}</strong>
        <br />
        {dialog.content}
      </Alert>
    </Snackbar>
  ) : (
    <></>
  );
};

export default AlertBar;