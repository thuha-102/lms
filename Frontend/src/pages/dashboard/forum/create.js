import { useCallback, useState, useRef } from 'react';
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
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { FileDropzoneVn } from '../../../components/file-dropzone-vn';
import { QuillEditor } from '../../../components/quill-editor';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { CheckDuplicateDialog } from '../../../sections/dashboard/forum/check-duplicate-dialog'
import { useAuth } from '../../../hooks/use-auth';

const Page = () => {
  const [cover, setCover] = useState(null);
  const [labels, setLabels] = useState([]);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { user } = useAuth();

  usePageView();

  const titleRef = useRef();
  const labelsRef = useRef();

  const handleCoverDrop = useCallback(async ([file]) => {
    setCover({
      preview: URL.createObjectURL(file),
      raw: file,
    });
  }, []);

  const handleCoverRemove = useCallback(() => {
    setCover(null);
  }, []);

  const handleSubmitButton = useCallback(() => {
    if (title == '') {
      titleRef.current.focus();
    } else if (labels.length == 0) {
      labelsRef.current.focus();
    } else if (content !== '' && content !== '<p><br></p>') {
      setOpenConfirmDialog(true);
    }
  }, [title, cover, labels, shortDescription, content]);

  if (!user) return null;

  return (
    <>
      <Head>
        <title>
          Tạo mới diễn dàn
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
              Tạo diễn đàn mới
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
                href={paths.dashboard.forum.index}
                variant="subtitle2"
              >
                Diễn đàn
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
                      Thông tin căn bản
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
                        inputRef={titleRef}
                        value={title}
                        onChange={e => {
                          setTitle(e.target.value);
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Mô tả ngắn"
                        value={shortDescription}
                        onChange={e => setShortDescription(e.target.value)}
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
                      Ảnh minh họa
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack spacing={3}>
                      {cover
                        ? (
                          <Box
                            sx={{
                              backgroundImage: `url(${cover.preview})`,
                              backgroundPosition: 'center',
                              backgroundSize: 'cover',
                              borderRadius: 1,
                              height: 230,
                              mt: 3
                            }}
                          />
                        )
                        : (
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              border: 1,
                              borderRadius: 1,
                              borderStyle: 'dashed',
                              borderColor: 'divider',
                              height: 230,
                              mt: 3,
                              p: 3
                            }}
                          >
                            <Typography
                              align="center"
                              color="text.secondary"
                              variant="h6"
                            >
                              Chọn ảnh minh họa
                            </Typography>
                            <Typography
                              align="center"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                              variant="subtitle1"
                            >
                              Hình ảnh được sử dụng để minh họa cho bài đăng
                            </Typography>
                          </Box>
                        )}
                      <div>
                        <Button
                          color="inherit"
                          disabled={!cover}
                          onClick={handleCoverRemove}
                        >
                          Bỏ hình ảnh
                        </Button>
                      </div>
                      <FileDropzoneVn
                        accept={{ 'image/*': [] }}
                        maxFiles={1}
                        onDrop={handleCoverDrop}
                        caption="(SVG, JPG, PNG, hoặc gif tối đa 900x400)"
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
                      onChange={(content, delta, source, editor) => {
                        setContent(content)
                      }}
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
                        {labels.map((label,index) => 
                          <Chip 
                            key={index} 
                            label={label}  
                            onDelete={e => setLabels([...labels.slice(0, index), ...labels.slice(index+1, labels.length)])}
                            sx={{mr: 1, mb: 1}} 
                          />
                        )}
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
            <Typography sx={{ color: 'text.caution', fontSize: 17, fontWeight: '500' }}>
              {(content == '' || content == '<p><br></p>') && "Thiếu nội dung !"}
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
                Đăng bài
              </Button>
              {/*<IconButton>
                <SvgIcon>
                  <DotsHorizontalIcon />
                </SvgIcon>
              </IconButton>*/}
            </Stack>
          </Card>
        </Container>
      </Box>
      {openConfirmDialog && <CheckDuplicateDialog 
        onClose={() => setOpenConfirmDialog(false)}
        open={openConfirmDialog}
        forumDetail={{
          "title": title,
          "label": labels,
          "shortDescription": shortDescription,
          "content": content,
          "coverImage": cover?cover.raw:null,
          "userId": user.id
        }}
      />}
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
