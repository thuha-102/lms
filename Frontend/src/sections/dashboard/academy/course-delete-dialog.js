import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useCallback } from "react"
import toast from "react-hot-toast"
import { exploreApi } from "../../../api/explore"
import { paths } from "../../../paths"

export const CourseDeleteDialog = (props) => {
    const {courseId, open, setDeleteDialog} = props

    const handleDeleteCourse = useCallback(async () => {
        try {
            await exploreApi.deleteCourse(courseId);
            toast.success("Đã xóa thành công khóa học")
            window.location.replace(paths.dashboard.academy.index);
        }
        catch (error){
            toast.error("Xảy ra lỗi")
        }
    }, [courseId])


    return (
        <Dialog
            open={open}
            onClose={() => setDeleteDialog(false)}
        >
            <DialogTitle id="alert-dialog-title">
                {"Xoá khóa học"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Bạn có chắc chắn muốn xoá khóa học này không?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteDialog(false)}>Huỷ bỏ</Button>
                <Button onClick={handleDeleteCourse}>
                    Xoá
                </Button>
            </DialogActions>
        </Dialog>
    )
}