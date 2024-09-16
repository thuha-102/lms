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
import { modelApi } from '../../../api/model';
import { userApi } from '../../../api/user';
import { useAuth } from '../../../hooks/use-auth';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { ModelCard } from '../../../sections/dashboard/model/model-card';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import * as consts from '../../../constants';

const Page = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState([false, true]);
  const [models, setModels] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const getModels = async (criteria) => {
      try {
        const response = await modelApi.getModels(criteria);
        const modelsInfo = await Promise.all(response.data.map(async r => {
          const userResponse = await userApi.getUser(r.userId);
          return {
            ...r, 
            author: {
              avatar: userResponse.data.avatar,
              name: userResponse.data.username
            }
          }
        }));
        setModels(modelsInfo);
      } catch (err) {
        console.error(err);
      }
    };

    getModels(filters[1] ? {userId: user.id} : {userId: user.id, isPublic: true});
  }, [filters, user])

  usePageView();

  if (!user) return null;

  return (
    <>
      <Head>
        <title>
          Danh sách các model
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
              Mô hình
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
                href={paths.dashboard.model.index}
                variant="subtitle2"
              >
                Mô hình
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
            <Input placeholder="Tìm kiếm mô hình..." disableUnderline fullWidth sx={{marginLeft: 2}} inputProps={{ style: { fontSize: '17px' } }}/>
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
              Tạo và chia sẻ mô hình với cộng đồng!
            </Typography>
            <Button
              component={NextLink}
              href={paths.dashboard.model.create}
              variant="contained"
            >
              Tạo ngay
            </Button>
          </Card>
          <Typography variant="h4">
            Các mô hình thịnh hành 
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 2 }}
            variant="body1"
          >
            Khám phá và sử dụng các mô hình học máy, bao gồm các mô hình được yêu thích nhất chia sẻ bởi cộng đồng.
          </Typography>
          <Typography
            color="text.secondary"
            variant="body1"
          >
            Bạn cũng có thể tạo và chia sẻ mô hình của mình với cộng đồng.
          </Typography>
          <Divider sx={{ my: 4 }} />
          <Grid
            container
            spacing={4}
          >
            {models
            .slice(page*consts.MODELS_PER_PAGE, page*consts.MODELS_PER_PAGE + consts.MODELS_PER_PAGE)
            .map((model) => (
              <Grid
                key={model.id}
                xs={12}
                md={3}
              >
                <ModelCard
                  id={model.id} 
                  authorAvatar={model.author.avatar}
                  authorName={model.author.name}
                  modelVariationsCount={model.modelVariations.length}
                  notebooksCount={model.modelVariations.reduce((count, current) => count + current.notebooks.length, 0)}
                  votes={model.votes}
                  description={model.description}
                  title={model.title}
                  updatedAt={model.updatedAt}
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
              {page + 1} / {Math.ceil(models.length / consts.MODELS_PER_PAGE)}
            </Typography>
            <Button
              disabled={page == Math.floor(models.length / consts.MODELS_PER_PAGE)}
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
