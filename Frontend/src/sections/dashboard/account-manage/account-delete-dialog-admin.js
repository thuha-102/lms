import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material"
import { useAuth } from "../../../hooks/use-auth"
import { useCallback, useState } from "react"
import { userApi } from "../../../api/user"
import { useRouter } from "next/navigation"
import { paths } from "../../../paths"
import toast from "react-hot-toast"

export const AccountDeleteDialogAdmin = (props) => {
    const {open, account, setDeleteDialog, setOpenDeleteDialog, successDelete} =props
    const [confirmText, setConfirmText] = useState("")

    const handleDeleteUser = useCallback(async () => {
        try {
            if (confirmText === account.username){
                await userApi.deleteUser(account.id)
                successDelete(account.id)
                setDeleteDialog(null)
                toast.success("Đã xóa tài khoản thành công")
            }   
        }
        catch(error){
            toast.error("Xảy ra lỗi")
        }
    }, [account, confirmText])

    return (
        <Dialog
            open={open}
            onClose={()=>{setOpenDeleteDialog(false)}}
        >
            <DialogTitle id="alert-dialog-title">
                {"Xoá tài khoản"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Bạn có chắc chắn muốn xoá tài khoản này không?
                    <Stack direction={'row'}>
                        Nhập <Typography fontWeight={'bold'} marginX={1}>{account.username}</Typography> để xác nhận xóa
                    </Stack>
                </DialogContentText>
                <TextField
                    fullWidth
                    autoFocus
                    variant="standard"
                    value={confirmText}
                    onChange={(event) => setConfirmText(event.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>setOpenDeleteDialog(false)}>Huỷ bỏ</Button>
                <Button color="error" onClick={handleDeleteUser}>
                    Xoá
                </Button>
            </DialogActions>
        </Dialog>
    )
}