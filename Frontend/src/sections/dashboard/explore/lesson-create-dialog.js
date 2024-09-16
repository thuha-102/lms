// Tạo bài học mới -> trả về trang bài học vừa mới tạo (chưa làm)

import * as React from 'react';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { exploreApi } from '../../../api/explore';

export const CreateLessonDialog = ({courseId, openCreateLessonDialog, setOpenCreateLessonDialog}) => {

    // const handleCreateLesson = useCallback(async () => {
    //       try {
    //         // NOTE: Make API request
    //         // console.log(formik.values);
    //         await exploreApi.createLesson({
    //           title: values.name,
    //           idCourse: parseInt(courseId, 10),
    //       })
    //         toast.success('Bài học đã được tạo');
    //         // router.push(`${paths.dashboard.explore}/${courseid}`);
    //       } catch (err) {
    //         console.error(err);
    //         toast.error('Something went wrong!');
    //         // helpers.setStatus({ success: false });
    //         // helpers.setErrors({ submit: err.message });
    //         // helpers.setSubmitting(false);
    //       }
    //   });

  const handleClickOpen = () => {
    setOpenCreateLessonDialog(true);
  };

  const handleClose = () => {
    setOpenCreateLessonDialog(false);
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={openCreateLessonDialog}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            // event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const lesson_name = formJson.text;
            console.log(lesson_name);
            try {
                // NOTE: Make API request
                // console.log(formik.values);
                await exploreApi.createLesson({
                  title: lesson_name,
                  idCourse: parseInt(courseId, 10),
              })
                toast.success('Bài học đã được tạo');
                // router.push(`${paths.dashboard.explore}/${courseid}`);
              } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
                // helpers.setStatus({ success: false });
                // helpers.setErrors({ submit: err.message });
                // helpers.setSubmitting(false);
              }
            handleClose();
          },
        }}
      >
        <DialogTitle>Tạo bài học mới</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Để tạo bài học mới, bạn cần nhập tên bài học mới mà mình muốn tạo.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="lesson_name"
            name="text"
            label="Nhập tên bài học mới"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ bỏ</Button>
          <Button type="submit" >Tạo mới</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}