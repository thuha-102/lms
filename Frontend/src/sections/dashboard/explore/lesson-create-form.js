import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
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
import { FileDropzoneVn } from '../../../components/file-dropzone-vn';
import { QuillEditor } from '../../../components/quill-editor';
import { paths } from '../../../paths';
import { exploreApi } from '../../../api/explore';
import { FileApi } from '../../../api/file';
import { useMounted } from '../../../hooks/use-mounted';
import { LMCreateForm } from '../../../sections/dashboard/explore/lm-manage/lm-manage-create-form';

import axios from 'axios';

const subjectOptions = [
  {
    label: 'FUNDAMENTALS',
    value: 'FUNDAMENTALS'
  },
  {
    label: 'DATA SCIENTIST',
    value: 'DATA_SCIENTIST'
  },
  {
    label: 'MACHINE LEARNING',
    value: 'MACHINE_LEARNING'
  },
  {
    label: 'DEEP LEARNING',
    value: 'DEEP_LEARNING'
  },
  {
    label: 'DATA ENGINEER',
    value: 'DATA_ENGINEER'
  },
  {
    label: 'BIG DATA ENGINEER',
    value: 'BIG_DATA_ENGINEER'
  }
];
const categoryOptions = [
  {
    label: 'Video',
    value: 'video'
  },
  {
    label: 'PDF',
    value: 'pdf'
  },
  {
    label: 'Quiz',
    value: 'quiz'
  },
  {
    label: 'Podcast',
    value: 'podcast'
  },
  {
    label: 'Khác',
    value: 'somethingelse'
  },
];

const initialValues = {
  // id: '',
  // category: '',
  // description: '',
  // images: [],
  title: '',
  idCourse: 0,
  idLearningMaterial: [],
  // duration : 0,
  // difficulty: 0,
  // newPrice: 0,
  // oldPrice: 0,
  // submit: null
};

const validationSchema = Yup.object({
  // id: Yup.number().min(0),
  // category: Yup.string().max(255),
  // description: Yup.string().max(5000),
  // images: Yup.array(),
  name: Yup.string().max(255).required(),
  idCourse: Yup.string().max(255).required(),
//   preTopicId: Yup.number().min(0),
//   postTopicId: Yup.number().min(0)
  // duration : Yup.number().min(0).required(),
  // difficulty: Yup.number().min(0).required(),
  // newPrice: Yup.number().min(0).required(),
  // oldPrice: Yup.number().min(0),
});

export const LessonCreateForm = (props) => {
  const { courseid } = props;
  const isMounted = useMounted();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [idLMList, setIdLMList] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        // console.log(formik.values);
        await exploreApi.createLesson({
          title: values.name,
          idCourse: parseInt(courseid, 10),
          idLearningMaterial: idLMList,
      })
        toast.success('Bài học đã được tạo');
        router.push(`${paths.dashboard.explore}/${courseid}`);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const getTopics = useCallback(async () => {
    try {
      const response = await exploreApi.getListTopic();

      if (isMounted()) {
        setTopicOptions([...response.data]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [])

  useEffect(() => {
    getTopics();
  },[]);

  const handleFilesDrop = useCallback((newFiles) => {
    console.log(newFiles)
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

// Chưa làm nè má ơi
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

        setIdLMList([response.data["id"]])
        setDisabled(true);
        toast.success('File đã đăng tải thành công');
        // router.push(`${paths.dashboard.explore}/course`);
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
                    helperText={formik.touched.name && formik.errors.name}
                    label="Tên bài học"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  {/* <TextField
                    error={!!(formik.touched.subject && formik.errors.subject)}
                    fullWidth
                    label="Phân loại mục tiêu"
                    name="subject"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.subject}
                    select
                  >
                    {subjectOptions.map((option) => (
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
                    error={!!(formik.touched.preTopicId && formik.errors.preTopicId)}
                    fullWidth
                    label="Chủ đề liền trước"
                    name="preTopicId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.preTopicId}
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
                    {console.log(topicOptions)}
                    
                  </TextField> */}
                  {/* <TextField
                    error={!!(formik.touched.postTopicId && formik.errors.postTopicId)}
                    fullWidth
                    label="Tài liệu học liên quan"
                    name="postTopicId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.postTopicId}
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
                  </TextField> */}
                  {/* <TextField
                    error={!!(formik.touched.category && formik.errors.category)}
                    fullWidth
                    label="Phân loại"
                    name="category"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    value={formik.values.category}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    error={!!(formik.touched.duration && formik.errors.duration)}
                    fullWidth
                    label="Thời lượng"
                    name="duration"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.duration}
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
                    error={!!(formik.touched.belong_to_topic && formik.errors.belong_to_topic)}
                    fullWidth
                    label="Chủ đề liên quan"
                    name="belong_to_topic"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.belong_to_topic}
                  />
                  <div>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 2 }}
                      variant="subtitle2"
                    >
                      Mô tả
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
                  </div> */}
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
                    Tài liệu học
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    Chọn tài liệu học liên quan đến bài học để tải lên hệ thống.
                  </Typography>
                </Stack>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <FileDropzoneVn
                  accept={{ '*//*': [] }}
                  caption="(PDF, SVG, JPG, PNG, or gif maximum 900x400, ...)"
                  files={files}
                  disabled={disabled}
                  onDrop={handleFilesDrop}
                  onRemove={handleFileRemove}
                  onRemoveAll={handleFilesRemoveAll}
                  onUpload={handleFilesUpload}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* <LMCreateForm /> */}
        {/* <Card>
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
                  Pricing
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.oldPrice && formik.errors.oldPrice)}
                    fullWidth
                    label="Old price"
                    name="oldPrice"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.oldPrice}
                  />
                  <TextField
                    error={!!(formik.touched.newPrice && formik.errors.newPrice)}
                    fullWidth
                    label="New Price"
                    name="newPrice"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.newPrice}
                  />
                  <div>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Keep selling when stock is empty"
                    />
                  </div>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card> */}
        {/* <Card>
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
                  Category
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.category && formik.errors.category)}
                    fullWidth
                    label="Category"
                    name="category"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    value={formik.values.category}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card> */}
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
