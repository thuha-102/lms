import PropTypes from 'prop-types';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
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
import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/use-auth';

const bankOptions = ["NONE", "OCB"]

export const BankSettings = (props) => {
    const {user} = useAuth()
    const { bank, updateInfor} = props;
    const [bankAccount, setBankAccount] = useState("")
    const [bankName, setBankName] = useState("")
    const [showBankAccount, setShowBankAccount] = useState(false);

    const handleClickShowBankAccount = () => setShowBankAccount((show) => !show);

    const handleMouseDownBankAccount = (event) => {
        event.preventDefault();
    };

    const handleMouseUpBankAccount = (event) => {
        event.preventDefault();
    };

    const handeBankNameClick = () => {
        updateInfor({
            bankName
        })
    }

    const handeBankAccountClick = () => {
        updateInfor({
            bankAccount
        })
    }

    const handeBankNameChange = (event) => {
        setBankName(event.target.value)
    }

    const handeBankAccountChange = (event) => {
        setBankAccount(event.target.value)
    }

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
                                onChange={handeBankAccountChange}
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
                            onClick={handeBankAccountClick}
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
                            onChange={handeBankNameChange}
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
                            label="Ngân hàng"
                            value={bankName}
                            onChange={handeBankNameChange}
                        />
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handeBankNameClick}
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
        
        </Stack>
    );
};

BankSettings.propTypes = {
    bank: PropTypes.object.isRequired,
    // updateInfor: PropTypes.func
};
