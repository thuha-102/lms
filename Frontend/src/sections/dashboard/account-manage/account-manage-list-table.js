import { Fragment, useCallback, useState } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { AccountDeleteDialogAdmin } from './account-delete-dialog-admin';

const categoryOptions = [
  // {
  //   label: 'ADMIN',
  //   value: 'ADMIN'
  // },
  // {
  //   label: 'INSTRUCTOR',
  //   value: 'INSTRUCTOR'
  // },
  // {
  //   label: 'LEARNER',
  //   value: 'LEARNER'
  // }
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
    onDeleteAccount,
    rowsPerPage,
    ...other
  } = props;
  const [currentAccount, setCurrentAccount] = useState(null);
  // const [account, setAccount] = useState();
  const router = useRouter()
  const [state, setState] = useState(false);

  const handleAccountToggle = useCallback((Account) => {
    setCurrentAccount(Account);
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
      {
        currentAccount !== null && <AccountDeleteDialogAdmin open={currentAccount !== null} setDeleteDialog={setCurrentAccount} successDelete={onDeleteAccount} account={currentAccount}/>
      }
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
                Nhóm người dùng
              </TableCell>
              <TableCell>
                Ngày tạo
              </TableCell>
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
                    <TableCell width="25%">
                      <Typography variant="subtitle2">
                        {Account.username}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {Account.typeLearner ? Account.typeLearner : "Chưa xác định nhóm người dùng"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {Account.createdAt}
                      </Typography>
                    </TableCell>                    
                    <TableCell align="right">
                      <IconButton onClick={() => handleAccountToggle(Account)}>
                        <SvgIcon
                          color='error'
                        >
                          <DeleteIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>                  
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
