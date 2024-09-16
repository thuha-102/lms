// Tạo khoá học mới -> trả về trang khoá học vừa mới tạo (chưa làm)

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const CreateCourseDialog = ({openCreateCourseDialog, setOpenCreateCourseDialog}) => {

  const handleClickOpen = () => {
    setOpenCreateCourseDialog(true);
  };

  const handleClose = () => {
    setOpenCreateCourseDialog(false);
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={openCreateCourseDialog}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const course_name = formJson.text;
            console.log(course_name);
            handleClose();
          },
        }}
      >
        <DialogTitle>Tạo khoá học mới</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Để tạo khoá học mới, bạn cần nhập tên khoá học mới mà mình muốn tạo.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="course_name"
            name="text"
            label="Nhập tên khoá học mới"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ bỏ</Button>
          <Button type="submit">Tạo mới</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}