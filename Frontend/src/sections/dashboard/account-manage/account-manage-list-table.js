import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import PersonIcon from '@mui/icons-material/Person';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  SvgIcon,
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
import { useRouter } from 'next/navigation';
import { AccountDeleteDialogAdmin } from './account-delete-dialog-admin';
import { AccountManageVisualize } from './account-manage-visualize';

export const AccountManageListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    Accounts,
    AccountsCount,
    onDeleteAccount,
    rowsPerPage,
    ...other
  } = props;
  const [currentAccount, setCurrentAccount] = useState(null);
  const [openAccountDetail, setOpenAccountDetail] = useState(false);
  const [openVisualization, setOpenVisualization] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // const [account, setAccount] = useState();
  const router = useRouter()
  const [state, setState] = useState(false);

  const handleAccountToggle = useCallback((Account, accountDetailState, visualizationState) => {
    setOpenAccountDetail((prevAccount) => {
      if (prevAccount === Account) {
        return false;
      }

      return accountDetailState;
    });
    setOpenVisualization((prevAccount) => {
      if (prevAccount === Account) {
        return false;
      }

      return visualizationState;
    });
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
    // try {
    //   const response = await lm_manageApi.deleteAccount(id);
    //   console.log(response)
    // } catch (err){
    //   console.error(err);
    // }
    setOpenDeleteDialog(true);
    // toast.error('Tài liệu đã được xoá');
  }, []);

  const handleToggle = ({target}) => {
    setState(state => ({ ...state, [target.name]: !state[target.name] }));
  }

  const handleVisibilityChange = () => {
    setCurrentAccount({...currentAccount, state:!currentAccount.state});
  }

  return (
    <div {...other}>
      {
        openDeleteDialog && <AccountDeleteDialogAdmin 
                              open={openDeleteDialog} 
                              setDeleteDialog={setCurrentAccount}
                              setOpenDeleteDialog={setOpenDeleteDialog} 
                              successDelete={onDeleteAccount} 
                              account={currentAccount}
                            />
      }
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%" align='center'>
              </TableCell>
              <TableCell width="5%" align='center'>
                ID
              </TableCell>
              <TableCell>
                Người dùng
              </TableCell>
              <TableCell>
                Ngày tạo - Nhóm người dùng
              </TableCell>
              <TableCell>
                Điểm trung bình
              </TableCell>
              <TableCell>
                Tiến độ
              </TableCell>
              <TableCell align="right">
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Accounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((Account) => {
              const statusColor = Account.state === true ? 'success' : 'error';
              const hasManyVariants = Account.variants > 1;

              return (
                <Fragment key={Account.id}>
                  <TableRow
                    hover
                    key={Account.id}
                  >
                    <TableCell width="5%" align='center'>
                      <IconButton 
                        aria-label="edit"   
                        onClick={() => handleAccountToggle(Account, false, true)}
                      >
                        <NavigateNextRoundedIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell width="5%" align='center'>
                      {Account.id}
                    </TableCell>
                    <TableCell width="25%">
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
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
                        <Box
                          sx={{
                            cursor: 'pointer',
                            ml: 2
                          }}
                        >
                          <Typography variant="subtitle2">
                            {Account.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {Account.createdAt}
                      </Typography>
                      <Typography variant="subtitle2">
                        {Account.typeLearner}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {Account.avg_score}
                    </TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleAccountToggle(Account, true, false)}   >
                        <SvgIcon>
                          <DotsHorizontalIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {openVisualization && currentAccount && Account.id === currentAccount.id && <AccountManageVisualize 
                                                                                                Account={Account}
                                                                                                handleAccountClose={handleAccountClose}
                                                                                                handleAccountUpdate={handleAccountUpdate}
                                                                                                handleAccountDelete={handleAccountDelete}
                                                                                              />}
                  {openAccountDetail && currentAccount && Account.id === currentAccount.id && (
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
                            <Button
                              onClick={() => handleAccountDelete(Account.id)}
                              color="error"
                              type="submit"
                              variant="contained"
                            >
                              Xoá vĩnh viễn
                            </Button>
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
