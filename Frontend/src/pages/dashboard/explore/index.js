import Head from 'next/head';
import { useCallback, useState, useEffect } from 'react';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Link,
  Typography,
  Unstable_Grid2 as Grid,
  Breadcrumbs
} from '@mui/material';
import { usePageView } from '../../../hooks/use-page-view';
import { useSettings } from '../../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { CourseCard } from '../../../sections/dashboard/academy/course-card';
import { paths } from '../../../paths';
import { useMounted } from '../../../hooks/use-mounted';
import { exploreApi } from '../../../api/explore';
import { useAuth } from '../../../hooks/use-auth';
import { CourseSearch } from '../../../sections/dashboard/academy/course-search';
import * as consts from '../../../constants';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';

// import { CreateCourseDialog } from '../../../sections/dashboard/explore/create-course-dialog';

const now = new Date();

const Page = () => {
  const isMounted = useMounted();
  const { user } = useAuth()
  const settings = useSettings();
  const [listCourses, setListCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState(null);


  const getCourses = useCallback(async (filter) => {
    try {
      const response = await exploreApi.getListCourse();
      console.log(filter)
      let course = response.data
      if (filter){
        if (filter.name) course = course.filter(c => c.name.toLowerCase().includes(filter.name))
        if (filter.level && filter.level != "NONE") course = course.filter(c => c.level === filter.level)
      }

      if (isMounted()) {
        setListCourses(course);
      }
    } catch (err) {
      console.error(err);
    }
  }, [])

  useEffect(() => {
    getCourses(filter);
  },[filter]);

  const handleFilter = useCallback((filterBy) => setFilter(filterBy), [])

  usePageView();

  return (
    <>
      <Head>
        <title>
          Khám phá các khóa học
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
        <Grid
            container
            disableEqualOverflow
            spacing={{
              xs: 3,
              lg: 4
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
                marginBottom={2}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">
                    Toàn bộ khóa học
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
              </Stack>
              <CourseSearch onFilter = {handleFilter}/>
            </Grid>
            {listCourses
            .slice(page*consts.FORUMS_PER_PAGE, page*consts.FORUMS_PER_PAGE + consts.FORUMS_PER_PAGE)
            .map((_course) => 
            (<Grid
              xs={12}
              md={4}
            >
              <CourseCard course = {_course} isExplore = {true}/>  
            </Grid>
            ))}
          </Grid>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="center"
            spacing={1}
            sx={{
              mt: 4,
              mb: 8
            }}
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
            >
            </Button>
            <Typography variant="body1">
              {page + 1} / {Math.ceil(listCourses.length / consts.FORUMS_PER_PAGE)}
            </Typography>
            <Button
              disabled={page == Math.floor(listCourses.length / consts.FORUMS_PER_PAGE)}
              endIcon={(
                <SvgIcon>
                  <ArrowRightIcon />
                </SvgIcon>
              )}
              onClick={() => {
                setPage(page + 1);
                window.scrollTo(0,0);
              }}
            >
            </Button>
          </Stack>
        </Container>
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
