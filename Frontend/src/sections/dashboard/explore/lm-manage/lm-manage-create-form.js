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
  CardMedia,
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
import axios from 'axios';
import { QuizQuestionaire } from './quiz-questionarie';


const typeOptions = [
  {
    label: 'PDF',
    value: 'PDF'
  },
  {
    label: 'VIDEO',
    value: 'VIDEO'
  },
  {
    label: 'QUIZ',
    value: 'QUIZ'
  },
  // {
  //   label: 'WORD',
  //   value: 'WORD'
  // },
  // {
  //   label: 'CODE',
  //   value: 'CODE'
  // },
  // {
  //   label: 'PPT',
  //   value: 'PPT'
  // }
];

const initialValues = {
  // id: '',
  type: 'PDF',
  // description: '',
  // images: [],
  name: '',
  time : 0,
  difficulty: 1,
  percentOfPass: 80,
  score: 10,
  rating: 5,
  topicId: 0,
  fileId: 0,
  // newPrice: 0,
  // oldPrice: 0,
  // submit: null
};

const validationSchema = Yup.object({
  // id: Yup.number().min(0),
  type: Yup.string().max(255),
  // description: Yup.string().max(5000),
  // images: Yup.array(),
  name: Yup.string().max(255).required(),
  time : Yup.number().min(0).integer().required(),
  difficulty: Yup.number().min(1).max(10).integer().required(),
  percentOfPass: Yup.number().min(0).max(100).required(),
  rating: Yup.number().min(0).max(5),
  score: Yup.number().min(0),
  topicId: Yup.number().required(),
  fileId: Yup.number(),
  // newPrice: Yup.number().min(0).required(),
  // oldPrice: Yup.number().min(0),
});

export const LMCreateForm = (props) => {
  const lmcreateformUrl = window.location.href.split('/');
  const lessonId = (lmcreateformUrl[lmcreateformUrl.length - 1]);
  // const courseId = (lmcreateformUrl[lmcreateformUrl.length - 2]);
  const isMounted = useMounted();
  const router = useRouter();
  const [topicIds, setTopicIds] = useState([])
  const [newTopicId, setNewTopicId] = useState('');
  const [files, setFiles] = useState([]);
  const filter = createFilterOptions();
  const [topicOptions, setTopicOptions] = useState([]);
  const [idLMList, setIdLMList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [order, setOrder] = useState(null)
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
  const [questionarie, setQuestionnaire] = useState({
    length: 0,
    questions: [],
    coverIds: [],
    correctAnswers: [[]],
    answers: [],
  })

  const getLesson = useCallback(async (id) => {
    try {
      const response = await exploreApi.getTopic(id);

      if (isMounted()) {
        setListLMAccordingToLesson(response.data);
        setOrder(response.data.learningMaterial ? response.data.learningMaterial.length + 1 : 1)
      }
    } catch (err) {
      console.error(err);
    }
  }, [])

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const response = await lm_manageApi.createLesson({
          title: values.name,
          time: values.time,
          order: order,
          fileId: idLMList.length > 0 ? idLMList[0] : null,
          topicId: parseInt(lessonId,10),
          // difficulty: values.difficulty,
          // type: values.type,
          // score: values.score,
        })

        if (formik.values.type === 'QUIZ')
          await lm_manageApi.createQuiz(response.data.id, questionarie)

        toast.success('Tài liệu học tập đã được tạo');
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
    // getTopics();
    // console.log(lessonId)
    getLesson(lessonId);  
  },[]);

  const handleFilesDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
    setDisabled(false);
  }, []);
  
  const handleFileDrop = useCallback((newFiles) => {
    setFiles(newFiles);
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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/files`,
            formData, {
            headers: {
                "Content-Type": "multipart/form-data",
              },
          });

        setIdLMList([response.data["id"]])
        setDisabled(true);
        toast.success('File đã đăng tải thành công');
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        console.error('Error uploading file:', err);
      }
  };

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
                    helperText={formik.touched.name && formik.errors.name && "Tên tài liệu là trường bắt buộc"}
                    label="Tên tài liệu học tập"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  <TextField
                    error={!!(formik.touched.type && formik.errors.type)}
                    fullWidth
                    label="Phân loại"
                    name="type"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.type}
                    select
                  >
                    {typeOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        selected
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
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
                  {/* <TextField
                    error={!!(formik.touched.difficulty && formik.errors.difficulty)}
                    helperText={formik.touched.difficulty && formik.errors.difficulty && "Độ khó phải có giá trị 1-10"}
                    fullWidth
                    label="Độ khó (Trên thang 1-10)"
                    name="difficulty"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.difficulty}
                  /> */}
                  {/* <TextField
                    error={!!(formik.touched.percentOfPass && formik.errors.percentOfPass)}
                    helperText={formik.touched.percentOfPass && formik.errors.percentOfPass && "Chuẩn đầu ra phải từ 0-100"}
                    fullWidth
                    label="Chuẩn đầu ra (0-100) %"
                    name="percentOfPass"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.percentOfPass}
                  /> */}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          {formik.values.type === "QUIZ" ? <CardMedia
            component="img"
            src="/quiz_create_template.png"
            alt="Mô tả cho ảnh của bạn"
          /> : <></>}
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
                    Tài liệu học
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
                {formik.values.type === "QUIZ" 
                ? <FileDropzoneVn
                    accept={{
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
                      'text/csv': ['csv'],
                    }}
                    caption="(Vui lòng tạo file excel bảng câu hỏi theo mẫu trên)"
                    files={files}
                    disabled={true}
                    onDrop={handleFilesDrop}
                    onRemove={handleFileRemove}
                    onRemoveAll={handleFilesRemoveAll}
                />
                :<FileDropzoneVn
                  accept={{...formik.values.type === 'PDF' ? {'application/pdf': ['.pdf']} : {'video/mp4': ['.mp4']}}}
                  caption={formik.values.type}
                  files={files}
                  disabled={disabled}
                  onDrop={handleFilesDrop}
                  onRemove={handleFileRemove}
                  onRemoveAll={handleFilesRemoveAll}
                  onUpload={handleFilesUpload}
                />}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {
          formik.values.type === 'QUIZ' && files.length > 0 && 
          <Card>
            <CardContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                >
                  <Stack spacing={1}>
                    <Typography variant="h6">
                      Thông tin các câu hỏi
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      <QuizQuestionaire file={files[0]} setQuestionnaire={setQuestionnaire}/>
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        }
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
