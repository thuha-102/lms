// import { useEffect, useState, useRef } from 'react';
// import { Layout as DashboardLayout } from '../../../../layouts/dashboard';

// const Page = () => {

//     const viewer = useRef(null);

//     useEffect(() => {
//       import('@pdftron/webviewer').then(() => {
//         WebViewer(
//           {
//             path: '/lib',
//             initialDoc: `${process.env.NEXT_PUBLIC_SERVER_API}/learning-materials/${534}`,
//           },
//           viewer.current,
//         ).then((instance) => {
//             const { docViewer } = instance;
//             // you can now call WebViewer APIs here...
//           });
//       })
//     }, []);


//     return (
//       <div className="MyComponent">
//         <div className="header">React sample</div>
//         <div className="webviewer" ref={viewer} style={{height: "100vh"}}></div>
//       </div>
//     );
  
// }
// Page.getLayout = (page) => (
//     <DashboardLayout>
//         {page}
//       </DashboardLayout>
//     );
    
// export default Page;

// import Head from 'next/head';
// import { addDays, subDays, subHours, subMinutes } from 'date-fns';
// import { useCallback, useState, useEffect } from 'react';
// import NextLink from 'next/link';
// import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
// import {
//   Box,
//   Button,
//   Card,
//   Container,
//   Stack,
//   SvgIcon,
//   Typography,
//   Unstable_Grid2 as Grid
// } from '@mui/material';
// import { usePageView } from '../../../../hooks/use-page-view';
// import { useSettings } from '../../../../hooks/use-settings';
// import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
// import { Course } from '../../../../sections/dashboard/overview/course';
// import { paths } from '../../../../paths';
// import { useMounted } from '../../../../hooks/use-mounted';
// import { exploreApi } from '../../../../api/explore';
// import PreviewFile from '../../../../sections/dashboard/explore/preview_lm/preview_file'

// const now = new Date();

// const Page = () => {
//   const isMounted = useMounted();
//   const settings = useSettings();
//   const [listCourses, setListCourses] = useState([]);

//   const getCourses = useCallback(async () => {
//     try {
//       const response = await exploreApi.getListCourse();

//       if (isMounted()) {
//         setListCourses([...response.data]);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }, [])

//   useEffect(() => {
//     getCourses();
//   },[]);

//   usePageView();

//   return (
//     <>
//       <Head>
//         <title>
//           Dashboard: Overview | Devias Kit PRO
//         </title>
//       </Head>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           py: 8
//         }}
//       >
//         <Container maxWidth={settings.stretch ? false : 'xl'}>
//           <Grid
//             container
//             disableEqualOverflow
//             spacing={{
//               xs: 3,
//               lg: 4
//             }}
//           >
//             <Grid xs={12}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 spacing={4}
//               >
//                 <div>
//                   <Typography variant="h4">
//                     Các khoá học mới
//                   </Typography>
//                 </div>
//                 <div>
//                   <Stack
//                     direction="row"
//                     spacing={4}
//                   >
//                     <Button
//                       component={NextLink}
//                       href={`${paths.dashboard.explore}/create`}
//                       // onClick={() => setOpenCreateCourseDialog(true)}
//                       startIcon={(
//                         <SvgIcon>
//                           <PlusIcon />
//                         </SvgIcon>
//                       )}
//                       variant="contained"
//                     >
//                       Tạo khoá học mới
//                     </Button>
//                   </Stack>
//                 </div>
//               </Stack>
//             </Grid>
//           </Grid>
//           <Card>
//             <PreviewFile lmId={534} />
//           </Card>
//         </Container>
//       </Box>
//     </>
//   );
// };

// Page.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

// export default Page;


import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';

import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Link,
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
import { exploreApi } from '../../../../api/explore';

import PreviewFile from '../../../../sections/dashboard/explore/preview_lm/preview_file'
import PreviewVideo from '../../../../sections/dashboard/explore/preview_lm/preview_video'
import PreviewOfficeFile from '../../../../sections/dashboard/explore/preview_lm/preview_office'
import PreviewCode from '../../../../sections/dashboard/explore/preview_lm/preview_code'
import { PreviewQuestion } from '../../../../sections/dashboard/explore/preview_lm/preview_question';
import { LmRating } from '../../../../sections/dashboard/explore/preview_lm/lm_rating'
import { learning_logApi } from '../../../../api/learning-log';
import { useAuth } from '../../../../hooks/use-auth';



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


const useLMs = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    LMs: [],
    LMsCount: 0
  });

  const getLMs = useCallback(async () => {
    try {
      // const response = await lm_manageApi.getLMs(search);
      const response = await lm_manageApi.getLMs();
      let data = response.data;
      if (typeof search.filters !== 'undefined') {
        data = data.filter((lm) => {
          if (typeof search.filters.name !== 'undefined' && search.filters.name !== '') {
            const nameMatched = lm.name.toLowerCase().includes(filters.name.toLowerCase());
  
            if (!nameMatched) {
              return false;
            }
          }
  
          // It is possible to select multiple type options
          if (typeof search.filters.type !== 'undefined' && search.filters.type.length > 0) {
            const categoryMatched = search.filters.type.includes(lm.type);
  
            if (!categoryMatched) {
              return false;
            }
          }
  
          // It is possible to select multiple topicId options
          if (typeof search.filters.topicId !== 'undefined' && search.filters.topicId.length > 0) {
            const statusMatched = search.filters.topicId.includes(lm.topicId);
  
            if (!statusMatched) {
              return false;
            }
          }
  
          // Present only if filter required
          if (typeof search.filters.inStock !== 'undefined') {
            const stockMatched = lm.inStock === search.filters.inStock;
  
            if (!stockMatched) {
              return false;
            }
          }
  
          return true;
        });
      }
  
      // if (typeof search.page !== 'undefined' && typeof search.rowsPerPage !== 'undefined') {
      //   data = applyPagination(data, search.page, search.rowsPerPage);
      // }

      if (isMounted()) {
        setState({
          LMs: data,
          LMsCount: data.length
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [search, isMounted]);

  useEffect(() => {
      getLMs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]);

  return state;
};



const PreviewLM = () => {
  const previewlmformUrl = window.location.href.split('/');
  const lmId = (previewlmformUrl[previewlmformUrl.length - 1]);
  const [currentTime, setCurrentTime] = useState(0); //current time for video
  const [valueRating, setValueRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(3);
  const { search, updateSearch } = useSearch();
  const { LMs, LMsCount } = useLMs(search);
  const isMounted = useMounted();
  const {user} = useAuth();

  const [lm, setLm] = useState("")
  // const [lessonList, setLessonList] = useState([]);
  // const [courseTitle, setCourseTitle] = useState("");

  const getDetailLM = useCallback(async (id) => {
    try {
      const response = await lm_manageApi.getDetailLM(id);


      if (isMounted()) {
        // console.log(response.data)
        // setFileGet(response.data.url);
        setLm(response.data)
        // console.log(fileGet)

      }
    } catch (err) {
      console.error(err);
    }
  }, [lm])

  const createFileLog = async (lmId, user) => {
    try {
      const response = await learning_logApi.createLog(user.id, {
        rating: valueRating,
        time: 120, //chỗ này cần phải lấy time của lm sau đó gắn vào
        attempts: 1,
        learningMaterialId: lmId,
      });
      console.log(response);

    } catch (err) {
      console.error(err);
    }
  }


  // useEffect(() => {async () => {
  //   try {
  //     const response = await exploreApi.detailCourse(courseId);
  //     setLessonList(response.data.lessons)
  //     setCourseTitle(response.data.name)

  //   } catch (err) {
  //     console.error(err);
  //   }
  // }}, []);

  useEffect(() => {
    try {
      if(lm.type === "PDF"){
        createFileLog(parseInt(lmId,10), user)
      }
    } catch (err) {
      console.error(err);
    }}, [valueRating]);

  useEffect(() => {
    try {
      getDetailLM(parseInt(lmId,10))

    } catch (err) {
      console.error(err);
    }}, []);

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

  return (
    <>
      <Head>
        <title>
          Quản lý tài liệu học tập
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
                  {/* {courseTitle} */}
                  {lm.name}
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
                    component={NextLink}
                    href={`${paths.dashboard.explore}/create`}
                    variant="subtitle2"
                  >
                    Tạo khoá học mới
                  </Link>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <Card>
              {
                lm.type === "VIDEO" ? <PreviewVideo lmId = {parseInt(lmId, 10)} 
                                                    // currentTime={currentTime} 
                                                    // setCurrentTime={setCurrentTime}
                                                    valueRating={valueRating} 
                                                    /> : <></>
              }{
                lm.type === "PDF" || lm.type === "WORD" || lm.type === 'PPT'? <PreviewOfficeFile lmId = {parseInt(lmId, 10)} /> : <></>
              }
            </Card>
            {/* {console.log(lm)} */}
              {
                lm.type === "QUIZ" ? <PreviewQuestion 
                                        lmId = {parseInt(lmId, 10)} 
                                        user={user}/> : <></>
              }
              {
                lm.type === "CODE" ? <PreviewCode lmId = {parseInt(lmId, 10)}
                                                  value={valueRating} 
                                                  setValue={setValueRating} 
                                                  hover={hoverRating} 
                                                  setHover={setHoverRating} /> : <></>
              }
            <Card>
              {lm.type === "VIDEO" || lm.type === "PDF" 
                ?<LmRating 
                value={valueRating} 
                setValue={setValueRating} 
                hover={hoverRating} 
                setHover={setHoverRating}
              /> : <></>}
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

PreviewLM.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PreviewLM;
