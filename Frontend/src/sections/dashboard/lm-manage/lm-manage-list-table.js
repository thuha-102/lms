import { Fragment, useCallback, useState } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import DeleteIcon from '@mui/icons-material/Delete';
import {
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
import { Scrollbar } from '../../../components/scrollbar';
import { SeverityPill } from '../../../components/severity-pill';
import { FileIcon } from '../../../components/file-icon';
import { useRouter } from 'next/navigation';
import { lm_manageApi } from '../../../api/lm-manage';
import { paths } from '../../../paths';
import { LearningMaterialDeleteDialog } from '../academy/learning-material-delete-dialog';

const categoryOptions = [
  {
    label: 'VIDEO',
    value: 'VIDEO'
  },
  {
    label: 'PDF',
    value: 'PDF'
  },
  {
    label: 'QUIZ',
    value: 'QUIZ'
  },
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

export const LMManageListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    LMs,
    LMsCount,
    rowsPerPage,
    onDelete,
    ...other
  } = props;
  const [currentLM, setCurrentLM] = useState(null);
  const router = useRouter()
  const [state, setState] = useState(false);

  const handleDeleteLM = useCallback((LmId) => {
    setCurrentLM((prevLmId) => {
      if (prevLmId === LmId) {
        return null;
      }

      return LmId;
    });
  }, []);

  const handleLMClose = useCallback(() => {
    setCurrentLM(null);
  }, []);

  const handleLMUpdate = useCallback(() => {
    setCurrentLM(null);
    toast.success('Tài liệu đã được cập nhật');
  }, []);

  const handleLMDelete = useCallback(async (id) => {
    try {
      // const response = await lm_manageApi.deleteLM(id);
      console.log(response)
    } catch (err){
      console.error(err);
    }
    toast.error('Tài liệu đã được xoá');
  }, []);

  const handleToggle = ({target}) => {
    setState(state => ({ ...state, [target.name]: !state[target.name] }));
  }

  return (
    <div {...other}>
    {
      currentLM !== null && <LearningMaterialDeleteDialog open={currentLM} lmId={currentLM} setDeleteDialog={setCurrentLM} reloadData={onDelete}/>
    }
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell width="25%">
                Tiêu đề
              </TableCell>
              <TableCell>
                Mô tả
              </TableCell>
              <TableCell>
                Tình trạng sử dụng
              </TableCell>
              {/* <TableCell width="25%">
                Đánh giá
              </TableCell> */}
              <TableCell align="right">
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {LMs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((LM) => {
              const isCurrent = LM.id === currentLM;
              // const price = numeral(LM.price).format(`${LM.currency}0,0.00`);
              // const quantityColor = LM.quantity >= 10 ? 'success' : 'error';
              const statusColor = LM.status === 'published' ? 'success' : 'info';
              const hasManyVariants = LM.variants > 1;
              // const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

              return (
                <Fragment key={LM.id}>
                  <TableRow
                    hover
                    key={LM.id}
                  >
                    <TableCell width="40%">
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                        onClick={() => router.push(`${paths.dashboard.explore}/preview_lm/${LM.id}`)}
                      >
                        {/* {LM.image
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
                              <FileIcon extension={LM.type}/>
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
                          <Typography variant="subtitle2">
                            {LM.name}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                          >
                            in {LM.type}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {/* <LinearProgress
                        value={LM.quantity}
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
                        {LM.quantity}
                        {' '}
                        in stock
                        {hasManyVariants && ` in ${LM.variants} variants`}
                      </Typography> */}
                      <Stack space={3}>
                        <Typography variant="subtitle2">
                          {LM.type} 
                        </Typography>
                        {/* <Typography variant="subtitle2">
                          Thời gian: {LM.time} phút
                        </Typography>
                        <Typography variant="subtitle2">
                          Topic: {LM.Topic.title}
                        </Typography> */}
                      </Stack>
                    </TableCell>
                    {/* <TableCell>
                      <SeverityPill color={statusColor}>
                        {LM.status}
                      </SeverityPill
                      >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {LM.rating}
                      </Typography>
                    </TableCell> */}
                    <TableCell>
                      <Typography>
                        {LM.usedCount === 0 ? "Không được sử dụng" : "Đang được sử dụng"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => setCurrentLM(LM.id)} disabled={LM.usedCount !== 0}>
                        <SvgIcon
                          color={LM.usedCount !== 0 ? 'disabled' :'error'}
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
        count={LMsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

LMManageListTable.propTypes = {
  LMs: PropTypes.array.isRequired,
  LMsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
