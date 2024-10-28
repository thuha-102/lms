import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Stack, Typography } from '@mui/material';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { LMEditForm } from '../../../../sections/dashboard/explore/lm-manage/lm-manage-edit-form';

const LMEdit = () => {
  usePageView();

  return (
    <>
      <Head>
        <title>
          Chỉnh sửa tài liệu
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
                Chỉnh sửa tài liệu học
              </Typography>
              {/* <Breadcrumbs separator={<BreadcrumbsSeparator />}>
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
                  href={paths.dashboard.lm_manage}
                  variant="subtitle2"
                >
                  Danh sách bài học
                </Link>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  Tạo mới
                </Typography>
              </Breadcrumbs> */}
            </Stack>
            <LMEditForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

LMEdit.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default LMEdit;
