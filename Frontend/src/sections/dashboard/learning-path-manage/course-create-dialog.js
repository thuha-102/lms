// Tạo khoá học mới -> trả về trang khoá học vừa mới tạo (chưa làm)

import * as React from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react'
import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { exploreApi } from '../../../api/explore';

export const CreateCourseDialog = ({courseId, openCreateCourseDialog, setOpenCreateCourseDialog, handleAddCourseId}) => {
  // useEffect(() => {
  //   console.log("openCreateCourseDialog changed:", openCreateCourseDialog);
  // }, [openCreateCourseDialog]);

    // const handleCreateLesson = useCallback(async () => {
    //       try {
    //         // NOTE: Make API request
    //         // console.log(formik.values);
    //         await exploreApi.createLesson({
    //           title: values.name,
    //           idCourse: parseInt(courseId, 10),
    //       })
    //         toast.success('khoá học đã được tạo');
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
    setOpenCreateCourseDialog(true);
  };

  const handleClose = () => {
    setOpenCreateCourseDialog(false);
    console.log(openCreateCourseDialog);
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={openCreateCourseDialog}
        // onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const course_name = formJson.text;
            // console.log(course_name);
            try {
            //     // NOTE: Make API request
                // console.log(formik.values);
            //     await exploreApi.createLesson({
            //       title: course_name,
            //       idCourse: parseInt(courseId, 10),
              // })
              toast.success('Khoá học đã được tạo');
                // router.push(`${paths.dashboard.explore}/${courseid}`);
              } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
                // helpers.setStatus({ success: false });
                // helpers.setErrors({ submit: err.message });
                // helpers.setSubmitting(false);
              }
            handleClose();
            handleAddCourseId(course_name);
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
          <Button onClick={handleClose} type="button">Huỷ bỏ</Button>
          <Button type="submit">Tạo mới</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
