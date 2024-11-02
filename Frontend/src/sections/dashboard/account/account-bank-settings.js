import PropTypes from 'prop-types';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import AddIcon from '@mui/icons-material/Add';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    SvgIcon,
    Switch,
    TextField,
    Typography,
    Unstable_Grid2 as Grid,
    InputAdornment,
    IconButton,
    OutlinedInput,
    FormControl,
    InputLabel,
    FilledInput
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/use-auth';
import { AccountDeleteDialog } from './account-delete-dialog';
import toast from 'react-hot-toast';
import { paymentApi } from '../../../api/payment';

const bankOptions = ["NONE", "OCB"]

export const BankSettings = (props) => {
    const {user} = useAuth()
    const { bank, updateInfor, setBankInfor} = props;
    const [bankAccount, setBankAccount] = useState("")
    const [bankName, setBankName] = useState("")
    const [showBankAccount, setShowBankAccount] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false)

    const handleClickShowBankAccount = () => setShowBankAccount((show) => !show);

    const handleMouseDownBankAccount = (event) => {
        event.preventDefault();
    };

    const handleMouseUpBankAccount = (event) => {
        event.preventDefault();
    };

    const handleBankNameClick = useCallback(() => {
        updateInfor({
            bankName
        })
    }, [bankName])

    const handleBankAccountClick = useCallback(() => {
        updateInfor({
            bankAccount
        })
    }, [bankAccount])

    const handleBankNameChange = (event) => {
        setBankName(event.target.value)
    }

    const handleBankAccountChange = (event) => {
        setBankAccount(event.target.value)
    }

    const handleCreateBankAccount = useCallback(async() => {
        try{
            if (bankAccount === "" || bankName === "") throw Error()
            
            await paymentApi.createBankAccount({bankAccount: bankAccount, bankName: bankName})
            setBankInfor({
                bankAccount,
                bankName
            })
            toast.success("Tạo tài khoản ngân hàng thanh công")
        }
        catch(err){
            toast.error("Xảy ra lỗi")
        }
    }, [bankAccount, bankName])

    useEffect(()=>{
        setBankAccount(bank.bankAccount)
        setBankName(bank.bankName)
    }, [bank])
    
    return (
        <Stack
        spacing={4}
        {...props}>
        {
            user?.accountType === "ADMIN" ? 
            <Card>
                <CardContent>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                    xs={12}
                    md={4}
                    >
                        <Typography variant="h6">
                            Thông tin ngân hàng
                        </Typography>
                    </Grid>
                    <Grid
                    xs={12}
                    md={8}
                    >
                    <Stack spacing={3}>
                        { 
                            !bank && 
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography variant='subtitle2'>
                                    Tài khoản thêm vào là tài khoản ảo được cung cấp bởi SePay
                                </Typography>
                                <Button
                                    variant='contained'
                                    onClick={handleCreateBankAccount}
                                    startIcon={
                                        <SvgIcon>
                                            <AddIcon/>
                                        </SvgIcon>
                                    }
                                >
                                    Thêm tài khoản mới
                                </Button>
                            </Stack>
                        }
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                        >
                        <FormControl 
                            sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderStyle: 'dashed'
                            }
                            }} 
                            variant="filled"
                        >
                            <InputLabel htmlFor="filled-adornment-bankAccount">Tài khoản ngân hàng</InputLabel>
                            <FilledInput
                                id="filled-adornment-bankAccount"
                                value={bankAccount}
                                type={showBankAccount ? 'text' : 'password'}
                                required
                                onChange={handleBankAccountChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle bankAccount visibility"
                                        onClick={handleClickShowBankAccount}
                                        onMouseDown={handleMouseDownBankAccount}
                                        onMouseUp={handleMouseUpBankAccount}
                                        edge="end"
                                    >
                                        {showBankAccount ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Button
                            color="inherit"
                            size="small"
                            disabled={!bank}
                            onClick={handleBankAccountClick}
                        >
                            Lưu
                        </Button>
                    </Stack>
                        <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                        >
                        {/* <TextField
                            value={bankName}
                            label="Ngân hàng"
                            select
                            SelectProps={{ native: true }}
                            onChange={handleBankNameChange}
                            sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderStyle: 'dashed'
                            }
                            }}
                            
                        >
                            {bankOptions.map((option) => (
                                <option
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </option>
                            ))}
                        </TextField> */}
                        <TextField
                            fullWidth
                            required
                            label="Ngân hàng"
                            value={bankName}
                            onChange={handleBankNameChange}
                        />
                        <Button
                            color="inherit"
                            disabled={!bank}
                            size="small"
                            onClick={handleBankNameClick}
                        >
                            Lưu
                        </Button>
                        </Stack>
                    </Stack>
                    </Grid>
                </Grid>
                </CardContent>
            </Card>
            :
            <Card>
                <CardContent>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                    xs={12}
                    md={4}
                    >
                    <Typography variant="h6">
                        Xóa tài khoản
                    </Typography>
                    </Grid>
                    <Grid
                    xs={12}
                    md={8}
                    >
                    <Button
                        onClick={() => setDeleteUser(true)}
                        color="error"
                        variant="outlined"
                    >
                        Xóa vĩnh viễn
                    </Button>
                    </Grid>
                </Grid>
                </CardContent>
            </Card>
        }
        {
            deleteUser && <AccountDeleteDialog open={deleteUser} setDeleteDialog={setDeleteUser}/>
        }
        </Stack>
    );
};

BankSettings.propTypes = {
    bank: PropTypes.object.isRequired,
    // updateInfor: PropTypes.func
};
