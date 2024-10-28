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

export const GroupCreateDialog = ({initialGroupName, openGroupCreateDialog, setOpenGroupCreateDialog}) => {
//   useEffect(() => {
//     console.log("openGroupCreateDialog changed:", openGroupCreateDialog);
//   }, [openGroupCreateDialog]);

    // const handleCreateLesson = useCallback(async () => {
    //       try {
    //         // NOTE: Make API request
    //         // console.log(formik.values);
    //         await exploreApi.createTopic({
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
    setOpenGroupCreateDialog(true);
  };

  const handleClose = () => {
    setOpenGroupCreateDialog(false);
    console.log(openGroupCreateDialog);
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={openGroupCreateDialog}
        // onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());

            // Lấy giá trị từ group_name và score
            const groupName = formJson.group_name;
            const score = formJson.score;

            // Log ra giá trị
            console.log("Group Name:", groupName);
            console.log("Score:", score);
            // console.log(course_name);
            try {
            //     // NOTE: Make API request
                // console.log(formik.values);
            //     await exploreApi.createTopic({
            //       title: course_name,
            //       idCourse: parseInt(courseId, 10),
              // })
                toast.success('Nhóm người học mới đã được tạo');
                // router.push(`${paths.dashboard.explore}/${courseid}`);
              } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
                // helpers.setStatus({ success: false });
                // helpers.setErrors({ submit: err.message });
                // helpers.setSubmitting(false);
              }
            handleClose();
            // handleAddTopic(course_name);
          },
        }}
      >
        <DialogTitle>Tạo nhóm người học mới</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Để tạo nhóm người học mới, vui lòng nhập các thông tin cần thiết.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="group_name"
            name="group_name"
            label="Nhập tên nhóm người học mới"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="score"
            name="score"
            label="Điểm khảo sát của nhóm người học mới"
            type="number"
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
