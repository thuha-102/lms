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

const genderOptions = ["MALE", "FEMALE", "UNKNOWN"]
const bankOptions = ["OCB"]

export const AccountGeneralSettings = (props) => {
  const { avatar, user, updateInfor} = props;
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);


  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handeNameClick = (event) => {
    updateInfor({
      username
    })
  }

  const handePasswordClick = (event) => {
    if (confirmPassword !== password) return;
    updateInfor({
      password
    })
  }

  const handeNameChange = (event) => {
    setUserName(event.target.value)
  }

  const handePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  useEffect(()=>{
    setUserName(user.username)
  }, [user])
  
  return (
    <Stack
      spacing={4}
      {...props}>
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
                Thông tin cơ bản
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack spacing={3}>
                <Stack spacing={2} direction={'row'}>
                  <TextField
                    label='ID'
                    fullWidth
                    disabled={true}
                    value={user.id}
                  />
                  <Button disabled={true}/>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    label="Tài khoản"
                    name="username"
                    value={username}
                    sx={{
                      flexGrow: 1
                    }}
                    onChange={handeNameChange}
                  />
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handeNameClick}
                  >
                    Lưu
                  </Button>
                </Stack>
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
                    <InputLabel htmlFor="filled-adornment-password">Mật khẩu</InputLabel>
                    <FilledInput
                      id="filled-adornment-password"
                      placeholder='***********'
                      value={password}
                      type={showPassword ? 'text' : 'password'}
                      onCopy={(event) => event.preventDefault()}
                      onChange={handePasswordChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handePasswordClick}
                  >
                    Lưu
                  </Button>
                </Stack>
                {
                  password !== "" &&
                  <Stack direction={'row'} spacing={2}>
                    <FormControl 
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed'
                        }
                      }} 
                      variant="filled"
                    >
                      <InputLabel htmlFor="filled-adornment-password">Nhập lại mật khẩu</InputLabel>
                      <FilledInput
                        id="filled-adornment-password"
                        error={password !== confirmPassword}
                        placeholder='***********'
                        value={confirmPassword}
                        type={showConfirmPassword ? 'text' : 'password'}
                        onPaste={(event) => event.preventDefault()}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={handleMouseDownPassword}
                              onMouseUp={handleMouseUpPassword}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <Button
                      color="inherit"
                      size="small"
                      disabled={true}
                    />
                  </Stack>
                }
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};

AccountGeneralSettings.propTypes = {
  user: PropTypes.object.isRequired,
};
