import { useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Input,
} from '@mui/material';
import { datasetApi } from '../../../api/dataset';
import { userApi } from '../../../api/user';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';
import { DatasetCard } from '../../../sections/dashboard/dataset/dataset-card';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import * as consts from '../../../constants';

const Page = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState([false, true]);
  const [datasets, setDatasets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const getDatasets = async (criteria) => {
      try {
        const response = await datasetApi.getDatasets(criteria);
        const datasetsInfo = await Promise.all(response.data.map(async r => {
          const userResponse = await userApi.getUser(r.userId);
          return {
            ...r, 
            author: {
              avatar: userResponse.data.avatar,
              name: userResponse.data.username
            }
          }
        }));
        setDatasets(datasetsInfo);
      } catch (err) {
        console.error(err);
      }
    };

    getDatasets(filters[1] ? {userId: user.id} : {userId: user.id, isPublic: true});
  }, [filters, user])

  usePageView();

  if (!user) return null;

  return (
    <>
      <Head>
        <title>
          Danh sách các tập dữ liệu
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
          <Stack spacing={1}>
            <Typography variant="h3">
              Tập dữ liệu
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
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.dashboard.dataset.index}
                variant="subtitle2"
              >
                Tập dữ liệu
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Danh sách
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Card
            elevation={16}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              display: 'flex',
              px: 3,
              py: 2, 
              mb: 2,
              mt: 6,
            }}
          >
            <SvgIcon fontSize="medium" htmlColor="#848C97" >
              <SearchMdIcon />
            </SvgIcon>
            <Input placeholder="Tìm kiếm tập dữ liệu..." disableUnderline fullWidth sx={{marginLeft: 2}} inputProps={{ style: { fontSize: '17px' } }}/>
          </Card>
          <Stack direction="row" justifyItems="flex-start" spacing={2} sx={{mb: 8}}>
            <Button 
              color="inherit" 
              sx={{border: '1px solid', borderColor: "text.disabled", borderRadius: 10, py: 1}}
              startIcon={<FilterListOutlinedIcon />}
            >
              Bộ lọc
            </Button>
            <Button 
              color="inherit" 
              sx={{border: '1px solid', borderColor: "text.disabled", borderRadius: 10, py: 1, backgroundColor: filters[0]?"action.disabledBackground":"inherit"}}
              startIcon={<ListAltOutlinedIcon />}
              onClick={() => setFilters([!filters[0], !filters[1]])}
            >
              Tất cả
            </Button>
            <Button 
              color="inherit" 
              sx={{border: '1px solid', borderColor: "text.disabled", borderRadius: 10, py: 1, backgroundColor: filters[1]?"action.disabledBackground":"inherit"}}
              startIcon={<SubdirectoryArrowRightOutlinedIcon />}
              onClick={() => setFilters([!filters[0], !filters[1]])}
            >
              Của bạn
            </Button>
          </Stack>
          <Card
            elevation={16}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              px: 3,
              py: 2, 
              position: 'fixed',
              bottom: 30,
              right : 100,
              width: 500,
            }}
          >
            <Typography variant="subtitle1">
              Tạo và chia sẻ tập dữ liệu với cộng đồng!
            </Typography>
            <Button
              component={NextLink}
              href={paths.dashboard.dataset.create}
              variant="contained"
            >
              Tạo ngay
            </Button>
          </Card>
          <Typography variant="h4">
            Các tập dữ liệu thịnh hành 
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 2 }}
            variant="body1"
          >
            Khám phá, phân tích và sử dụng các dữ liệu chất lượng, bao gồm các tập dữ liệu được yêu thích nhất chia sẻ bởi cộng đồng.
          </Typography>
          <Typography
            color="text.secondary"
            variant="body1"
          >
            Bạn cũng có thể tạo và chia sẻ tập dữ liệu của mình với cộng đồng.
          </Typography>
          <Divider sx={{ my: 4 }} />
          <Grid
            container
            spacing={4}
          >
            {datasets
            .slice(page*consts.DATASETS_PER_PAGE, page*consts.DATASETS_PER_PAGE + consts.DATASETS_PER_PAGE)
            .map((dataset) => (
              <Grid
                key={dataset.id}
                xs={12}
                md={3}
              >
                <DatasetCard
                  id={dataset.id} 
                  authorAvatar={dataset.author.avatar}
                  authorName={dataset.author.name}
                  filesCount={dataset.filesType.length}
                  votes={dataset.votes}
                  description={dataset.description}
                  title={dataset.title}
                  updatedAt={dataset.updatedAt}
                  sx={{ height: '100%' }}
                />
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
              {page + 1} / {Math.ceil(datasets.length / consts.DATASETS_PER_PAGE)}
            </Typography>
            <Button
              disabled={page == Math.floor(datasets.length / consts.DATASETS_PER_PAGE)}
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
