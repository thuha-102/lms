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
  Select,
  MenuItem,
  FormControl,
  Divider
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';
import { notebookApi } from '../../../api/notebook';
import { pythonRunnerApi } from '../../../api/pythonRunner';
import { useRouter } from 'next/router';
import { QuillEditor } from '../../../components/quill-editor';
import { InputChosenDialog } from '../../../sections/dashboard/notebook/input-chosen-dialog';
import { FilesTreeView } from '../../../sections/dashboard/notebook/files-tree-view';
import AceEditer from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const Page = () => {
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState([]);
  const [labels, setLabels] = useState([]);
  const [modelVariations, setModelVariations] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [openInputChosenDialog, setOpenInputChosenDialog] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  usePageView();

  const handleSubmitNotebook = useCallback(async () => {
    await notebookApi.postNotebook({
      modelVariationIds: modelVariations ? modelVariations.map(v => v.modelVariation.id) : null,
      datasetIds: datasets ? datasets.map(d => d.dataset.id) : null,
      title: title,
      content: content.map(c => typeof(c) === "string" ? c : c.code ),
      isPublic: isPublic,
      labels: labels,
      userId: user.id
    })
      .then((response) => {
        router.push(paths.dashboard.notebook.details.replace(':notebookId', response.data.id));
      })
      .catch((err) => {
        console.error(err);
      })
  }, [title, isPublic, content, labels, datasets, modelVariations]);

  const runPythonCode = useCallback(async (i) => {
    await pythonRunnerApi.postpythonRunner({
      "code": content[i].code,
    })
      .then((response) => {
        console.log(response);
        setContent([...content.slice(0, i), { code: content[i].code, stdout: response.data.stdout, stderr: response.data.stderr}, ...content.slice(i+1)]);
      })
      .catch((err) => {
        console.error(err);
      })
  }, [content]);

  if (!user) return null;

  return (
    <>
      <Head>
        <title>
          Tạo mới một ghi chú
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
          <Stack spacing={1} mb={3}>
            <Typography variant="h3">
              Tạo ghi chú mới
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
                href={paths.dashboard.notebook.index}
                variant="subtitle2"
              >
                Ghi chú
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Tạo mới
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Stack alignItems="center" justifyContent="space-between" direction="row">
            <TextField
              sx={{width: 300}}
              label="Tiêu đề"
              name="title"
              variant="standard"
              required
              value={title}
              onChange={e => {
                setTitle(e.target.value);
              }}
            />
            <Stack direction="row" alignItems="center">
              <FormControl variant="filled">
                <Select
                  value={isPublic}
                  onChange={(e) => setIsPublic(e.target.value)}
                  sx={{width: 150}}
                  variant='standard'
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
              <Button variant='contained' sx={{ml: 4}} startIcon={<SaveIcon />} onClick={handleSubmitNotebook}>Lưu ghi chú</Button>
              
            </Stack>
          </Stack>
          <Divider sx={{ my: 1 }}/>
          <Stack direction="row">
            <Card sx={{ width: "75%", height: 500, overflow: 'auto'}}>
              <CardContent>
                {content.length === 0 && <Stack direction="row">
                  <Button startIcon={<AddIcon fontSize='small'/>} variant="outlined" color="inherit" sx={{ mr: 2, fontSize: 12, p: 1 }} onClick={() => setContent([{code: "", stdout: "", stderr: ""}])}>Mã nguồn</Button>
                  <Button startIcon={<AddIcon />} variant="outlined" color="inherit" sx={{fontSize: 12, p: 1 }} onClick={() => setContent(['<p></p>'])}>Văn bản</Button>
                </Stack>}
                {content.map((s, i) => 
                  <Stack spacing={2} mb={2} key={i}>
                    {typeof(s) === "string"   
                      ? <QuillEditor
                        placeholder="Nội dung"
                        sx={{ height: 330 }}
                        value={s}
                        onChange={(c, delta, source, editor) => {
                          setContent([...content.slice(0, i), c, ...content.slice(i+1)]);
                        }}
                      /> 
                      : <Stack direction="row" border="1px solid" borderColor="action.disabledBackground" borderRadius={1}>
                        <Button variant="inherit" sx={{marginLeft: "auto", maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40, borderRadius: '100%'}} onClick={() => runPythonCode(i)}><PlayArrowOutlinedIcon /></Button>
                        <Stack width="100%">
                          <AceEditer
                            mode="python"
                            theme="github"
                            value={s.code}
                            onChange={c => {
                              setContent([...content.slice(0, i), {code: c, stdout: "", stderr: ""}, ...content.slice(i+1)]);
                            }}
                            name="python-editor"
                            width="100%"
                            height="300px"
                          />
                          {s.stdout != "" && <>
                            <Typography variant='body2'>stdout:</Typography>
                            <AceEditer
                              readOnly
                              mode="python"
                              theme="github"
                              value={s.stdout}
                              width="100%"
                              height="50px"
                            />
                          </>}
                          {s.stderr != "" && <>
                            <Typography variant='body1'>stderr</Typography>
                            <AceEditer
                              readOnly
                              mode="python"
                              theme="github"
                              value={s.stderr}
                              width="100%"
                              height="50px"
                            />
                          </>}
                        </Stack>
                      </Stack>
                    }
                    <Stack direction="row">
                      <Button startIcon={<AddIcon />} variant="outlined" color="inherit" sx={{ mr: 2, fontSize: 12, p: 1  }} onClick={() => setContent([...content.slice(0, i+1), {code: "", stdout: "", stderr: ""}, ...content.slice(i+1)])}>Mã nguồn</Button>
                      <Button startIcon={<AddIcon />} variant="outlined" color="inherit" sx={{ fontSize: 12, p: 1  }} onClick={() => setContent([...content.slice(0, i+1), '<p></p>', ...content.slice(i+1)])}>Văn bản</Button>
                    </Stack>
                  </Stack>
                )}
              </CardContent>
            </Card>
            <Card sx={{ width: "25%", height: 500, overflow: 'auto' }}>
              <CardContent>
                <Typography variant='h6'>Input</Typography>
                <Box direction="row" sx={{ my: 2}}>
                  <Button startIcon={<AddIcon />} variant="outlined" color="inherit" sx={{ mr: 1, mb: 1, fontSize: 12, p: 1 }} onClick={() => setOpenInputChosenDialog(true)}>Chọn thêm</Button>
                  <Button startIcon={<FileUploadOutlinedIcon />} variant="outlined" color="inherit" sx={{ mr: 1, mb: 1, fontSize: 12, p: 1 }} onClick={() => window.open(paths.dashboard.model.create)}>Mô hình</Button>
                  <Button startIcon={<FileUploadOutlinedIcon />} variant="outlined" color="inherit" sx={{ mr: 1, mb: 1, fontSize: 12, p: 1 }} onClick={() => window.open(paths.dashboard.dataset.create)}>Tập dữ liệu</Button>
                </Box>
                {datasets.length > 0 && <Typography fontWeight={600} fontSize={12} variant="subtitle1" marginBottom={1}>TẬP DỮ LIỆU</Typography>}
                {datasets.length > 0 && <FilesTreeView 
                  filesTree={datasets.map(d => { return {
                    id: d.dataset.id,
                    title: d.dataset.title,
                    items: d.dataset.filesType.map((t,i) => `datasets/${d.dataset.id}_${i}${t}`)
                  }})}
                  variationKeyId='dataset'
                  setFiles={setDatasets}
                  // editDisabled={user.id !== notebookDetail.userId}
                />}
                {modelVariations.length > 0 && <Typography fontWeight={600} fontSize={12} variant="subtitle1" marginBottom={1}>MÔ HÌNH</Typography>}
                {modelVariations.length > 0 && <FilesTreeView 
                  filesTree={modelVariations.map(v => { return {
                    id: v.modelVariation.id,
                    title: `${v.modelVariation.model.title} - ${v.modelVariation.slugName} - V${v.modelVariation.version}`,
                    items: v.modelVariation.filesType.map((t,i) => `modelVariations/${v.modelVariation.id}_${i}${t}`)
                  }})}
                  setFiles={setModelVariations}
                  variationKeyId='modelVariation'
                  // editDisabled={user.id !== notebookDetail.userId}
                />}
                {modelVariations.length == 0 && datasets.length == 0 && <Typography variant="subtitle2">Chưa có input được thêm</Typography>}
                {modelVariations.length == 0 && datasets.length == 0 && <Typography variant='body2' fontSize={12}>Bạn có thể chọn trong tập dữ liệu hoặc mô hình có sẵn hoặc tải lên từ thiết bị</Typography>}
                <Typography variant='h6' mt={3}>Output</Typography>
                <Stack direction="row" alignItems="center" mt={3}>
                  <Typography variant='h6' mr={1}>Nhãn</Typography>
                  <Button style={{ borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40 }}>
                    <CreateOutlinedIcon fontSize='small'/>
                  </Button>
                </Stack>
                {labels.length == 0 && <Typography variant='body2' mb={1}>Không có nhãn</Typography>}
                <Box >
                  {labels.map((label,index) => 
                    <Chip 
                      key={index} 
                      label={label}
                      sx={{mr: 1, mb: 1}}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
      <InputChosenDialog 
        onClose={() => setOpenInputChosenDialog(false)}
        open={openInputChosenDialog}
        datasets={datasets}
        modelVariations={modelVariations}
        setModelVariations={setModelVariations}
        setDatasets={setDatasets}
      />
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
