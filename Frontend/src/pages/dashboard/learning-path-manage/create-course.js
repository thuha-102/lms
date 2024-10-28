import { useCallback, useEffect, useState } from 'react';
import { useMounted } from '../../../hooks/use-mounted';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Stack, Typography } from '@mui/material';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { topic_manageApi } from '../../../api/topic-manage';
import { LearningPathCreateForm } from '../../../sections/dashboard/learning-path-manage/learning-path-manage-create-form';
import { TopicGraph } from '../../../sections/dashboard/topic-manage/topic-graph';
import { CourseCreateForm } from '../../../sections/dashboard/learning-path-manage/course-create-form';


const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      title: undefined,
      subject: [],
    },
    page: 0,
    rowsPerPage: 5
  });

  return {
    search,
    updateSearch: setSearch
  };
};

const useTopics = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    Topics: [],
    TopicsCount: 0
  });

  const getTopics = useCallback(async () => {
    try {
      const response = await topic_manageApi.getListTopic();
      let topics = search.filters.subject.length !== 0 ? response.data.filter(topic => search.filters.subject.includes(topic.subject)) : response.data;
      if (search.title)
        topics = topics.filter(topic => topic.title.indexOf(search.title) !== -1)
      
      if (isMounted()) {
        setState({
          Topics: topics,
          TopicsCount: topics.length
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [search, isMounted]);

  useEffect(() => {
      getTopics();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]);

  return state;
};

const LearningPathCreate = () => {
  const { search, updateSearch } = useSearch();
  const { Topics, TopicsCount } = useTopics(search);
  usePageView();

  return (
    <>
      <Head>
        <title>
        Dashboard: Course Create
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
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4">
                Tạo khoá học mới
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
                  href={paths.dashboard.learning_path_manage}
                  variant="subtitle2"
                >
                  Quản lý lộ trình học
                </Link>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={`${paths.dashboard.learning_path_manage}/create`}
                  variant="subtitle2"   
                >
                  Tạo lộ trình học mới
                </Link>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  Tạo khoá học mới
                </Typography>
              </Breadcrumbs>
            </Stack>
            {/* <TopicGraph topics={Topics}/> */}
            <CourseCreateForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

LearningPathCreate.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default LearningPathCreate;
