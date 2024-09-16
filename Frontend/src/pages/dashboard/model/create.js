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
import { modelApi } from '../../../api/model';
import { useRouter } from 'next/router';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const Page = () => {
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  usePageView();

  const handleSubmitModel = useCallback(async () => {
    await modelApi.postModel({
      title: title,
      isPublic: isPublic,
      userId: user.id
    })
      .then((response) => {
        router.push(paths.dashboard.model.details.replace(':modelId', response.data.id));
      })
      .catch((err) => {
        console.error(err);
      })
  }, [title, isPublic]);

  if (!user) return null;

  return (
    <>
      <Head>
        <title>
          Tạo mới một model
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
              Tạo mô hình mới
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
                      Thông tin mô hình
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
            <Stack justifyContent="end" alignItems="flex-end">
              <Button
                onClick={handleSubmitModel}
                variant="contained"
                disabled={(title == '')}
              >
                Tạo mô hình
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
