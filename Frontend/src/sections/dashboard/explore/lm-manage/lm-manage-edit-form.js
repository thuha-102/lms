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
import { QuizQuestionaireEdit } from './quiz-question-create';

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
  type: 'QUIZ',
  // description: '',
  // images: [],
  title: '',
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

export const LMEditForm = (props) => {
  const lmcreateformUrl = window.location.href.split('/');
  const lessonId = (lmcreateformUrl[lmcreateformUrl.length - 1]);
  const isMounted = useMounted();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [idLMList, setIdLMList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [order, setOrder] = useState(null)
  const [lesson, setLesson] = useState({
    id: 0,
    title: 0,
    time: 0
  });
  const [questionnaire, setQuestionnaire] = useState([])
  const [rawData, setRawData] = useState()

  const createUpdateQuestionaire = useCallback(() => {
    console.log(questionnaire)
    return {
      length: questionnaire.length,
      coverIds: questionnaire.map(q => q[0]),
      questions: questionnaire.map(q => q[1]),
      correctAnswers: questionnaire.map(q => q[2]),
      answers: questionnaire.map(q => q.slice(3)),
    }
  }, [questionnaire])

  const getLesson = useCallback(async (id) => {
    try {
      const responseLesson = await exploreApi.getLesson(id);
      const responseQuiz = await exploreApi.getLM(responseLesson.data.lmId)

      if (isMounted()) {
        formik.setValues(responseLesson.data)

        setQuestionnaire(
          responseQuiz.data.questions.map(
            (question, index) => [responseQuiz.data.coverIds[index], question, responseQuiz.data.correctAnswers[index], ...responseQuiz.data.choices[index]]
          )
        )

        setRawData({
          lesson: responseLesson.data,
          questionnaire: responseQuiz.data.questions.map(
            (question, index) => [responseQuiz.data.coverIds[index], question, responseQuiz.data.correctAnswers[index], ...responseQuiz.data.choices[index]]
          )
        })
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
        console.log("go to the moonnn")
        // await exploreApi.updateLesson(lessonId, {
        //   title: values.title,
        //   time: values.time,
        //   questionnaire: []
        //   // difficulty: values.difficulty,
        //   // type: values.type,
        //   // score: values.score,
        // })

        toast.success('Tài liệu học tập đã được tạo');
        router.push(`${paths.dashboard.explore}/${lesson.courseId}`);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        // helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    getLesson(lessonId);  
  },[lessonId]);

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

  const handleCancelUpdate = useCallback(() => {
    setQuestionnaire(rawData.questionnaire)
  }, [rawData])

  const handleUpdateQuiz = useCallback(async () => {
    try {
      await exploreApi.updateLesson(lessonId, {
          title: formik.values.title,
          time: formik.values.time,
          questionnaire: createUpdateQuestionaire()
          // difficulty: values.difficulty,
          // type: values.type,
          // score: values.score,
        })
      
      toast.success('Tài liệu học tập đã được cập nhật');
      // router.push(`${paths.dashboard.explore}/${lesson.courseId}`);
    }
    catch(error){
      console.error(error);
      toast.error("Xảy ra lỗi")
    }
  }, [formik, questionnaire])

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
                    name="title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.title}
                  />
                  <TextField
                    error={!!(formik.touched.type && formik.errors.type)}
                    disabled={true}
                    fullWidth
                    label="Phân loại"
                    name="type"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={"QUIZ"}
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
          <CardMedia
            component="img"
            src="/quiz_create_template.png"
            alt="Mô tả cho ảnh của bạn"
          />
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
                <FileDropzoneVn
                    accept={{
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
                      'text/csv': ['csv'],
                    }}
                    caption="(Vui lòng tạo file excel bảng câu hỏi theo mẫu trên)"
                    files={files}
                    oneFile={files.length === 1}
                    disabled={true}
                    onDrop={handleFilesDrop}
                    onRemove={handleFileRemove}
                    onRemoveAll={handleFilesRemoveAll}
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
              >
                <Stack spacing={1}>
                  <Typography variant="h6">
                    Thông tin các câu hỏi
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    <QuizQuestionaire questionnaire={questionnaire} file={files[0]} setQuestionnaire={setQuestionnaire}/>
                  </Typography>
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
          <Button 
            onClick={handleCancelUpdate}
            color="inherit"
          >
            Huỷ thay đổi
          </Button>
          <Button
            onClick={handleUpdateQuiz}
            type="submit"
            variant="contained"
          >
            Cập nhật
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
