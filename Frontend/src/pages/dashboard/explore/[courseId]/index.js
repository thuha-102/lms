import { use, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
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
  const [inCart, setInCart] = useState(false)
  const [topicList, setTopicList] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [level, setLevel] = useState("");
  const [rating, setRating] = useState("");
  const [updatedAt, setUpdated] = useState("");
  const [avatarId, setAvatarId] = useState(null);
  const [openCreateLessonDialog, setOpenCreateLessonDialog] = useState(false)

  useEffect(() => {(async () => {
    try {
      const response = await exploreApi.detailCourse(courseId, user.id);
      setAvatarId(response.data.avatarId)
      setTopicList(response.data.topics)
      setCourseTitle(response.data.name)
      setCourseDescription(response.data.description)
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
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
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
                alignItems="center"
                direction="row"
                spacing={3}
              > 
                {
                  user?.accountType === 'ADMIN' && <Button
                    // onClick={handleRegisterCourse}                    
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
              </Stack>
            </Stack>
            <Grid container spacing={5}>
              <Grid size={{ xs: 6, md: 10 }}>
                <img src={!avatarId ? "assets/cards/card-visa.png" :`${process.env.NEXT_PUBLIC_SERVER_API}/files/${avatarId}`} width={600} height={300}/>
              </Grid>
              
              <Grid size={{ xs: 6, md: 8 }}>
                <CardContent>
                  <Stack container spacing={3} direction={"column"}>
                  <Stack direction={"column"} spacing={5}>
                    <Stack direction={"row"} spacing={3}>  
                      <Rating name="read-only" value={parseInt(rating,10)} readOnly />
                      <Typography variant='h5'>
                        Trình độ: {level}
                      </Typography>
                    </Stack>
                    
                    <Typography variant='h5'>
                      Cập nhật: {updatedAt}
                    </Typography>
                  </Stack>
                  <Grid item >
                    <Typography variant='h6'dangerouslySetInnerHTML={{__html: courseDescription}}/>
                  </Grid>
                </Stack>
                </CardContent>
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
                <TopicEditTable rows={topicList} updateOrder={handleUpdateOrderTopic}/>
              }
            </Card>
            {user?.accountType !== 'LEARNER'  && 
                <>
                <Button
                  component={NextLink}
                  // Thay đổi đường dẫn để lưu vào db
                  // href={`${paths.dashboard.explore}/lesson/${courseId}`}
                  href={"#"}

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