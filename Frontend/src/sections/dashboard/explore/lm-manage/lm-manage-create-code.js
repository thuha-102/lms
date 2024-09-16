import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Autocomplete, { createFilterOptions }from '@mui/material/Autocomplete';
import {
  Box,
  Button,
  Chip,
  Card,
  CardContent,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { FileDropzoneVn } from '../../../../components/file-dropzone-vn';
import { QuillEditor } from '../../../../components/quill-editor';
import { paths } from '../../../../paths';
import { topic_manageApi } from '../../../../api/topic-manage';
import { lm_manageApi } from '../../../../api/lm-manage';
import { exploreApi } from '../../../../api/explore';
import { useMounted } from '../../../../hooks/use-mounted';
import AceEditer from 'react-ace';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import AddIcon from '@mui/icons-material/Add';
import { pythonRunnerApi } from '../../../../api/pythonRunner';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

import { useAuth } from '../../../../hooks/use-auth';
import axios from 'axios';

const Code = ({content, setContent}) => {

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

  return (
    <Stack direction="row">
    <Card sx={{ width: "100%", height: 400, overflow: 'auto'}}>
      <CardContent>
        {content.length === 0 && <Stack direction="row">
          {/* <Button startIcon={<AddIcon fontSize='small'/>} variant="outlined" color="inherit" sx={{ mr: 2, fontSize: 12, p: 1 }} onClick={() => setContent([{code: "", stdout: "", stderr: ""}])}>Mã nguồn</Button> */}
          {/* <Button startIcon={<AddIcon />} variant="outlined" color="inherit" sx={{fontSize: 12, p: 1 }} onClick={() => setContent(['<p></p>'])}>Văn bản</Button> */}
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
            {/* <Stack direction="row">
              <Button startIcon={<AddIcon />} variant="outlined" color="inherit" sx={{ mr: 2, fontSize: 12, p: 1  }} onClick={() => setContent([...content.slice(0, i+1), {code: "", stdout: "", stderr: ""}, ...content.slice(i+1)])}>Mã nguồn</Button>
              <Button startIcon={<AddIcon />} variant="outlined" color="inherit" sx={{ fontSize: 12, p: 1  }} onClick={() => setContent([...content.slice(0, i+1), '<p></p>', ...content.slice(i+1)])}>Văn bản</Button>
            </Stack> */}
          </Stack>
        )}
      </CardContent>
      {console.log(content)}
    </Card>
  </Stack>
  );
}

const typeOptions = [
  {
    label: 'VIDEO',
    value: 'VIDEO'
  },
  {
    label: 'PDF',
    value: 'PDF'
  },
  {
    label: 'QUIZ',
    value: 'QUIZ'
  },
  {
    label: 'WORD',
    value: 'WORD'
  },
  {
    label: 'CODE',
    value: 'CODE'
  },
  {
    label: 'PPT',
    value: 'PPT'
  }
];

const initialValues = {
  // id: '',
  type: '',
  // description: '',
  // images: [],
  name: '',
  time : 0,
  difficulty: 0,
  // newPrice: 0,
  // oldPrice: 0,
  score: 10,
  percentOfPass: 100,
  rating: 5,
  topicId: 0,
  fileId: 0,
  // submit: null
};

const validationSchema = Yup.object({
  // id: Yup.number().min(0),
  type: Yup.string().max(255),
  description: Yup.string().max(5000),
  // images: Yup.array(),
  name: Yup.string().max(255).required(),
  time : Yup.number().min(0).required(),
  difficulty: Yup.number().min(0).required(),
  percentOfPass: Yup.number().min(0).required(),
  rating: Yup.number().min(0).max(5),
  score: Yup.number().min(0),
  topicId: Yup.number().required(),
  fileId: Yup.number(),
  // newPrice: Yup.number().min(0).required(),
  // oldPrice: Yup.number().min(0),
});

function FileUploadSection({ caption, setIdLMList }) {
  const [files, setFiles] = useState([]);
  const [disabled, setDisabled] = useState(false);


  const handleFilesDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
    setDisabled(false);
  }, []);

  const handleFileRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
    setDisabled(false);
  }, []);

  const handleFilesRemoveAll = useCallback(() => {
    setFiles([]);
    setDisabled(false);

  }, []);

  const handleFilesUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', files[0]);
    try {
        // NOTE: Make API request
        // console.log(formik.values);
        // console.log(files.map((_file) => _file.path))
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/files`,
            formData, {
            headers: {
                "Content-Type": "multipart/form-data",
              },
          });
        console.log(response.data["id"])

        setIdLMList([response.data["id"]])
        setDisabled(true);
        toast.success('File đã đăng tải thành công');
        // router.push(`${paths.dashboard.explore}/${listLMAccordingToLesson.courseId}`);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        console.error('Error uploading file:', err);
      }
  };


  return (
    <div>
      <Typography color="text.secondary" sx={{ mb: 2 }} variant="subtitle2">
        {caption}
      </Typography>
      <FileDropzoneVn
        accept={{ '*/*': [] }}
        caption="(PDF, SVG, JPG, PNG, or gif maximum 900x400, ...)"
        files={files}
        disabled={disabled}
        onDrop={handleFilesDrop}
        onRemove={handleFileRemove}
        onRemoveAll={handleFilesRemoveAll}
        onUpload={handleFilesUpload}
      />
    </div>
  );
}

export const LMCreateForm = (props) => {
  const lmcreateformUrl = window.location.href.split('/');
  const lessonId = (lmcreateformUrl[lmcreateformUrl.length - 1]);
  // const courseId = (lmcreateformUrl[lmcreateformUrl.length - 2]);
  const [listLMAccordingToLesson, setListLMAccordingToLesson] = useState({
    "title": "",
    "learningMaterial": [
        {
            "id": 9,
            "name": "Document21"
        }
    ],
    "amountOfTime": 0,
    "visibility": true,
    "courseId": 1
  });
  const getLesson = useCallback(async (id) => {
    try {
      const response = await exploreApi.getLesson(id);

      if (isMounted()) {
        setListLMAccordingToLesson(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [open])
  const isMounted = useMounted();
  const router = useRouter();
  const [topicIds, setTopicIds] = useState([])
  const [newTopicId, setNewTopicId] = useState('');
  const [files, setFiles] = useState([]);
  const filter = createFilterOptions();
  const [topicOptions, setTopicOptions] = useState([]);
  const [inputFileId, setInputFileId] = useState([]);
  const [outputFileId, setOutputFileId] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const { user } = useAuth();
  const [examplecontent, setExamplecontent] = useState([{code: "", stdout: "", stderr: ""}]);
  const [truthcontent, setTruthcontent] = useState([{code: "", stdout: "", stderr: ""}]);


  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await lm_manageApi.createLM({
          name: values.name,
          difficulty: values.difficulty,
          type: "CODE",
          score: values.score,
          // rating: values.rating,
          time: values.time,
          // topicIds: topicIds.map((topicIds) => topicIds.id)
          topicId: values.topicId,
          percentOfPass: values.percentOfPass,
          code: {
            question: values.description,
            inputIds: inputFileId,
            exampleCode: examplecontent[0].code,
            truthCode: truthcontent[0].code,
          },
          lessonId: parseInt(lessonId,10)
      })
        // await lm_manageApi.createLM(values);
        toast.success('Tài liệu code đã được tạo');
        router.push(`${paths.dashboard.explore}/${listLMAccordingToLesson.courseId}`);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        // helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  // const handleSubmitNotebook = useCallback(async () => {
  //   await notebookApi.postNotebook({
  //     modelVariationIds: modelVariations ? modelVariations.map(v => v.id) : null,
  //     datasetIds: datasets ? datasets.map(d => d.id) : null,
  //     title: title,
  //     content: content.map(c => typeof(c) === "string" ? c : c.code ),
  //     isPublic: isPublic,
  //     labels: labels,
  //     userId: user.id
  //   })
  //     .then((response) => {
  //       router.push(paths.dashboard.notebook.details.replace(':notebookId', response.data.id));
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     })
  // }, [title, isPublic, content, labels, datasets, modelVariations]);

  const getTopics = useCallback(async () => {
    try {
      const response = await topic_manageApi.getListTopic();

      if (isMounted()) {
        setTopicOptions([...response.data]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [])

  useEffect(() => {
    getTopics();
    getLesson(lessonId);
  },[]);


  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}>
      <Stack spacing={4}>
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
                  Thông tin cơ bản
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    label="Tên tài liệu học tập"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  <TextField
                    error={!!(formik.touched.time && formik.errors.time)}
                    fullWidth
                    label="Thời lượng (phút)"
                    name="time"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.time}
                  />
                  <TextField
                    error={!!(formik.touched.difficulty && formik.errors.difficulty)}
                    fullWidth
                    label="Độ khó (Trên thang 1-10)"
                    name="difficulty"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.difficulty}
                  />
                  <TextField
                    error={!!(formik.touched.percentOfPass && formik.errors.percentOfPass)}
                    fullWidth
                    label="Chuẩn đầu ra (%)"
                    name="percentOfPass"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.percentOfPass}
                  />
                  <TextField
                    error={!!(formik.touched.topicId && formik.errors.topicId)}
                    fullWidth
                    label="Chủ đề học liên quan"
                    name="topicId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.topicId}
                    select
                  >
                    {topicOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        selected
                      >
                        {option.title}
                      </MenuItem>
                    ))}
                  </TextField>
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
                <Stack spacing={1}>
                  <Typography variant="h6">
                    Tài liệu code
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    Tài liệu học sẽ xuất hiện trên hệ thống.
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid
                xs={12}
                md={8}
              >
                <Stack spacing={3}>
                  <div>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 2 }}
                      variant="subtitle2"
                    >
                      Mô tả bài toán
                    </Typography>
                    <QuillEditor
                      onChange={(value) => {
                        formik.setFieldValue('description', value);
                      }}
                      placeholder="Write something"
                      sx={{ height: 400 }}
                      value={formik.values.description}
                    />
                    {!!(formik.touched.description && formik.errors.description) && (
                      <Box sx={{ mt: 2 }}>
                        <FormHelperText error>
                          {formik.errors.description}
                        </FormHelperText>
                      </Box>
                    )}
                  </div>
                  <div>
                  <FileUploadSection caption="Thông tin đầu vào (Input file)" setIdLMList={setInputFileId} />
                  {console.log(inputFileId[0])}
                  </div>
                  <div>
                    <Typography
                        color="text.secondary"
                        sx={{ mb: 2 }}
                        variant="subtitle2"
                    >
                      Đoạn code mẫu
                    </Typography>
                    <Code content={examplecontent} setContent={setExamplecontent}/>
                  </div>
                  <div>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 2 }}
                      variant="subtitle2"
                    >
                      Đoạn code kết quả 
                    </Typography>
                    <Code content={truthcontent} setContent={setTruthcontent}/>
                  </div>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="flex-end"
          spacing={1}
        >
          <Button color="inherit">
            Huỷ thay đổi
          </Button>
          <Button
            type="submit"
            variant="contained"
          >
            Tạo mới
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
