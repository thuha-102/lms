import Head from 'next/head';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Link,
  Breadcrumbs
} from '@mui/material';
import { usePageView } from '../../../hooks/use-page-view';
import { useSettings } from '../../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { AcademyDailyProgress } from '../../../sections/dashboard/academy/academy-daily-progress';
import { AcademyFind } from '../../../sections/dashboard/academy/academy-find';
import NextLink from 'next/link';
import { CourseCard } from '../../../sections/dashboard/academy/course-card';
import { CourseCardDelete } from '../../../sections/dashboard/academy/course-card-instructor';
import { CourseSearch } from '../../../sections/dashboard/academy/course-search';
import { useMounted } from '../../../hooks/use-mounted';
import { useCallback, useEffect, useState } from 'react';
import { userApi } from '../../../api/user';
import { useAuth } from '../../../hooks/use-auth';
import * as consts from '../../../constants';
import { paths } from '../../../paths';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';

const useCourses = (id, accountType, filter) => {
  const isMounted = useMounted();
  const [listCourses, setListCourses] = useState([{
          id: 0,
          name: "",
          amountOfTime: 0,
          description: "",
          visibility: true
    }]);

  const getListCourses = useCallback(async (filter) => {
    try {
        const response = accountType === "LEARNER" ? await userApi.getUserCourses(id) : await userApi.getOwnCourses(id);
        
        let courses = response.data
        
        if (filter) {
          courses = courses.filter(c => c.name.toLowerCase().includes(filter.name.toLowerCase()))          
          if (filter.level !== "NONE") courses = courses.filter(c => c.level.includes(filter.level))
          courses = courses.filter(c => c.visibility === filter.visibility)
        }
        
        if (isMounted()) {
          setListCourses(courses);
        }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getListCourses(filter);
  }, [id, filter]);

  return listCourses; 
};


const Page = () => {
  const settings = useSettings();
  const {user} = useAuth()
  const [filter, setFilter] = useState(null);
  const courses = useCourses(user?.id, user?.accountType, filter);
  const [page, setPage] = useState(0);
  const handleFilter = useCallback((filterBy) => setFilter(filterBy), [])

  usePageView();

  return (
    <>
      <Head>
        <title>
          Khóa học của tôi
        </title>
      </Head>
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
      >
        <Box sx={{ py: '64px' }}>
          <Container maxWidth={settings.stretch ? false : 'xl'}>
            <Grid
              container
              spacing={{
                xs: 3,
                lg: 4
              }}
            >
              <Grid xs={12}>
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                  marginBottom={2}
                >
                  <>  
                    <Stack spacing={1}>
                      <Typography variant="h4">
                        {user.accountType === "LEARNER" ? "Các khóa học đã đăng kí" : "Các khóa học đã tạo"}
                      </Typography>
                      <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                        <Link
                          color="text.primary"
                          component={NextLink}
                          href={paths.dashboard.index}
                          variant="subtitle2"
                        >
                          Trang chủ
                        </Link>
                        <Link
                          color="text.primary"
                          component={NextLink}
                          href={paths.dashboard.explore}
                          variant="subtitle2"
                        >
                          Toàn bộ khóa học
                        </Link>
                      </Breadcrumbs>
                    </Stack>
                    <div>
                      <Stack
                        direction="row"
                        spacing={4}
                      >
                        {user.accountType !== 'LEARNER' && <Button
                          component={NextLink}
                          href={`${paths.dashboard.explore}/create`}
                          startIcon={(
                            <SvgIcon>
                              <PlusIcon />
                            </SvgIcon>
                          )}
                          variant="contained"
                        >
                          Tạo khoá học mới
                        </Button>}
                      </Stack>
                    </div>
                  </>
                </Stack>
                <CourseSearch isInstructor={user.accountType!=="LEARNER"} onFilter={handleFilter} />
              </Grid>
              { 
                user.accountType === "LEARNER" && courses.length !== 0 && courses
                .slice(page*consts.FORUMS_PER_PAGE, page*consts.FORUMS_PER_PAGE + consts.FORUMS_PER_PAGE)
                .map((history) => (
                  <Grid
                    key={history.course?.id}
                    xs={12}
                    md={4}
                  >
                    {history.course && <CourseCard course={history.course}/>}
                  </Grid>
              ))
              }
              { 
                user.accountType !== "LEARNER" && courses.length !== 0 && courses
                .slice(page*consts.FORUMS_PER_PAGE, page*consts.FORUMS_PER_PAGE + consts.FORUMS_PER_PAGE)
                .map(( course )=> (
                  <Grid
                    key={course?.id}
                    xs={12}
                    md={4}
                  >
                    {course && <CourseCardDelete course={course}/>}
                  </Grid>
              ))
              }
              {
                courses.length === 0 && user.accountType === "LEARNER" && <Typography>Bạn chưa đăng kí khóa học nào, <Link href={paths.dashboard.explore}>khám phá thêm</Link></Typography>
              }
              {
                courses.length === 0 && user.accountType !== "LEARNER" && <Typography>Không có khóa học để hiển thị</Typography>
              }
            </Grid>
            {
              courses.length !== 0 && 
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="center"
                spacing={1}
                sx={{
                  mt: 4,
                  mb: 8
                }
              }
              >
                <Button
                  disabled={page == 0}
                  startIcon={(
                    <SvgIcon>
                      <ArrowLeftIcon />
                    </SvgIcon>
                  )}
                  onClick={() => {
                    setPage(page - 1);
                    window.scrollTo(0,0);
                  }}
                />
                <Typography variant="body1">
                  {page + 1} / {Math.ceil(courses.length / consts.FORUMS_PER_PAGE)}
                </Typography>
                <Button
                  disabled={page == Math.floor(courses.length / consts.FORUMS_PER_PAGE)}
                  endIcon={(
                    <SvgIcon>
                      <ArrowRightIcon />
                    </SvgIcon>
                  )}
                  onClick={() => {
                    setPage(page + 1);
                    window.scrollTo(0,0);
                  }}
                />
              </Stack>
            }
          </Container>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
