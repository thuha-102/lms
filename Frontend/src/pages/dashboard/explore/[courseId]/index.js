import { use, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Link,
  Rating,
  Stack,
  SvgIcon,
  Typography,
  useTheme
} from '@mui/material';
import { lm_manageApi } from '../../../../api/lm-manage';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { LMManageListSearch } from '../../../../sections/dashboard/explore/explore-list-search';
import { LMManageListTable } from '../../../../sections/dashboard/explore/explore-list-table';
import { applyPagination } from '../../../../utils/apply-pagination';
import CollapsibleTable from '../../../../sections/dashboard/explore/lesson-list-table';
import { exploreApi } from '../../../../api/explore';
import { useAuth } from '../../../../hooks/use-auth';
import { userApi } from '../../../../api/user';
import { CreateLessonDialog } from '../../../../sections/dashboard/explore/lesson-create-dialog';
import { authApi } from '../../../../api/used-auth';
import TopicEditTable from '../../../../sections/dashboard/explore/topic-edit-table';
import { deepCopy } from '../../../../utils/deep-copy';
import { useDispatch } from 'react-redux';
import { CourseDeleteDialog } from '../../../../sections/dashboard/academy/course-delete-dialog';
import { CourseUpdateDialog } from '../../../../sections/dashboard/academy/course-update-dialog.';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      name: undefined,
      type: [],
      topicId: [],
      inStock: undefined
    },
    page: 0,
    rowsPerPage: 5
  });

  return {
    search,
    updateSearch: setSearch
  };
};


// const useLMs = (search) => {
//   const isMounted = useMounted();
//   const [state, setState] = useState({
//     LMs: [],
//     LMsCount: 0
//   });

//   const getLMs = useCallback(async () => {
//     try {
//       // const response = await lm_manageApi.getLMs(search);
//       const response = await lm_manageApi.getLMs();
//       let data = response.data;
//       if (typeof search.filters !== 'undefined') {
//         data = data.filter((lm) => {
//           if (typeof search.filters.name !== 'undefined' && search.filters.name !== '') {
//             const nameMatched = lm.name.toLowerCase().includes(filters.name.toLowerCase());
  
//             if (!nameMatched) {
//               return false;
//             }
//           }
  
//           // It is possible to select multiple type options
//           if (typeof search.filters.type !== 'undefined' && search.filters.type.length > 0) {
//             const categoryMatched = search.filters.type.includes(lm.type);
  
//             if (!categoryMatched) {
//               return false;
//             }
//           }
  
//           // It is possible to select multiple topicId options
//           if (typeof search.filters.topicId !== 'undefined' && search.filters.topicId.length > 0) {
//             const statusMatched = search.filters.topicId.includes(lm.topicId);
  
//             if (!statusMatched) {
//               return false;
//             }
//           }
  
//           // Present only if filter required
//           if (typeof search.filters.inStock !== 'undefined') {
//             const stockMatched = lm.inStock === search.filters.inStock;
  
//             if (!stockMatched) {
//               return false;
//             }
//           }
  
//           return true;
//         });
//       }
  
//       // if (typeof search.page !== 'undefined' && typeof search.rowsPerPage !== 'undefined') {
//       //   data = applyPagination(data, search.page, search.rowsPerPage);
//       // }

//       if (isMounted()) {
//         setState({
//           LMs: data,
//           LMsCount: data.length
//         });
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }, [search, isMounted]);

//   useEffect(() => {
//       getLMs();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [search]);

//   return state;
// };



const LessonList = () => {
  const { search, updateSearch } = useSearch();
  const { user } = useAuth();
  const theme = useTheme();
  // const { LMs, LMsCount } = useLMs(search);
  const dispatch = useDispatch()
  const courseUrl = window.location.href.split('/');
  const courseId = (courseUrl[courseUrl.length - 1]);
  const [registered, setRegistered] = useState(false)
  const [price, setPrice] = useState(0)
  const [salePercent, setSalePercent] = useState(0)
  const [inCart, setInCart] = useState(false)
  const [topicList, setTopicList] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [level, setLevel] = useState("");
  const [rating, setRating] = useState("");
  const [studied, setStudied] = useState("")
  const [updatedAt, setUpdated] = useState("");
  const [avatarId, setAvatarId] = useState(null);
  const [openCreateLessonDialog, setOpenCreateLessonDialog] = useState(false)
  const [openDeleteDialog, setDeleteDialog] = useState(false)
  const [openUpdateDialog, setUpdateDialog] = useState(false)

  const getCourse = useCallback(async () => {
    try {
      const response = user?.accountType === 'ADMIN' ? await exploreApi.detailCourse(courseId)
                                                    : await exploreApi.detailCourse(courseId, user.id);
      console.log(response.data)

      setAvatarId(response.data.avatarId)
      setTopicList(response.data.topics === undefined ? [] : response.data.topics)
      setCourseTitle(response.data.name)
      setCourseDescription(response.data.description)
      setPrice(response.data.price)
      setSalePercent(response.data.salePercent)
      setStudied(response.data.studied)
      setLevel(response.data.level)
      setUpdated(response.data.updatedAt.slice(8, 10) + '-' + response.data.updatedAt.slice(5, 7) + '-' + response.data.updatedAt.slice(0, 4))
      setRegistered(response.data.registered)
      setInCart(response.data.inCart)
    } catch (err) {
      console.error(err);
    }
  }, [courseId])

  useEffect(() => {
    getCourse();
  }, []);

  usePageView();

  useEffect(() => {
    console.log(price)
  }, [price])

  const handleFiltersChange = useCallback((filters) => {
    updateSearch((prevState) => ({
      ...prevState,
      filters
    }));
  }, [updateSearch]);

  const handlePageChange = useCallback((event, page) => {
    updateSearch((prevState) => ({
      ...prevState,
      page
    }));
  }, [updateSearch]);

  const handleRowsPerPageChange = useCallback((event) => {
    updateSearch((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10)
    }));
  }, [updateSearch]);

  const handleRegisterCourse = useCallback(async () => {
    await userApi.registerCourse(user.id, courseId);
    setRegistered(true);
  }, [])

  const handleUpdateOrder = useCallback(async (type, source, destination) => {
    let temp = deepCopy(topicList)
    if (type === 'topic'){
      temp[source] = topicList[destination]
      temp[destination] = topicList[source]
    }
    else
    {
      if (source.topicIndex === destination.topicIndex) {
        temp[source.topicIndex].lessons[source.lessonIndex] = topicList[destination.topicIndex].lessons[destination.lessonIndex]
        temp[destination.topicIndex].lessons[destination.lessonIndex] = topicList[source.topicIndex].lessons[source.lessonIndex]
      }
      else {
        temp[source.topicIndex].lessons = [...topicList[source.topicIndex].lessons.slice(0, source.lessonIndex), ...topicList[source.topicIndex].lessons.slice(source.lessonIndex + 1)]

        temp[destination.topicIndex].lessons = [...topicList[destination.topicIndex].lessons.slice(0, destination.lessonIndex), topicList[source.topicIndex].lessons[source.lessonIndex], ...topicList[destination.topicIndex].lessons.slice(destination.lessonIndex)]
      }
    }
    setTopicList(temp)
  }, [topicList])

  const handleAddCart = useCallback(async () => {
    await userApi.addCart(user.id, courseId)
    setInCart(true)
  }, [user, courseId])

  const createRequestForUpdating = useCallback(() => {
    const orderTopicIds = topicList.map(topic => topic.id)
    const orderLessonIds = topicList.map(topic => topic.lessons.map(lesson => lesson.id))
    return {
      orderTopicIds: orderTopicIds,
      orderLessonIds: orderLessonIds
    }
  }, [topicList])

  const handleUpdateNextCourse = useCallback(async () => {
    if (studied) await userApi.updateLastedCourseInSequence(user.id, {nextCourseId: studied.nextCourseId})
  }, [user, studied])

  return (
    <>
      <Head>
        <title>
          Khóa học {courseTitle}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      > 
        {
          openDeleteDialog && <CourseDeleteDialog courseId={courseId} open={openDeleteDialog} setDeleteDialog={setDeleteDialog}/>
        }
        {
          openUpdateDialog && <CourseUpdateDialog request={createRequestForUpdating()} courseId={courseId} open={openUpdateDialog} setUpdateDialog={setUpdateDialog}/>
        }
        <Container maxWidth="xl">
          <Stack spacing={4} >
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  {courseTitle}
                </Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={paths.dashboard.explore}
                    variant="subtitle2"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    color="text.primary"
                    variant="subtitle2"
                  >
                    {courseTitle}
                  </Link>
                </Breadcrumbs>
              </Stack>
              
              <Stack
                alignItems="flex-end"
                justifyContent='center'
                spacing={3}
              > 
                {
                  user?.accountType === 'ADMIN' && 
                  <Stack direction='row' spacing={3}>
                    <Button
                      onClick={() => setUpdateDialog(true)}                    
                      startIcon={(
                        <SvgIcon>
                          <EditIcon />
                        </SvgIcon>
                      )}
                      variant="contained"
                    >
                      Cập nhật thay đổi
                    </Button>
                    <Button
                    onClick={() => setDeleteDialog(true)}                    
                    startIcon={(
                      <SvgIcon>
                        <DeleteIcon />
                      </SvgIcon>
                    )}
                    variant="contained"
                    color="error"
                  >
                    Xóa khóa học
                  </Button>
                  </Stack>
                }
                {
                  user?.accountType === 'LEARNER' && !registered && price === 0 && 
                  <Button
                    onClick={handleRegisterCourse}
                    startIcon={(
                      <SvgIcon>
                        <PlusIcon />
                      </SvgIcon>
                    )}
                    variant="contained"
                  >
                    Đăng kí khóa học
                  </Button>
                }
                {
                  user?.accountType === 'LEARNER' && !registered && !inCart && price !== 0 && <Button
                    onClick={handleAddCart}                    
                    startIcon={(
                      <SvgIcon>
                        <PlusIcon />
                      </SvgIcon>
                    )}
                    variant="contained"
                  >
                    Chọn khóa học vào giỏ hàng
                  </Button>
                }
                {
                  user?.accountType === 'LEARNER' && inCart && <Button
                    component={NextLink}                 
                    href={paths.dashboard.cart}
                    startIcon={(
                      <SvgIcon>
                        <ShoppingCartCheckoutIcon />
                      </SvgIcon>
                    )}
                    variant="contained"
                  >
                    Trong giỏ hàng
                  </Button>
                }
                {
                  user?.accountType === 'LEARNER' && registered && 
                  <Alert variant="filled" severity="success" sx={{ color: 'white' }}>
                    Bạn đang học khóa học này
                  </Alert>
                }
                {
                  !registered && user?.accountType === 'LEARNER' && price !== 0 &&  (
                    salePercent !== 0 ?   
                    <Stack direction={'row'} spacing={2} alignItems={'center'} padding={1} borderRadius={2} border={'1px solid'}>
                      <Box padding={1} bgcolor={theme.palette.primary.main}>
                        <Typography variant='h5' color={'white'}>{`-${salePercent*100}%`}</Typography>
                      </Box>
                      <Stack>
                        <Typography variant='h6' sx={{textDecoration: 'line-through', textAlign: 'right'}}>{`${price.toLocaleString('en-DE')} ₫`}</Typography>
                        <Typography variant='h2'>{salePercent < 1 ? `${(price*(1 - salePercent)).toLocaleString('en-DE')} ₫` : 'FREE'}</Typography>
                      </Stack>
                    </Stack>
                    :
                    <Stack padding={1} borderRadius={2} border={'1px solid'}>
                      <Typography variant='h2'>{`${price?.toLocaleString('en-DE')}₫`}</Typography>
                    </Stack>
                  )
                }
              </Stack>
            </Stack>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} lg={5}>
                <CardMedia sx={{height: 300}} image={!avatarId ? "/assets/cards/card-visa.png" :`${process.env.NEXT_PUBLIC_SERVER_API}/files/${avatarId}`}/>
              </Grid>
              
              <Grid item xs={12} md={6} lg={7}>
                <Stack spacing={3} direction={"column"} marginLeft={2} marginRight={2}>
                  <Stack direction={"column"} spacing={5}>
                    <Stack direction={"row"} spacing={3} justifyContent={'space-between'}>  
                      {/* <Rating name="read-only" value={parseInt(rating,10)} readOnly /> */}
                      <Typography variant='h5'>
                        Trình độ: {level}
                      </Typography>
                      { user?.accountType === 'ADMIN' && <Button
                        component={NextLink}
                        href={`${paths.dashboard.explore}/${courseId}/edit`}
                        variant='outlined'
                        startIcon={
                          <SvgIcon>
                            <EditIcon />
                          </SvgIcon>
                        }
                      >
                        Cập nhật thông tin chung
                      </Button>}
                    </Stack>
                    <Typography variant='h5'>
                      Cập nhật: {updatedAt}
                    </Typography>
                  </Stack>
                  <Typography variant='h6'dangerouslySetInnerHTML={{__html: courseDescription}}/>
                </Stack>
              </Grid>
            </Grid>
            {
              studied && studied.pass && studied.nextCourseId && 
              <Stack direction={'row'} spacing={2} alignItems={'center'}>
                <Typography variant='h5'>Bạn đã đủ điều kiện để chuyển sang khóa học tiếp theo trong lộ trình học.</Typography>
                <Button
                  variant='outlined'
                  onClick={handleUpdateNextCourse}
                  href={`${paths.dashboard.explore}/${studied.nextCourseId}`}
                  endIcon={(
                    <SvgIcon>
                      <ArrowForwardIcon />
                    </SvgIcon>
                  )}
                >
                  Học khóa học kế tiếp
                </Button>
              </Stack>
            }
            <Card>
              {
                user?.accountType !== 'ADMIN' ?
                <CollapsibleTable 
                  accountType = {user?.accountType}
                  registered = {registered}
                  rows={topicList}  
                  courseTitle={courseTitle}
                />:
                <TopicEditTable rows={topicList} setTopicList={setTopicList} updateOrder={handleUpdateOrder}/>
              }
            </Card>
            {user?.accountType !== 'LEARNER'  && 
              <>
                <Button
                  startIcon={(
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  onClick={() => setOpenCreateLessonDialog(true)} 
                >
                  Thêm bài học mới
                </Button>
                <CreateLessonDialog
                  courseId = {courseId}
                  order = {topicList.length != 0 ? topicList.length : 1}
                  setTopicList={setTopicList}
                  openCreateLessonDialog={openCreateLessonDialog}
                  setOpenCreateLessonDialog={setOpenCreateLessonDialog}
                />
              </>
            }
          </Stack>
        </Container>
      </Box>
    </>
  );
};

LessonList.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default LessonList;
