import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material"
import { useAuth } from "../../../hooks/use-auth"
import { useCallback, useState } from "react"
import { userApi } from "../../../api/user"
import { useRouter } from "next/navigation"
import { paths } from "../../../paths"

export const AccountDeleteDialog = (props) => {
    const {open, setDeleteDialog} =props
    const auth = useAuth()
    const router = useRouter()
    const [confirmText, setConfirmText] = useState("")

    const handleDeleteUser = useCallback(async () => {
        if (confirmText === auth.user?.username){
            await userApi.deleteUser(auth.user.id)
            await auth.signOut()
            router.push(paths.dashboard.index)
        }   
    }, [auth, confirmText])

    return (
        <Dialog
            open={open}
            onClose={() => setDeleteDialog(false)}
        >
            <DialogTitle id="alert-dialog-title">
                {"Xoá tài khoản"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Bạn có chắc chắn muốn xoá tài khoản này không?
                    <Stack direction={'row'}>
                        Nhập <Typography fontWeight={'bold'} marginX={1}>{auth.user?.username}</Typography> để xác nhận xóa
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
                <Button onClick={() => setDeleteDialog(false)}>Huỷ bỏ</Button>
                <Button onClick={handleDeleteUser}>
                    Xoá
                </Button>
            </DialogActions>
        </Dialog>
    )
}