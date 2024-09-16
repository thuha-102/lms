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
import { useMounted } from '../../../hooks/use-mounted';

const BackgroundKnowledgeType = [
  {
    label: 'BASIC',
    value: 'BASIC'
  },
  {
    label: 'INTERMEDIATE',
    value: 'INTERMEDIATE'
  },
  {
    label: 'EXPERT',
    value: 'EXPERT'
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
  idInstructor: 2,
  level: '',
  // description: '',
  // images: [],
  name: '',
  amountOfTime : 0,
  visibility: false,
  description: '',
  // difficulty: 0,
  // newPrice: 0,
  // oldPrice: 0,
  // submit: null
};

const validationSchema = Yup.object({
  name: Yup.string().max(255).required(),
  idInstructor: Yup.number(),
  visibility: Yup.boolean().required(),
  level: Yup.string().max(255).required(),
  amountOfTime: Yup.number().min(0),
  description: Yup.string().max(5000),
});

export const CourseCreateForm = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [visibilityChecked, setVisibilityChecked] = useState(false);
  const handleVisibilityChange = () => {
    setVisibilityChecked(!visibilityChecked);
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        console.log(formik.values);
        const response = await exploreApi.createCourse({
          name: values.name,
          idInstructor: parseInt(localStorage.getItem("id"), 10),
          visibility: visibilityChecked,
          level: values.level,
          amountOfTime: values.amountOfTime ,
          description: values.description ,
      })
        console.log(response.data.id)
        toast.success('Khoá học mới đã được tạo');
        router.push(`${paths.dashboard.explore}/${response.data.id}`);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  // const getTopics = useCallback(async () => {
  //   try {
  //     const response = await exploreApi.getListTopic();

  //     if (isMounted()) {
  //       setTopicOptions([...response.data]);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [])

  // useEffect(() => {
  //   getTopics();
  // },[]);

  const handleFilesDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleFileRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleFilesRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);



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
                    label="Tên khoá học"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  <TextField
                    error={!!(formik.touched.level && formik.errors.level)}
                    fullWidth
                    label="Level"
                    name="level"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.level}
                    select
                  >
                    {BackgroundKnowledgeType.map((option) => (
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
                    error={!!(formik.touched.amountOfTime && formik.errors.amountOfTime)}
                    fullWidth
                    label="Thời lượng (phút)"
                    name="amountOfTime"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.amountOfTime}
                  />
                  <div>
                    <FormControlLabel
                      control={<Switch
                                checked={visibilityChecked}
                                onChange={handleVisibilityChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                              />}
                      label="Cho phép học viên nhìn thấy khoá học này"
                    />
                  </div>
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
                    Mô tả
                  </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
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
