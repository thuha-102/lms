import Head from "next/head";
import NextLink from 'next/link';
import { usePageView } from "../../../../hooks/use-page-view";
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { Box, Breadcrumbs, Container, Link, Stack, Typography } from "@mui/material";
import { BreadcrumbsSeparator } from "../../../../components/breadcrumbs-separator";
import { paths } from "../../../../paths";
import { CourseEditForm } from "../../../../sections/dashboard/explore/explore-edit-form"

const CourseEdit = () => {
    usePageView();

    return (
        <>
        <Head>
            <title>
                Chỉnh sửa khóa học
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
                    Chỉnh sửa khóa học
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
                    href={paths.dashboard.academy}
                    variant="subtitle2"
                    >
                    Khoá học của tôi
                    </Link>
                    <Link
                    color="text.secondary"
                    variant="subtitle2"
                    underline="none"
                    >
                    Chỉnh sửa
                    </Link>
                </Breadcrumbs>
                </Stack>
                <CourseEditForm />
            </Stack>
            </Container>
        </Box>
        </>
    );
};

CourseEdit.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default CourseEdit;
