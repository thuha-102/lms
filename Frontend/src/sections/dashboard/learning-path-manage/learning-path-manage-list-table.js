import { Fragment, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
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
import { topic_manageApi } from '../../../api/topic-manage';
import { paths } from '../../../paths';

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
  {
    label: 'WORD',
    value: 'WORD'
  },
  {
    label: 'CODE',
    value: 'CODE'
  },
  {
    label: 'PPT',
    value: 'PPT'
  }
];

export const LearningPathManageListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    TypeLearner,
    TypeLearnerCount,
    rowsPerPage,
    ...other
  } = props;
  const router = useRouter();
  const [currentTypeLearner, setCurrentTypeLearner] = useState(null);
  const [currentTypeLearnerName, setCurrentTypeLearnerName] = useState(null);
  const [state, setState] = useState(false);

  const handleTypeLearnerToggle = useCallback((productId) => {
    setCurrentTypeLearner((prevProductId) => {
      if (prevProductId === productId) {
        return null;
      }

      return productId;
    });
  }, []);

  const handleLessonClose = useCallback(() => {
    setCurrentTypeLearner(null);
  }, []);

  const handleLessonUpdate = useCallback(async (TypeLearner) => {
    // setCurrentTypeLearner(null);
    try {
      const response = await topic_manageApi.updateTypeLearner(TypeLearner.typeLearnerId, {
        typeLearnerName: currentTypeLearnerName,
        addPreIds: [],
        addPostIds: [],
        deletePreIds: [],
        deletePostIds: []
      });
      console.log(response)
    } catch (err) {
      console.error(err);
    }
    toast.success('Chủ đề học đã được cập nhật');
  }, []);

  const handleLessonDelete = useCallback(async (typeLearnerId) => {
    try {
      const response = await topic_manageApi.deleteTypeLearner(typeLearnerId);
      console.log(response)
    } catch (err) {
      console.error(err);
    }
    toast.error('Chủ đề học đã được xoá');
  }, []);

  const handleToggle = ({target}) => {
    setState(state => ({ ...state, [target.name]: !state[target.name] }));
  }

  const handleLessonTitle = useCallback((event) => {
    setCurrentTypeLearnerName(event.target.value);
  },[]);

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%" align='center'>
              </TableCell>
              <TableCell width="5%" align='center'>
                ID
              </TableCell>
              <TableCell width="50%" align='center'>
                NHÓM NGƯỜI HỌC 
              </TableCell>
              <TableCell width="20%" align='center'>
                ĐIỂM KHẢO SÁT
              </TableCell>
              <TableCell width="20%" align='center'>
                NGÀY TẠO - CHỈNH SỬA
              </TableCell>
              <TableCell align="right">
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TypeLearner.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage)
            .map((TypeLearner) => {
              const isCurrent = TypeLearner.typeLearnerId === currentTypeLearner;
              // const price = numeral(TypeLearner.price).format(`${TypeLearner.currency}0,0.00`);
              // const quantityColor = TypeLearner.quantity >= 10 ? 'success' : 'error';
              const statusColor = TypeLearner.status === 'published' ? 'success' : 'info';
              const hasManyVariants = TypeLearner.variants > 1;
              // const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

              return (
                <Fragment key={TypeLearner.typeLearnerId}>
                  <TableRow
                    hover
                    key={TypeLearner.typeLearnerId}
                  >
                    <TableCell width="5%" align='center'>
                      <IconButton 
                        aria-label="edit"   
                        onClick={() => {
                          // Chuyển đổi mảng các đối tượng thành chuỗi JSON trước khi lưu vào localStorage
                          localStorage.setItem('updateSequenceCourseIds', JSON.stringify(TypeLearner.courses.map((course) => ({
                            id: course.id,
                            name: course.name
                          }))));
                          
                          // Điều hướng đến trang khác
                          router.push(`${paths.dashboard.learning_path_manage}/updated/${TypeLearner.typeLearnerId}`);
                        }} 
                      >
                        <NavigateNextRoundedIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell width="5%" align='center'>
                      {TypeLearner.typeLearnerId}
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textFrist"
                        variant="body2"
                        textAlign={"center"}
                      >
                        {/* {TypeLearner.updatedAt ? new Date(TypeLearner.updatedAt).toLocaleDateString('en-GB') : 'N/A'} */}
                        {TypeLearner.typeLearnerName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        textAlign={"center"}
                      >
                        {"Chưa có"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        textAlign={"center"}
                      >
                        {TypeLearner.createdAt.split("T")[0]}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        textAlign={"center"}
                      >
                        {TypeLearner.updatedAt.split("T")[0]}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleTypeLearnerToggle(TypeLearner.typeLearnerId)}   >
                        <SvgIcon>
                          <DotsHorizontalIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {isCurrent && (
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
                                  md={2}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={TypeLearner.typeLearnerId}
                                    fullWidth
                                    disabled
                                    label="ID"
                                    name="Id"
                                  />
                                </Grid>
                                <Grid
                                  item
                                  md={10}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={TypeLearner.typeLearnerName}
                                    fullWidth
                                    label="Tên nhóm người học"
                                    name="typeLearnerName"
                                    value={currentTypeLearnerName}
                                    onChange={handleLessonTitle}
                                  />
                                  
                                  {console.log(currentTypeLearnerName)}
                                </Grid>
                                {/* <Grid
                                  item
                                  md={6}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={TypeLearner.category}
                                    fullWidth
                                    label="Category"
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
                                    defaultValue={TypeLearner.typeLearnerId}
                                    disabled
                                    fullWidth
                                    label="Barcode"
                                    name="barcode"
                                  />
                                </Grid> */}
                              </Grid>
                            </Grid>
                            <Grid
                              item
                              md={6}
                              xs={12}
                            >
                              <Typography variant="h6">
                                Các khoá học thuộc lộ trình
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              {TypeLearner.courses.map((course) => {
                                return (
                                <Typography 
                                  color="textSecondary"
                                  variant="body2"
                                  textAlign={"left"}
                                >
                                  {course.name}
                                </Typography>);
                              })}
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
                              onClick={() => handleLessonUpdate(TypeLearner)}
                              type="submit"
                              variant="contained"
                            >
                              Cập nhật
                            </Button>
                            <Button
                              color="inherit"
                              onClick={handleLessonClose}
                            >
                              Huỷ bỏ
                            </Button>
                          </Stack>
                          <div>
                            <Button
                              onClick={() => handleLessonDelete(TypeLearner.typeLearnerId)}
                              // type="submit"
                              variant="contained"
                              color="error"
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
        count={TypeLearnerCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

LearningPathManageListTable.propTypes = {
  TypeLearner: PropTypes.array.isRequired,
  TypeLearnerCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
