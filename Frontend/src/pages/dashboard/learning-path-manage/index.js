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
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { LearningPathManageListSearch } from '../../../sections/dashboard/learning-path-manage/learning-path-manage-list-search';
import { LearningPathManageListTable } from '../../../sections/dashboard/learning-path-manage/learning-path-manage-list-table';
import { learningPathApi } from '../../../api/learning-path';
import { TopicGraph } from '../../../sections/dashboard/topic-manage/topic-graph';

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

const useTypeLearner = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    TypeLearner: [],
    TypeLearnerCount: 0
  });

  const getTypeLearner = useCallback(async () => {
    try {
      const response = await learningPathApi.getSequenceCoures();
      let topics = search.filters.subject.length !== 0 ? response.data.filter(topic => search.filters.subject.includes(topic.subject)) : response.data;
      if (search.title)
        topics = topics.filter(topic => topic.title.indexOf(search.title) !== -1)
      
      if (isMounted()) {
        setState({
          TypeLearner: topics,
          TypeLearnerCount: topics.length
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [search, isMounted]);

  useEffect(() => {
      getTypeLearner();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]);

  return state;
};

const CourseList = () => {
  const { search, updateSearch } = useSearch();
  const { TypeLearner, TypeLearnerCount } = useTypeLearner(search);

  usePageView();

  const handleFiltersChange = useCallback((filters) => {
    updateSearch((prevState) => ({
      ...prevState,
      filters
    }));
  }, [updateSearch]);

  const handleSearchChange = useCallback((title) => {
    updateSearch((prevState) => ({
      ...prevState,
      ...{
        title
      }
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
          Quản lý khoá học tập
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
                  Quản lý lộ trình học
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
                </Breadcrumbs>
              </Stack>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <Button
                  component={NextLink}
                  // Thay đổi đường dẫn để lưu vào db
                  href={`${paths.dashboard.learning_path_manage}/create`}
                  startIcon={(
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Thêm nhóm người học
                </Button>
              </Stack>
            </Stack>
            {/* <TopicGraph topics={TypeLearner}/> */}
            <Card>
              <LearningPathManageListSearch onFiltersChange={handleFiltersChange} onSearchChange={handleSearchChange}/>
              <LearningPathManageListTable
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={search.page}
                TypeLearner={TypeLearner}
                TypeLearnerCount={TypeLearnerCount}
                rowsPerPage={search.rowsPerPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CourseList.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default CourseList;
