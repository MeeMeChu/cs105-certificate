"use client"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Fragment, useCallback, FC, forwardRef, Ref } from "react";

export type DialogPopupType = {
  title: string;
  body: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  onClickFunction: () => void;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogPopup: FC<DialogPopupType> = (props) => {
  const { title, body, open, setOpen, onClickFunction } = props;

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [open]);

  const handleConfirm = () => {
    setOpen(false);
    onClickFunction();
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
				keepMounted
        TransitionComponent={Transition}
        aria-describedby="alert-dialog-popup"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
					<DialogContentText id="alert-dialog-popup">
						{body}
          </DialogContentText>
				</DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} fullWidth>
            ยกเลิก
          </Button>
					<Button 
						variant="contained" 
						onClick={handleConfirm} 
						fullWidth
						sx={{ 
							color: "white",
							boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
						}}
					>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default DialogPopup;