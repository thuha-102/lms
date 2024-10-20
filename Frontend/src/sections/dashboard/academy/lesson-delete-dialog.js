import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useCallback } from "react"
import toast from "react-hot-toast"
import { exploreApi } from "../../../api/explore"
import { paths } from "../../../paths"

export const LessonDeleteDialog = (props) => {
    const {lessonId, open, setDeleteDialog, setTopicList} = props

    const handleDeleteLesson = useCallback(async () => {
        try {
            await exploreApi.deleteLesson(lessonId);
            setTopicList(prev => {
                prev.forEach((topic) => {
                    topic.lessons = topic.lessons.filter(lesson => lesson.id !== lessonId);
                });

                return prev
            })
            toast.success("Đã xóa thành công tài liệu học")
        }
        catch (error){
            toast.error("Xảy ra lỗi")
        }
    }, [lessonId])


    return (
        <Dialog
            open={open}
            onClose={() => setDeleteDialog(0)}
        >
            <DialogTitle id="alert-dialog-title">
                {"Xoá bái học"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Bạn có chắc chắn muốn xoá tài liệu học này không?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteDialog(0)}>Huỷ bỏ</Button>
                <Button onClick={handleDeleteLesson}>
                    Xoá
                </Button>
            </DialogActions>
        </Dialog>
    )
}