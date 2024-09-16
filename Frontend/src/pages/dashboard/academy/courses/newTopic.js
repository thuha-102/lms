import { useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  CardContent,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { FileDropzoneVn } from '../../../../components/file-upload-vn';
import { QuillEditor } from '../../../../components/quill-editor';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { fileToBase64 } from '../../../../utils/file-to-base64';
import { forumApi } from '../../../../api/forum';
// import { FileUploader } from '../../sections/dashboard/file-manager/file-uploader';

const initialCover = '/assets/covers/abstract-1-4x3-large.png';
const userId = 2;

const Page = () => {
    const [files, setFiles] = useState([]);
    const [cover, setCover] = useState(initialCover);
    const [labels, setLabels] = useState([]);
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [preTopic, setPreTopic] = useState('');
    const [postTopic, setPostTopic] = useState('');
    const [content, setContent] = useState('');
    const [openFileUploader, setOpenFileUploader] = useState(false);

  usePageView();

  const titleRef = useRef();
  const labelsRef = useRef();

  const router = useRouter();

  const handleDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);

  const handleSubmitButton = useCallback(() => {
    if (title == '') {
      titleRef.current.focus();
    } else if (labels.length == 0) {
      labelsRef.current.focus();
    } else if (content !== '' && content !== '<p><br></p>') {
      forumApi.postForum({
        "title": title,
        "label": labels,
        "shortDescription": shortDescription,
        "content": content.slice(3, -4),
        "coverImage": cover,
        "userId": userId
      })
        .then((response) => {
          console.log(response);
          router.push(paths.dashboard.forum.forumDetails);
        })
        .catch(error => {
          console.error('Error posting data:', error);
        })
    }
  }, [title, cover, labels, shortDescription, content]);

  return (
    <>
      <Head>
        <title>
            Course: Topic Create
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
              Tạo Topic mới
            </Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.dashboard.academy.index}
                variant="subtitle2"
              >
                Khoá học của tôi
              </Link>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.dashboard.academy.lessonDetails}
                variant="subtitle2"
              >
                Danh sách
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
                      Thông tin chung
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Tên topic"
                        name="title"
                        required
                        inputRef={titleRef}
                        value={title}
                        onChange={e => {
                          setTitle(e.target.value);
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Mô tả tóm tắt"
                        value={shortDescription}
                        onChange={e => setShortDescription(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Topic liền trước"
                        value={preTopic}
                        onChange={e => setPreTopic(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Topic liền sau"
                        value={postTopic}
                        onChange={e => setPostTopic(e.target.value)}
                      />
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
                      Tài liệu
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack spacing={3}>
                      <FileDropzoneVn
                        accept={{ '*/*': [] }}
                        files={files}
                        onDrop={handleDrop}
                        onRemove={handleRemove}
                        onRemoveAll={handleRemoveAll}
                        // onUpload={onClose}
                        caption="Dung lượng tệp tối đa là 3 MB"
                      />
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
                      Nội dung *
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <QuillEditor
                      placeholder="Nội dung"
                      sx={{ height: 330 }}
                      value={content}
                      onChange={value => setContent(value)}
                    />
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
                      Nhãn *
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    lg={8}
                  >
                    <Stack >
                      <TextField
                        fullWidth
                        label="Thêm nhãn"
                        name="labels"
                        inputRef={labelsRef}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (e.target.value !== '') {
                              setLabels([...labels,e.target.value]);
                            }
                            e.target.value = '';
                            e.preventDefault();
                          }}
                        }
                      />
                      <Typography sx={{ mt: 1, mb: 3, fontStyle: 'italic', fontSize: 13 }}>
                        Nhấn "Enter" để thêm nhãn. Ít nhất 1 nhãn
                      </Typography>
                      <Box >
                        {labels.map((label,index) => <Chip key={index} label={label} sx={{mr: 1, mb: 1}} />)}
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
          <Card
            elevation={16}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              mb: 8,
              mt: 6,
              px: 3,
              py: 2
            }}
          >
            <Typography sx={{ color: 'red', fontSize: 17, fontWeight: '500', fontStyle: 'italic' }}>
              {(content == '' || content == '<p><br></p>') && "Thiếu nội dung!"}
            </Typography>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
            >
              <Button
                color="inherit"
                component={NextLink}
                href={paths.dashboard.forum.index}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmitButton}
                variant="contained"
              >
                Thêm topic
              </Button>
            </Stack>
          </Card>
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
