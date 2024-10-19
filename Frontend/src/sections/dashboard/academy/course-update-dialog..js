import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useCallback } from "react"
import toast from "react-hot-toast"
import { exploreApi } from "../../../api/explore"

export const CourseUpdateDialog = (props) => {
    const {courseId, request, open, setUpdateDialog} = props

    const handleUpdateCourse = useCallback(async () => {
        try {
            await exploreApi.updateCourse(courseId, request);
            toast.success("Đã cập nhật thành công khóa học")
        }
        catch (error){
            toast.error("Xảy ra lỗi")
        }
    }, [courseId])


    return (
        <Dialog
            open={open}
            onClose={() => setUpdateDialog(false)}
        >
            <DialogTitle id="alert-dialog-title">
                {"Cập nhật khóa học"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Bạn có chắc chắn muốn cập nhật khóa học này không?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setUpdateDialog(false)}>Huỷ bỏ</Button>
                <Button onClick={handleUpdateCourse}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    )
}