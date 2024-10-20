import { use, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import EditIcon from '@mui/icons-material/Edit';
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
  Typography
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
  const [updatedAt, setUpdated] = useState("");
  const [avatarId, setAvatarId] = useState(null);
  const [openCreateLessonDialog, setOpenCreateLessonDialog] = useState(false)
  const [openDeleteDialog, setDeleteDialog] = useState(false)
  const [openUpdateDialog, setUpdateDialog] = useState(false)

  useEffect(() => {(async () => {
    try {
      const response = await exploreApi.detailCourse(courseId, user.id);
      setAvatarId(response.data.avatarId)
      setTopicList(response.data.topics)
      setCourseTitle(response.data.name)
      setCourseDescription(response.data.description)
      setPrice(response.data.price)
      setSalePercent(response.data.salePercent)
      setLevel(response.data.level)
      setUpdated(response.data.updatedAt.slice(8, 10) + '-' + response.data.updatedAt.slice(5, 7) + '-' + response.data.updatedAt.slice(0, 4))
      setRegistered(response.data.registered)
      setInCart(response.data.inCart)
    } catch (err) {
      console.error(err);
    }
  })()}, [registered, inCart]);

  usePageView();

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

  const handleUpdateOrderTopic = useCallback(async (sourceId, destinationId) => {
    let temp = deepCopy(topicList)
    temp[sourceId] = topicList[destinationId]
    temp[destinationId] = topicList[sourceId]
    setTopicList(temp)
  }, [topicList])

  const handleAddCart = useCallback(async () => {
    await userApi.addCart(user.id, courseId)
    setInCart(true)
  }, [user, courseId])

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
          openUpdateDialog && <CourseUpdateDialog request={{orderTopicIds: topicList.map(topic => topic.id)}} courseId={courseId} open={openUpdateDialog} setUpdateDialog={setUpdateDialog}/>
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
                  user?.accountType === 'LEARNER' && !registered && !inCart && <Button
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
                  !registered && user?.accountType === 'LEARNER' && (
                    salePercent === 0 ? 
                    <Stack direction={'row'} spacing={2} alignItems={'center'} padding={1} borderRadius={2} border={'1px solid'}>
                      <Typography variant='h5' color={'red'}>{`-${salePercent*100}%`}</Typography>
                      <Stack>
                        <Typography variant='h6' sx={{textDecoration: 'line-through', textAlign: 'right'}}>{`${price.toLocaleString('en-DE')} ₫`}</Typography>
                        <Typography variant='h2'>{`${(price*(1 - salePercent)).toLocaleString('en-DE')} ₫`}</Typography>
                      </Stack>
                    </Stack>
                    :
                    <Stack padding={1} borderRadius={2} border={'1px solid'}>
                      <Typography variant='h2'>{`${price.toLocaleString('en-DE')} ₫`}</Typography>
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
                      <Button
                        component={NextLink}
                        href={`${paths.dashboard.explore}/${courseId}/edit`}
                        variant='outlined'
                      >
                        <SvgIcon>
                          <EditIcon />
                        </SvgIcon>
                      </Button>
                    </Stack>
                    <Typography variant='h5'>
                      Cập nhật: {updatedAt}
                    </Typography>
                  </Stack>
                  <Typography variant='h6'dangerouslySetInnerHTML={{__html: courseDescription}}/>
                </Stack>
              </Grid>
            </Grid>
            <Card>
              {
                user?.accountType !== 'ADMIN' ?
                <CollapsibleTable 
                  accountType = {user?.accountType}
                  registered = {registered}
                  rows={topicList}  
                  courseTitle={courseTitle}
                />:
                <TopicEditTable rows={topicList} setTopicList={setTopicList} updateOrder={handleUpdateOrderTopic}/>
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
