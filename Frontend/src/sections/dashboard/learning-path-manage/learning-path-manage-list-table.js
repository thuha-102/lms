import { Fragment, useCallback, useState } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
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

export const TopicManageListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    Topics,
    TopicsCount,
    rowsPerPage,
    ...other
  } = props;
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [state, setState] = useState(false);

  const handleLessonToggle = useCallback((productId) => {
    setCurrentTopic((prevProductId) => {
      if (prevProductId === productId) {
        return null;
      }

      return productId;
    });
  }, []);

  const handleLessonClose = useCallback(() => {
    setCurrentTopic(null);
  }, []);

  const handleLessonUpdate = useCallback(async (Topic) => {
    // setCurrentTopic(null);
    try {
      const response = await topic_manageApi.updateTopic(Topic.id, {
        title: currentTitle,
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

  const handleLessonDelete = useCallback(async (id) => {
    try {
      const response = await topic_manageApi.deleteTopic(id);
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
    setCurrentTitle(event.target.value);
  },[]);

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%" align='center'>
                ID
              </TableCell>
              <TableCell width="50%" align='center'>
                TÊN CHỦ ĐỀ 
              </TableCell>
              <TableCell width="20%" align='center'>
                CHỦ ĐỀ TRƯỚC
              </TableCell>
              <TableCell width="20%" align='center'>
                CHỦ ĐỀ SAU
              </TableCell>
              <TableCell align="right">
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Topics.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage)
            .map((Topic) => {
              const isCurrent = Topic.id === currentTopic;
              // const price = numeral(Topic.price).format(`${Topic.currency}0,0.00`);
              // const quantityColor = Topic.quantity >= 10 ? 'success' : 'error';
              const statusColor = Topic.status === 'published' ? 'success' : 'info';
              const hasManyVariants = Topic.variants > 1;
              // const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

              return (
                <Fragment key={Topic.id}>
                  <TableRow
                    hover
                    key={Topic.id}
                  >
                    <TableCell width="5%" align='center'>
                      {Topic.id}
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        textAlign={"center"}
                      >
                        {/* {Topic.updatedAt ? new Date(Topic.updatedAt).toLocaleDateString('en-GB') : 'N/A'} */}
                        {Topic.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        textAlign={"center"}
                      >
                        {Topic.preTopicIds.join(', ')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        textAlign={"center"}
                      >
                        {Topic.postTopicIds.join(', ')}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <IconButton onClick={() => handleLessonToggle(Topic.id)}   >
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
                                    defaultValue={Topic.id}
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
                                    defaultValue={Topic.title}
                                    fullWidth
                                    label="Title"
                                    name="title"
                                    value={currentTitle}
                                    onChange={handleLessonTitle}
                                  />
                                  
                                  {console.log(currentTitle)}
                                </Grid>
                                {/* <Grid
                                  item
                                  md={6}
                                  xs={12}
                                >
                                  <TextField
                                    defaultValue={Topic.category}
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
                                    defaultValue={Topic.id}
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
                                Các chủ đề liên quan
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
                                    // defaultValue={Topic.preTopicIds}
                                    fullWidth
                                    label="Chủ đề trước"
                                    name="Pre topics"
                                    disabled
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          {Topic.preTopicIds}
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
                                >
                                  <TextField
                                    // defaultValue={Topic.postTopicIds}
                                    fullWidth
                                    label="Chủ đề sau"
                                    name="Post topics"
                                    disabled
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          {Topic.postTopicIds}
                                        </InputAdornment>
                                      )
                                    }}
                                    type="number"
                                  />
                                </Grid>
                                {/* <Grid
                                  item
                                  md={6}
                                  xs={12}
                                  sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                  }}
                                >
                                  <Switch />
                                  <Typography variant="subtitle2">
                                    Keep selling when stock is empty
                                  </Typography>
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
                              onClick={() => handleLessonUpdate(Topic)}
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
                              onClick={() => handleLessonDelete(Topic.id)}
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
        count={TopicsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

TopicManageListTable.propTypes = {
  Topics: PropTypes.array.isRequired,
  TopicsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
