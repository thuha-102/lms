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
import { datasetApi } from '../../../api/dataset';
import { userApi } from '../../../api/user';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

const useDatasetDetail = () => {
  const isMounted = useMounted();
  const [datasetDetail, setDatasetDetail] = useState(null);
  const router = useRouter();

  const getDatasetDetail = useCallback(async () => {
    try {
      if (router.isReady) {
        const datasetId = router.query.datasetId;
        const response = await datasetApi.getDatasetDetail(datasetId);
        console.log(response);
        const userResponse = await userApi.getUser(response.data.userId);
        if (isMounted()) {
          setDatasetDetail({
            ...response.data, 
            author: {
              avatar: userResponse.data.avatar,
              name: userResponse.data.username
            }
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted,router.isReady]);

  useEffect(() => {
    getDatasetDetail();
  }, [router.isReady]);

  return {datasetDetail, setDatasetDetail};
};

const Page = () => {
  const router = useRouter();
  const { datasetDetail, setDatasetDetail } = useDatasetDetail(); 
  const [tabTitle, setTabTitle] = useState('dataset');
  const { user } = useAuth();
  const [upVote, setUpVote] = useState([]);

  const updateDataset = useCallback(async (data) => {
    await datasetApi.putDataset(datasetDetail.id, data)
      .then((response) => {console.log(response);})
      .catch(error => {
        console.error('Error putting data:', error);
      })
    setDatasetDetail({...datasetDetail, ...data});
  }, [datasetDetail])
  
  usePageView();

  if (!datasetDetail) {
    return null;
  }

  if (!user) return null;
 
  return (
    <>
      <Head>
        <title>
          Dataset: Dataset Detail
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
                {datasetDetail.title}
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Stack direction='row'>
            <Stack spacing={1}>
              <Typography variant="h4">
                {datasetDetail.title}
              </Typography>
              <Typography
                color="text.secondary"
                variant="subtitle1"
              >
                {datasetDetail.description?datasetDetail.description:"Không có mô tả"}
              </Typography>
            </Stack>
            {datasetDetail.userId == user.id && <Button style={{ marginLeft: 'auto', borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40 }}>
              <CreateOutlinedIcon />
            </Button>}     
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 3, mb: 3 }}
          >
            <Avatar src={datasetDetail.author.avatar}/>
            <Stack direction="row" alignItems="center" width="100%" justifyContent="space-between">
              <Typography variant="subtitle2">
                {datasetDetail.author.name}
                {' '}
                •
                {' '}
                Cập nhật mới nhất {datasetDetail.updatedAt}
                {' '}
                •
                {' '}
                {datasetDetail.isPublic ? "Công khai" : "Riêng tư"}
              </Typography>
              <Stack direction="row" alignItems="center">
                <Typography color="text.primary" variant="h6" sx={{ mr: 1 }}>{datasetDetail.votes}</Typography>
                <ToggleButtonGroup
                  value={upVote}
                  onChange={(e, value) => {
                    updateDataset({votes: value.length == 1 ? datasetDetail.votes+1 : datasetDetail.votes-1});
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
              <Tab label="Tập dữ liệu" value="dataset" sx={{fontSize: 17, mr: 3}}/>
              <Tab label="Ghi chú" value="notebooks" sx={{fontSize: 17, mr: 3}}/>
            </Tabs>
          </Box>
          {tabTitle == "dataset" && 
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
                    <Typography variant='h5'>Thông tin tập dữ liệu</Typography>
                    {datasetDetail.userId == user.id && <Button style={{ marginLeft: 'auto', borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40 }}>
                      <CreateOutlinedIcon />
                    </Button>}
                  </Stack>
                  {datasetDetail.detail 
                  ? <Typography dangerouslySetInnerHTML={{__html: datasetDetail.detail}}></Typography> 
                  : <Typography variant='body1'>Tập dữ liệu này chưa có mô tả chi tiết</Typography>}
                  <Divider sx={{ mt: 5 }} />
                  <Stack mb={3}>
                    <Typography variant="h5">Các tệp</Typography>
                  </Stack>
                  <Stack>
                    <Stack border="1px solid" borderColor="action.disabledBackground" px={3} pt={3} pb={2} borderRadius={2}>
                      {datasetDetail.filesType.map((t, idx) => (
                        <Link
                          key={idx}
                          href={`${process.env.NEXT_PUBLIC_SERVER_API}/uploads/datasets/${datasetDetail.id}_${idx}${t}`}
                          color="text.primary"
                          target="_blank" 
                          rel="noopener noreferrer"
                          mb={1}
                        >
                          <Stack direction="row" spacing={1}>
                            <InsertDriveFileOutlinedIcon fontSize='small'/>
                            <Typography variant="body2">{datasetDetail.id}_{idx}{t}</Typography>
                          </Stack>
                        </Link>  
                      ))} 
                    </Stack>
                  </Stack>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={3}
                >
                  <Stack direction="row" alignItems="center">
                    <Typography variant='h6' mr={1}>Nhãn</Typography>
                    {datasetDetail.userId == user.id && <Button style={{ borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40 }}>
                      <CreateOutlinedIcon fontSize='small'/>
                    </Button>}
                  </Stack>
                  {datasetDetail.labels.length == 0 && <Typography variant='body2'>Không có nhãn</Typography>}
                  <Box >
                    {datasetDetail.labels.map((label,index) => 
                      <Chip 
                        key={index} 
                        label={label}
                        sx={{mr: 1, mb: 1}} 
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
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
