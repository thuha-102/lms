import { useCallback, useEffect, useState } from 'react';
import { useMounted } from '../../../../hooks/use-mounted';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Stack, Typography } from '@mui/material';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { learningPathApi } from '../../../../api/learning-path';
import { LearningPathUpdateForm } from '../../../../sections/dashboard/learning-path-manage/learning-path-manage-update-form';
// import { TopicGraph } from '../../../../sections/dashboard/topic-manage/topic-graph';

const useTopics = (typeLearnerId) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    typeLearnerName: '',
    isLoading: true // Thêm trạng thái loading
  });

  const getTopics = useCallback(async () => {
    try {
      const response = await learningPathApi.getSequenceCouresByLearnerId({ typeLearnerId });
      console.log(response.typeLearnerName);
      if (isMounted()) {
        setState({
          typeLearnerName: response.data.typeLearnerName,
          isLoading: false // Đặt isLoading thành false sau khi dữ liệu đã được lấy
        });
      }
    } catch (err) {
      console.error(err);
      setState((prevState) => ({
        ...prevState,
        isLoading: false // Đặt isLoading thành false ngay cả khi có lỗi
      }));
    }
  }, [isMounted, typeLearnerId]);

  useEffect(() => {
    if (typeLearnerId) {
      getTopics();
    }
  }, [getTopics, typeLearnerId]);

  return state;
};

const LearningPathUpdate = () => {
  const [typeLearnerId, setTypeLearnerId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const typeLearnerUrl = window.location.href.split('/');
      setTypeLearnerId(typeLearnerUrl[typeLearnerUrl.length - 1]);
    }
  }, []);

  const { typeLearnerName, isLoading } = useTopics(typeLearnerId);
  
  usePageView();

  // Render loading state while data is being fetched
  if (isLoading) {
    return (
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Typography variant="h6">Đang tải dữ liệu...</Typography>
        </Container>
      </Box>
    );
  }

  // If no typeLearnerName is fetched, avoid rendering form
  if (!typeLearnerName) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard: Course Create</title>
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
              <Typography variant="h4">Chỉnh sửa lộ trình học</Typography>
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
                <Typography color="text.secondary" variant="subtitle2">
                  Chỉnh sửa
                </Typography>
              </Breadcrumbs>
            </Stack>
            <LearningPathUpdateForm 
              typeLearnerId={typeLearnerId}
              typeLearnerName={typeLearnerName}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

LearningPathUpdate.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default LearningPathUpdate;