import { useCallback, useState, useEffect} from 'react';
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
  Grid,
  Select,
  MenuItem,
  FormControl,
  Divider
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { useAuth } from '../../../../hooks/use-auth';
import { notebookApi } from '../../../../api/notebook';
import { lm_manageApi } from '../../../../api/lm-manage';
import { pythonRunnerApi } from '../../../../api/pythonRunner';
import { useRouter } from 'next/router';
import { QuillEditor } from '../../../../components/quill-editor';
import { InputChosenDialog } from '../../../../sections/dashboard/notebook/input-chosen-dialog';
import { FilesTreeView } from '../../../../sections/dashboard/notebook/files-tree-view';
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
import { learning_logApi } from '../../../../api/learning-log';
import { CourseLesson } from './code/preview-code-lesson';
import { LmRating } from './lm_rating'

const PreviewCode = ({lmId, value, setValue, hover, setHover}) => {
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState([]);
  const [labels, setLabels] = useState([]);
  const [modelVariations, setModelVariations] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [openInputChosenDialog, setOpenInputChosenDialog] = useState(false);
  const [lm, setLm] = useState();
  const [score, setScore] = useState([0,0]) //[score, maxScore]
  const { user } = useAuth();
  const router = useRouter();
  
  usePageView();

  useEffect(() => {
    const getLmCode = async () => {
        const response = await lm_manageApi.get1Lm(lmId);
        setLm(response.data)
    }
    getLmCode()
    setContent([{code: "", stdout: "", stderr: ""}])
  }, [])
  console.log(lm)


  // This function takes responsibility to submit this code and create Log
  const createCodeLog = async (lmId, user) => {
    try {
      const response = await learning_logApi.createLog(user.id, {
        rating: 3,
        learnerAnswer: content[0].code,
        time: 1200, //chỗ này cần phải lấy time của lm sau đó gắn vào
        attempts: 1,
        learningMaterialId: lmId,
      });
      console.log(response);
      setScore([response.data.score, response.data.maxScore])

    } catch (err) {
      console.error(err);
    }
  }
  console.log(score)

  // This function run the code of user
  const handleSubmitNotebook = useCallback(async () => {
    await notebookApi.postNotebook({
      modelVariationIds: modelVariations ? modelVariations.map(v => v.id) : null,
      datasetIds: datasets ? datasets.map(d => d.id) : null,
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
    console.log(lm)
    await pythonRunnerApi.postpythonRunner({
      "inputTestFile": lm.inputName,
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
          Khám phá tài liệu học {lm?.name}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 0
        }}
      >
        <Container maxWidth="xl">
          <Stack alignItems="left" justifyContent="space-between" direction="column">
          <Typography variant="h5">Đề bài</Typography>
            {lm && <Box dangerouslySetInnerHTML={{ __html: lm.question }} />}
            {lm && <CourseLesson content={`
\`\`\`python
${lm.exampleCode}
\`\`\`
`} />}
          </Stack>
          {/* <Divider sx={{ my: 1 }}/>
          <Stack direction="column">
            <Typography variant="h5" sx={{mt:2, mb: 3}}>Test case mẫu</Typography>
          </Stack> */}
          <Divider sx={{ my: 1 }}/>
          <Stack direction="column">
            <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 2, mb: 3 }}>
                <Typography variant="h5">Phần làm bài</Typography>
                <Typography variant="h6">Số testcase vượt qua: {score[0]}/{score[1]}</Typography>
                </Stack>
            <Card sx={{ width: "100%", height: 700, overflow: 'auto'}}>
              <CardContent>
                {/* {content.length === 0 && <Stack direction="row">
                  <Button startIcon={<AddIcon fontSize='small'/>} variant="outlined" color="inherit" sx={{ mr: 2, fontSize: 12, p: 1 }} onClick={() => setContent([{code: "", stdout: "", stderr: ""}])}>Mã nguồn</Button>
                  <Button startIcon={<AddIcon />} variant="outlined" color="inherit" sx={{fontSize: 12, p: 1 }} onClick={() => setContent(['<p></p>'])}>Văn bản</Button>
                </Stack>} */}
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
                        {/* Nút run code */}
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
                            height="500px"
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
                    {/* <Stack direction="row">
                      <Button startIcon={<AddIcon />} variant="outlined" color="inherit" sx={{ mr: 2, fontSize: 12, p: 1  }} onClick={() => setContent([...content.slice(0, i+1), {code: "", stdout: "", stderr: ""}, ...content.slice(i+1)])}>Mã nguồn</Button>
                      <Button startIcon={<AddIcon />} variant="outlined" color="inherit" sx={{ fontSize: 12, p: 1  }} onClick={() => setContent([...content.slice(0, i+1), '<p></p>', ...content.slice(i+1)])}>Văn bản</Button>
                    </Stack> */}
                    <Stack direction="row" spacing={2} alignItems="right" sx={{ mt: 2, justifyContent: 'flex-end' }}>
                        <Button startIcon={<PlayArrowOutlinedIcon />} color="primary" onClick={() => runPythonCode(0)}>Chạy</Button>
                        <Button startIcon={<SaveIcon />} variant="contained" color="primary" onClick={() => createCodeLog(lmId, user)}>Nộp bài</Button>
                    </Stack>
                  </Stack>
                )}
              </CardContent>
            </Card>
            {/* <Card sx={{ width: "25%", height: 500, overflow: 'auto' }}>
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
                    id: d.id,
                    title: d.title,
                    items: d.filesType.map((t,i) => `datasets/${d.id}_${i}${t}`)
                  }})}
                  setFiles={setDatasets}
                />}
                {modelVariations.length > 0 && <Typography fontWeight={600} fontSize={12} variant="subtitle1" marginBottom={1}>MÔ HÌNH</Typography>}
                {modelVariations.length > 0 && <FilesTreeView 
                  filesTree={modelVariations.map(v => { return {
                    id: v.id,
                    title: `${v.title} - ${v.slugName} - V${v.version}`,
                    items: v.filesType.map((t,i) => `modelVariations/${v.id}_${i}${t}`)
                  }})}
                  setFiles={setModelVariations}
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
            </Card> */}
          </Stack>
          
          {score[1] == 0 
          ? <></> 
          : <div>
          <Divider sx={{ my: 1, mt: 3, mb: 3 }}/>
            <LmRating value={value}
                    setValue={setValue}
                    hover={hover}
                    setHover={setHover}>
            </LmRating>
          </div>}
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

// PreviewCode.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

export default PreviewCode;
