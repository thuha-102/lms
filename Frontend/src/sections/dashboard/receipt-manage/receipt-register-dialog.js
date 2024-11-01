import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { userApi } from "../../../api/user";

const ReceiptRegisterDialog = (props) =>{
    const {open, setRegisterDialog, setReload, receipt} = props;

    const handleRegisterAdmin = useCallback(async () => {
        try {
            await userApi.registerAdmin(receipt.id);

            setRegisterDialog(null);
            setReload(prev => !prev);
            toast.success("Đăng kí thành công")
        }
        catch (err) {
            toast.error("Xảy ra lỗi")
        }
    }, [receipt])

    return (
        <Dialog
            open={open}
            onClose={() => setRegisterDialog(null)}
            maxWidth={700}
        >
            <DialogTitle>
                Xác nhận đăng kí các khóa học trong danh sách cho learner có "ID = {receipt.learnerId}"
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <Typography>Danh sách các khóa học</Typography>    
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Tên khóa học</TableCell>
                            </TableRow>
                            {
                                receipt.courses.map(course => (
                                    <TableRow>
                                        <TableCell>{course.id}</TableCell>
                                        <TableCell>{course.name}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setRegisterDialog(null)}>Hủy bỏ</Button>
                <Button onClick={handleRegisterAdmin}>Xác nhận</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ReceiptRegisterDialog;