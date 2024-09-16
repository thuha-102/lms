import { useCallback, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';
import { datasetApi } from '../../../api/dataset';
import { useRouter } from 'next/router';
import { FileDropzoneVn } from '../../../components/file-dropzone-vn';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const Page = () => {
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [files, setFiles] = useState([]);
  const { user } = useAuth();
  const router = useRouter();
  
  usePageView();

  const handleCoverDrop = useCallback(async (filesUpload) => {
    console.log(filesUpload)
    setFiles(pre => [...pre, ...filesUpload]);
  }, []);

  if (!user) return null;

  const handleSubmitDataset = useCallback(async () => {
    const datasetFormData = new FormData();
    datasetFormData.append("title", title);
    datasetFormData.append("isPublic", isPublic);
    files.forEach(file => {
      datasetFormData.append("files", file);
    });
    datasetFormData.append("userId", user.id);

    await datasetApi.postDataset(datasetFormData)
      .then((response) => {
        console.log(response);
        router.push(paths.dashboard.dataset.details.replace(':datasetId', response.data.id));
      })
      .catch((err) => {
        console.error(err);
      })
  }, [title, isPublic, files]);

  if (!user) return null;

  return (
    <>
      <Head>
        <title>
          Tạo mới một tập dữ liệu
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
              Tạo tập dữ liệu mới
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
                Tạo mới
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Stack spacing={3}>
            <Card sx={{mt: 6}}>
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    xs={12}
                    md={4}
                  >
                    <Typography variant="h6">
                      Thông tin tập dữ liệu
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Tiêu đề"
                        name="title"
                        required
                        value={title}
                        onChange={e => {
                          setTitle(e.target.value);
                        }}
                      />
                      <FormControl variant="filled">
                        <InputLabel>Chế độ hiển thị</InputLabel>
                        <Select
                          value={isPublic}
                          onChange={(e) => setIsPublic(e.target.value)}
                        >
                          <MenuItem value={false}>
                            <Stack direction="row" alignItems="center">
                              <VisibilityOffOutlinedIcon fontSize='small'/> 
                              <Typography ml={2} variant='body2' sx={{fontWeight: 500}}>
                                Riêng tư
                              </Typography>
                            </Stack>
                          </MenuItem>
                          <MenuItem value={true}>
                            <Stack direction="row">
                              <VisibilityOutlinedIcon fontSize='small'/>
                              <Typography ml={2} variant='body2' sx={{fontWeight: 500}}>
                                Công khai
                              </Typography>
                            </Stack>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    xs={12}
                    md={4}
                  >
                    <Typography variant="h6">
                      Tải tệp dữ liệu
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack spacing={3}>
                      <FileDropzoneVn
                        accept={{ 
                          'application/pdf': ['.pdf'],
                          'application/msword': ['.doc', '.docx'],
                          'text/plain': ['.txt'],
                          'application/zip': ['.zip'],
                          'text/csv': ['.csv'],
                          'application/vnd.ms-excel': ['.xls', '.xlsx']
                        }}
                        maxFiles={10}
                        onDrop={handleCoverDrop}
                        caption="(Zip các file kích thước lớn để giảm kích thước, tối đa 10 tệp)"
                      />
                      <Stack>
                        {files.map((file, index) => 
                          <Stack key={index} direction="row" alignItems="center" borderBottom="1px solid" borderTop="1px solid" borderColor="text.disabled" py={1}>
                            <InsertDriveFileOutlinedIcon />
                            <Typography variant='body2' ml={2}>{file.name} ({file.size} bytes)</Typography>
                            <Button variant="inherit" sx={{marginLeft: "auto", maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40, borderRadius: '100%'}} onClick={() => setFiles([...files.slice(0, index), ...files.slice(index+1, files.length)])}>
                              <CloseOutlinedIcon fontSize='small'/>
                            </Button>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>        
            <Stack justifyContent="end" alignItems="flex-end">
              <Button
                onClick={handleSubmitDataset}
                variant="contained"
                disabled={(title == '') || files.length == 0}
              >
                Tạo tập dữ liệu
              </Button>
            </Stack>
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
