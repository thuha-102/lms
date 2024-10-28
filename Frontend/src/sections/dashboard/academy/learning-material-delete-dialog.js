import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useCallback } from "react"
import toast from "react-hot-toast"
import { exploreApi } from "../../../api/explore"
import { paths } from "../../../paths"

export const LearningMaterialDeleteDialog = (props) => {
    const {lmId, open, setDeleteDialog, reloadData} = props

    const handleDeleteLearningMaterial = useCallback(async () => {
        try {
            await exploreApi.deleteLearningMaterial(lmId);
            reloadData(lmId)
            setDeleteDialog(false)
            toast.success("Đã xóa thành công tài liệu học")
        }
        catch (error){
            toast.error("Xảy ra lỗi")
        }
    }, [lmId])


    return (
        <Dialog
            open={open}
            onClose={() => setDeleteDialog(0)}
        >
            <DialogTitle id="alert-dialog-title">
                {"Xoá bài học"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Bạn có chắc chắn muốn xoá tài liệu học này không?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteDialog(0)}>Huỷ bỏ</Button>
                <Button onClick={handleDeleteLearningMaterial}>
                    Xoá
                </Button>
            </DialogActions>
        </Dialog>
    )
}