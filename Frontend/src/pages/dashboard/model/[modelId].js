import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
  Tabs,
  Tab,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { modelApi } from '../../../api/model';
import { userApi } from '../../../api/user';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';
import { ModelVariationsShow } from '../../../sections/dashboard/model/model-variations-show';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const useModelDetail = () => {
  const isMounted = useMounted();
  const [modelDetail, setModelDetail] = useState(null);
  const [modelVariations, setModelVariations] = useState([]);
  const router = useRouter();

  const getModelDetail = useCallback(async () => {
    try {
      if (router.isReady) {
        const modelId = router.query.modelId;
        const response = await modelApi.getModelDetail(modelId);
        console.log(response);
        const userResponse = await userApi.getUser(response.data.userId);
        if (isMounted()) {
          setModelDetail({
            ...response.data, 
            author: {
              avatar: userResponse.data.avatar,
              name: userResponse.data.username
            }
          });

          const modelVariationsMap = new Map();
          for (let i = 0; i < response.data.modelVariations.length; i++) {
            const framework = response.data.modelVariations[i].framework;
            const slugName = response.data.modelVariations[i].slugName;
            if (!modelVariationsMap.has(framework)) {
              modelVariationsMap.set(framework, new Map());
            }
            if (!modelVariationsMap.get(framework).has(slugName)) {
              modelVariationsMap.get(framework).set(slugName, []);
            }
            modelVariationsMap.get(framework).get(slugName).push({
              id: response.data.modelVariations[i].id,
              version: response.data.modelVariations[i].version,
              filesType: response.data.modelVariations[i].filesType,
              description: response.data.modelVariations[i].description,
              exampleUse: response.data.modelVariations[i].exampleUse
            });
          }

          setModelVariations(modelVariationsMap);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted,router.isReady]);

  useEffect(() => {
    getModelDetail();
  }, [router.isReady]);

  return {modelDetail, setModelDetail, modelVariations};
};

const Page = () => {
  const router = useRouter();
  const { modelDetail, setModelDetail, modelVariations } = useModelDetail(); 
  const [tabTitle, setTabTitle] = useState('model');
  const { user } = useAuth();
  const [upVote, setUpVote] = useState([]);

  const updateModel = useCallback(async (data) => {
    await modelApi.putModel(modelDetail.id, data)
      .then((response) => {console.log(response);})
      .catch(error => {
        console.error('Error putting data:', error);
      })
    setModelDetail({...modelDetail, ...data});
  }, [modelDetail])
  
  usePageView();

  if (!modelDetail) {
    return null;
  }

  if (!user) return null;
 
  return (
    <>
      <Head>
        <title>
          Model: Model Detail
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
          <Stack spacing={1} mb={4}>
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
                {modelDetail.title}
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Stack direction='row'>
            <Stack spacing={1}>
              <Typography variant="h4">
                {modelDetail.title}
              </Typography>
              <Typography
                color="text.secondary"
                variant="subtitle1"
              >
                {modelDetail.description?modelDetail.description:"Không có mô tả"}
              </Typography>
            </Stack>
            {modelDetail.userId == user.id && <Button style={{ marginLeft: 'auto', borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40 }}>
              <CreateOutlinedIcon />
            </Button>}     
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 3, mb: 3 }}
          >
            <Avatar src={modelDetail.author.avatar}/>
            <Stack direction="row" alignItems="center" width="100%" justifyContent="space-between">
              <Typography variant="subtitle2">
                {modelDetail.author.name}
                {' '}
                •
                {' '}
                Cập nhật mới nhất {modelDetail.updatedAt}
                {' '}
                •
                {' '}
                {modelDetail.isPublic ? "Công khai" : "Riêng tư"}
              </Typography>
              <Stack direction="row" alignItems="center">
                <Typography color="text.primary" variant="h6" sx={{ mr: 1 }}>{modelDetail.votes}</Typography>
                <ToggleButtonGroup
                  value={upVote}
                  onChange={(e, value) => {
                    updateModel({votes: value.length == 1 ? modelDetail.votes+1 : modelDetail.votes-1});
                    setUpVote(value);
                  }}
                >
                  <ToggleButton size="small" value={true}><KeyboardDoubleArrowUpOutlinedIcon fontSize='small'/></ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Stack>
          </Stack>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4}}>
            <Tabs value={tabTitle} onChange={(e, v) => setTabTitle(v)}>
              <Tab label="Mô hình" value="model" sx={{fontSize: 17, mr: 3}}/>
              <Tab label="Ghi chú" value="notebooks" sx={{fontSize: 17, mr: 3}}/>
            </Tabs>
          </Box>
          {tabTitle == "model" && 
            <>
              <Grid
                container
                mb={5}
              >
                <Grid
                  item
                  xs={12}
                  md={9}
                  pr={2}
                >
                  <Stack direction="row" mb={3}>
                    <Typography variant='h5'>Chi tiết mô hình</Typography>
                    {modelDetail.userId == user.id && <Button style={{ marginLeft: 'auto', borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40 }}>
                      <CreateOutlinedIcon />
                    </Button>}
                  </Stack>
                  {modelDetail.detail 
                  ? <Typography dangerouslySetInnerHTML={{__html: modelDetail.detail}}></Typography> 
                  : <Typography variant='body1'>Mô hình này chưa có mô tả chi tiết</Typography>}
                  <Divider sx={{ mt: 5 }} />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={3}
                >
                  <Stack direction="row" alignItems="center">
                    <Typography variant='h6' mr={1}>Nhãn</Typography>
                    {modelDetail.userId == user.id && <Button style={{ borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40 }}>
                      <CreateOutlinedIcon fontSize='small'/>
                    </Button>}
                  </Stack>
                  {modelDetail.labels.length == 0 && <Typography variant='body2'>Không có nhãn</Typography>}
                  <Box >
                    {modelDetail.labels.map((label,index) => 
                      <Chip 
                        key={index} 
                        label={label}
                        sx={{mr: 1, mb: 1}} 
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
              <Stack direction="row" mb={4}>
                <Typography variant='h5'>Các biến thể</Typography>
                {modelDetail.userId == user.id && 
                  <Button 
                    style={{ marginLeft: 'auto', maxWidth: 170, minWidth: 170}} 
                    startIcon={<AddOutlinedIcon />} 
                    variant="outlined"
                    onClick={() => router.push(paths.dashboard.model.model_variation_create.replace(':modelId', modelDetail.id))}
                  >
                    Thêm biến thể
                  </Button>
                }
              </Stack>
              {modelVariations.size == 0 
                ? <Typography variant='body1'>Chưa có biến thể được tải lên</Typography>
                : <ModelVariationsShow modelVariations={modelVariations} ownerId={modelDetail.userId}/>
              }
            </>
          }

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
