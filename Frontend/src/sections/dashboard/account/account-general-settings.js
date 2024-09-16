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
  Unstable_Grid2 as Grid
} from '@mui/material';
import { alpha } from '@mui/material/styles';

const genderOptions = ["MALE", "FEMALE", "UNKNOWN"]

export const AccountGeneralSettings = (props) => {
  const { avatar, user } = props;

  const { email, name, username, gender, qualification, backgroundKnowledge } = user ? user : { email: null, name: null, username: null, gender: null, qualification: null, backgroundKnowledge: null }
  
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
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <Box
                    sx={{
                      borderColor: 'neutral.300',
                      borderRadius: '50%',
                      borderStyle: 'dashed',
                      borderWidth: 1,
                      p: '4px'
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: '50%',
                        height: '100%',
                        width: '100%',
                        position: 'relative'
                      }}
                    >
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                          borderRadius: '50%',
                          color: 'common.white',
                          cursor: 'pointer',
                          display: 'flex',
                          height: '100%',
                          justifyContent: 'center',
                          left: 0,
                          opacity: 0,
                          position: 'absolute',
                          top: 0,
                          width: '100%',
                          zIndex: 1,
                          '&:hover': {
                            opacity: 1
                          }
                        }}
                      >
                        
                      </Box>
                      <Avatar
                        src={avatar}
                        sx={{
                          height: 100,
                          width: 100
                        }}
                      >
                        <SvgIcon>
                          <User01Icon />
                        </SvgIcon>
                      </Avatar>
                    </Box>
                  </Box>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    defaultValue={name}
                    label="Tên"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    color="inherit"
                    size="small"
                  >
                    Lưu
                  </Button>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    defaultValue={qualification}
                    label="Trình độ học vấn"
                    sx={{ flexGrow: 1 }}
                    disabled={true}
                  />
                  <Button
                    color="inherit"
                    size="small"
                  >
                    
                  </Button>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    defaultValue={backgroundKnowledge}
                    label="Kiến thức về AI"
                    sx={{ flexGrow: 1 }}
                    disabled={true}
                  />
                  <Button
                    color="inherit"
                    size="small"
                  >
                    
                  </Button>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    defaultValue={email}
                    label="Email"
                    required
                    sx={{
                      flexGrow: 1,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed'
                      }
                    }}
                  />
                  <Button
                    color="inherit"
                    size="small"
                  >
                    Lưu
                  </Button>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    defaultValue={gender}
                    label="Giới tính"
                    select
                    SelectProps={{ native: true }}
                    sx={{
                      flexGrow: 1,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed'
                      }
                    }}
                  >
                    {genderOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </TextField>
                  <Button
                    color="inherit"
                    size="small"
                  >
                    Lưu
                  </Button>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    defaultValue={username}
                    label="Tài khoản"
                    required
                    sx={{
                      flexGrow: 1,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed'
                      }
                    }}
                  />
                  <Button
                    color="inherit"
                    size="small"
                  >
                    Lưu
                  </Button>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    defaultValue={''}
                    placeholder='***************'
                    label="Mật khẩu"
                    type='password'
                    required
                    sx={{
                      flexGrow: 1,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed'
                      }
                    }}
                  />
                  <Button
                    color="inherit"
                    size="small"
                  >
                    Lưu
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
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
    </Stack>
  );
};

AccountGeneralSettings.propTypes = {
  avatar: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
