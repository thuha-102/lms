import Head from 'next/head';
import { useState, useCallback, useEffect, useMemo } from 'react';
import Shuffle01Icon from '@untitled-ui/icons-react/build/esm/Shuffle01';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  LinearProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import NextLink from 'next/link';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { usePageView } from '../../../hooks/use-page-view';
import { useSettings } from '../../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { CourseDone } from '../../../sections/dashboard/learning-path/course-done';
import { CourseProcess } from '../../../sections/dashboard/learning-path/course-process';
import { CourseLock } from '../../../sections/dashboard/learning-path/course-lock';
import { useMounted } from '../../../hooks/use-mounted';
import { learningPathApi } from '../../../api/learning-path';
import { useRouter } from 'next/router';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';

const useSequenceCourses = () => {
  const isMounted = useMounted();
  const [sequenceCourses, setSequenceCourses] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const getSequenceCourses = useCallback(async () => {
    try {
      const response = await learningPathApi.getSequenceCouresByLearnerId({learnerId: user.id }); 
      if (router.isReady && isMounted()) {
        if (response.data.courses.length == 0) {
          router.push(paths.dashboard.learningPaths.create);
        } else {
          setSequenceCourses(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, router.isReady]);

  useEffect(() => {
    getSequenceCourses();
  }, [router.isReady]);

  return sequenceCourses;
};

const Page = () => {
  const { user } = useAuth();
  const sequenceCourses = useSequenceCourses();
  const [seeAllComingCourse, setSeeAllComingCourse] = useState(false);
  const [seeAllDoneCourse, setSeeAllDoneCourse] = useState(false);
  const settings = useSettings();

  usePageView();

  if (!sequenceCourses || !user) {
    return null;
  }

  console.log(sequenceCourses)

  return (
    <>
      <Head>
        <title>
          Lộ trình học
        </title>
      </Head> 
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          overflow: 'auto',
          maxWidth: '100%'
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Stack spacing={1}>
            <Typography variant="h3">
              Lộ trình học của bạn
            </Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.dashboard.index}
                variant="subtitle2"
              >
                Dashboard
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Lộ trình học của bạn
              </Typography>
            </Breadcrumbs>
          </Stack>
            
          <Stack mt={10} spacing={10}>
            <Stack>
              <Typography variant="h5" mb={4}>
                Khóa học đang trong tiến trình
              </Typography>
              <Grid container spacing={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid item xs={8}>
                  <CourseProcess {...sequenceCourses.courses[sequenceCourses.currentCourseOrder]} />
                </Grid>
              </Grid>
            </Stack>
            <Stack>
              <Typography variant="h5" mb={4}>
                Khóa học sắp tới
              </Typography>
              {(sequenceCourses.currentCourseOrder == sequenceCourses.courses.length - 1) 
              ? <Typography variant="body1">
                  Không có khóa học mới trong lộ trình
                </Typography>
              : <Grid container spacing={5}>
                {sequenceCourses.courses.slice(sequenceCourses.currentCourseOrder+1, seeAllComingCourse?sequenceCourses.courses.length:sequenceCourses.currentCourseOrder+6).map((c, i) => 
                  <Grid item xs={4} key={i}>
                    <CourseLock {...c}/>
                  </Grid>
                )}
                <Grid item xs={4}>
                  <Stack justifyContent="flex-end" alignItems="flex-start" height="100%">
                    {seeAllComingCourse 
                      ? <Button startIcon={<ArrowBackOutlinedIcon />} color="inherit" onClick={() => setSeeAllComingCourse(false)}>
                        Thu gọn
                      </Button>
                      :<Button endIcon={<ArrowForwardOutlinedIcon />} color="inherit" onClick={() => setSeeAllComingCourse(true)}>
                        Xem tất cả 
                      </Button>
                    }
                  </Stack>
                </Grid>
              </Grid>
            }
            </Stack>
            <Stack>
              <Typography variant="h5" mb={4}>
                Khóa học hoàn thành gần đây
              </Typography>
              {(sequenceCourses.currentCourseOrder == 0) 
              ? <Typography variant="body1">
                  Chưa có khóa học hoàn thành trong lộ trình
                </Typography>
              : <Grid container spacing={5}>
                {sequenceCourses.courses.slice(seeAllDoneCourse?0:sequenceCourses.currentCourseOrder-5, sequenceCourses.currentCourseOrder).reverse().map((c, i) => 
                  <Grid item xs={4} key={i}>
                    <CourseDone {...c}/>
                  </Grid>
                )}
                <Grid item xs={4}>
                  <Stack justifyContent="flex-end" alignItems="flex-start" height="100%">
                    {seeAllDoneCourse 
                      ? <Button startIcon={<ArrowBackOutlinedIcon />} color="inherit" onClick={() => setSeeAllDoneCourse(false)}>
                        Thu gọn
                      </Button>
                      :<Button endIcon={<ArrowForwardOutlinedIcon />} color="inherit" onClick={() => setSeeAllDoneCourse(true)}>
                        Xem tất cả 
                      </Button>
                    }
                  </Stack>
                </Grid>
              </Grid>
              }
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
