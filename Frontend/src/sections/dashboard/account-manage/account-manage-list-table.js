import { Fragment, useCallback, useState } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import PersonIcon from '@mui/icons-material/Person';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  FormControlLabel,
  Stack,
  SvgIcon,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { blue, grey, green } from '@mui/material/colors';
import { Scrollbar } from '../../../components/scrollbar';
import { SeverityPill } from '../../../components/severity-pill';
import { FileIcon } from '../../../components/file-icon';
import { useRouter } from 'next/navigation';
import { lm_manageApi } from '../../../api/lm-manage';
import { paths } from '../../../paths';

const categoryOptions = [
  {
    label: 'ADMIN',
    value: 'ADMIN'
  },
  {
    label: 'INSTRUCTOR',
    value: 'INSTRUCTOR'
  },
  {
    label: 'LEARNER',
    value: 'LEARNER'
  }
  // {
  //   label: 'WORD',
  //   value: 'WORD'
  // },
  // {
  //   label: 'CODE',
  //   value: 'CODE'
  // },
  // {
  //   label: 'PPT',
  //   value: 'PPT'
  // }
];

export const AccountManageListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    Accounts,
    AccountsCount,
    rowsPerPage,
    ...other
  } = props;
  const [currentAccount, setCurrentAccount] = useState(null);
  // const [account, setAccount] = useState();
  const router = useRouter()
  const [state, setState] = useState(false);

  const handleAccountToggle = useCallback((Account) => {
    setCurrentAccount((prevAccount) => {
      if (prevAccount === Account) {
        return null;
      }

      return Account;
    });
  }, []);

  const handleAccountClose = useCallback(() => {
    setCurrentAccount(null);
  }, []);

  const handleAccountUpdate = useCallback(() => {
    setCurrentAccount(null);
    toast.success('Tài liệu đã được cập nhật');
  }, []);

  const handleAccountDelete = useCallback(async (id) => {
    try {
      const response = await lm_manageApi.deleteAccount(id);
      console.log(response)
    } catch (err){
      console.error(err);
    }
    toast.error('Tài liệu đã được xoá');
  }, []);

  const handleToggle = ({target}) => {
    setState(state => ({ ...state, [target.name]: !state[target.name] }));
  }

  const handleVisibilityChange = () => {
    setCurrentAccount({...currentAccount, state:!currentAccount.state});
  }

  // useEffect({
    
  // },[])

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                ID
              </TableCell>
              <TableCell width="25%">
                Người dùng
              </TableCell>
              <TableCell>
                Mô tả
              </TableCell>
              <TableCell>
                Trạng thái
              </TableCell>
              {/* <TableCell width="25%">
                Đánh giá
              </TableCell> */}
              <TableCell align="right">
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Accounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((Account) => {
              // const isCurrent = Account.id === currentAccount.id;
              // const price = numeral(Account.price).format(`${Account.currency}0,0.00`);
              // const quantityColor = Account.quantity >= 10 ? 'success' : 'error';
              const statusColor = Account.state === true ? 'success' : 'error';
              const hasManyVariants = Account.variants > 1;
              // const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

              return (
                <Fragment key={Account.id}>
                  <TableRow
                    hover
                    key={Account.id}
                  >
                    <TableCell>
                      {Account.id}
                    </TableCell>
                    <TableCell width="40%">
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        {/* {Account.image
                          ? ( */}
                            {/* <Box
                              sx={{
                                alignItems: 'center',
                                backgroundColor: 'neutral.50',
                                backgroundImage: `url(/assets/products/product-1.png)`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                borderRadius: 1,
                                display: 'flex',
                                height: 80,
                                justifyContent: 'center',
                                overflow: 'hidden',
                                width: 80
                              }}
                            /> */}
                              {/* <FileIcon extension={Account.type}/> */}
                              {Account.accountType == "LEARNER" ? 
                              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <PersonIcon />
                              </Avatar> : <></>
                              }    
                              {Account.accountType == "ADMIN" ? 
                              <Avatar sx={{ bgcolor: grey[100], color: grey[600] }}>
                                <PersonIcon />
                              </Avatar> : <></>
                              }
                              {Account.accountType == "INSTRUCTOR" ? 
                              <Avatar sx={{ bgcolor: green[100], color: green[600] }}>
                                <PersonIcon />
                              </Avatar> : <></>
                              }  
                          {/* )
                          : (
                            <Box
                              sx={{
                                alignItems: 'center',
                                backgroundColor: 'neutral.50',
                                borderRadius: 1,
                                display: 'flex',
                                height: 80,
                                justifyContent: 'center',
                                width: 80
                              }}
                            >
                              <SvgIcon>
                                <Image01Icon />
                              </SvgIcon>
                            </Box>
                          )} */}
                        <Box
                          sx={{
                            cursor: 'pointer',
                            ml: 2
                          }}
                        >
                          <Typography variant="subtitle1">
                            {Account.name}
                          </Typography>
                          <Typography variant="subtitle2">
                            Tên truy cập: {Account.username}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                          >
                            Vai trò: {Account.accountType}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {/* <LinearProgress
                        value={Account.quantity}
                        variant="determinate"
                        color={quantityColor}
                        sx={{
                          height: 8,
                          width: 36
                        }}
                      />
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {Account.quantity}
                        {' '}
                        in stock
                        {hasManyVariants && ` in ${Account.variants} variants`}
                      </Typography> */}
                      <Stack space={4}>
                        <Typography variant="subtitle2">
                          Email: {Account.email} 
                        </Typography>
                        <Typography variant="subtitle2">
                          Tuổi: {Account.age}
                        </Typography>
                        <Typography variant="subtitle2">
                          Giới tính: {Account.gender}
                        </Typography>
                        {/* <Typography variant="subtitle2">
                          Topic: {Account.accountType}
                        </Typography> */}
                        <Typography variant="subtitle2">
                          Ngôn ngữ: {Account.language}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusColor}>
                        {Account.state ? "ACTIVE": "INACTIVE"}
                      </SeverityPill>
                      {/* <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {Account.state}
                      </Typography> */}
                    </TableCell> 
                    <TableCell align="right">
                      <IconButton onClick={() => handleAccountToggle(Account)}   >
                        <SvgIcon>
                          <DotsHorizontalIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {/* {isCurrent && (() => setVisibilityChecked(Account.state))()}
                  {console.log(visibilityChecked)} */}
                  {currentAccount && Account.id === currentAccount.id && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{
                          p: 0,
                          position: 'relative',
                          '&:after': {
                            position: 'absolute',
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: 'primary.main',
                            width: 3,
                            height: 'calc(100% + 1px)'
                          }
                        }}
                      >
                        <CardContent>
                          <Grid
                            container
                            spacing={3}
                          >
                            <Grid
                              item
                              md={6}
                              xs={12}
                            >
                              <Typography variant="h6">
                                Thông tin cơ bản
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Grid
                                container
                                spacing={3}
                              >
                                <Grid
                                  item
                                  md={6}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={Account.name}
                                    fullWidth
                                    disabled
                                    label="Tên người dùng"
                                    name="name"
                                  />
                                </Grid>
                                <Grid
                                  item
                                  md={6}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={Account.username}
                                    fullWidth
                                    disabled
                                    label="Tên trên hệ thống"
                                    name="username"
                                  />
                                </Grid>
                                <Grid
                                  item
                                  md={6}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={Account.gender}
                                    fullWidth
                                    disabled
                                    label="Giới tính"
                                    name="gender"
                                  />
                                </Grid>
                                <Grid
                                  item
                                  md={6}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={Account.email}
                                    fullWidth
                                    disabled
                                    label="Email"
                                    name="email"
                                  />
                                </Grid>
                                {/* <Grid
                                  item
                                  md={6}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={Account.category}
                                    fullWidth
                                    label="Loại hình"
                                    select
                                  >
                                    {categoryOptions.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                        >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid> */}
                              </Grid>
                            </Grid>
                            <Grid
                              item
                              md={6}
                              xs={12}
                            >
                              <Typography variant="h6">
                                Mô tả
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Grid
                                container
                                spacing={3}
                              >
                                <Grid
                                  item
                                  md={6}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={Account.accountType}
                                    fullWidth
                                    label="Vai trò"
                                    name="Accounttype"
                                    select
                                  >
                                    {categoryOptions.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                        >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid
                                  item
                                  md={6}
                                  xs={12}
                                >
                                  <TextField
                                    // defaultValue={Account.age}
                                    fullWidth
                                    label="Tuổi"
                                    name="age"
                                    disabled
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          {Account.age} 
                                        </InputAdornment>
                                      )
                                    }}
                                    type="number"
                                  />
                                </Grid>
                                <Grid
                                  item
                                  md={6}
                                  xs={12}
                                  sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                  }}
                                >
                                  <FormControlLabel
                                    control={<Switch
                                              checked={currentAccount.state}
                                              onChange={handleVisibilityChange}
                                              inputProps={{ 'aria-label': 'controlled' }}
                                            />}
                                    label="Trạng thái"
                                  />
                                  {console.log(currentAccount)}
                                </Grid>
                                {/* <Grid
                                  item
                                  md={6}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={Account.accountType}
                                    fullWidth
                                    label="Vai trò"
                                    name="topicTitle"
                                  />
                                </Grid> */}
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <Divider />
                        <Stack
                          alignItems="center"
                          direction="row"
                          justifyContent="space-between"
                          sx={{ p: 2 }}
                        >
                          <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                          >
                            <Button
                              onClick={handleAccountUpdate}
                              type="submit"
                              variant="contained"
                            >
                              Cập nhật
                            </Button>
                            <Button
                              color="inherit"
                              onClick={handleAccountClose}
                            >
                              Đóng
                            </Button>
                          </Stack>
                          <div>
                            <Button
                              onClick={() => handleAccountDelete(Account.id)}
                              color="error"
                              type="submit"
                              variant="contained"
                            >
                              Xoá vĩnh viễn
                            </Button>
                          </div>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={AccountsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

AccountManageListTable.propTypes = {
  Accounts: PropTypes.array.isRequired,
  AccountsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
