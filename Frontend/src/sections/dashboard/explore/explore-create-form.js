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
import axios from 'axios';
import CourseUploadTips from '../learning-path-manage/course-upload-tip';

const BackgroundKnowledgeType = [
  {
    label: 'Cơ bản',
    value: 'BEGINNER'
  },
  {
    label: 'Trung cấp',
    value: 'INTERMEDIAN'
  },
  {
    label: 'Chuyên gia',
    value: 'EXPERT'
  }
];

const initialValues = {
  level: '',
  name: '',
  amountOfTime : 0,
  visibility: false,
  description: '',
  price: 0,
  salePercent: 0,
  passPercent: 80,
  free: false
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
  const [topicOptions, setTopicOptions] = useState([]);
  const [visibilityChecked, setVisibilityChecked] = useState(false);
  const handleVisibilityChange = () => {
    setVisibilityChecked(!visibilityChecked);
  };
  const [files, setFiles] = useState([]);
  const [fileIds, setFileIds] = useState([]);
  const [disabled, setDisabled] = useState(false);

  // useEffect(() => {
  //   localStorage.setItem("sequenceCourseIds", JSON.stringify(courseIds));
  // }, [courseIds]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        // console.log(formik.values);
        const response = await exploreApi.createCourse({
          name: values.name,
          description: values.description ,
          avatarId: fileIds[0],
          price: values.free ? 0 : values.price,
          salePercent: values.salePercent/100,
          // idInstructor: parseInt(localStorage.getItem("id"), 10),
          visibility: visibilityChecked,
          level: values.level,
          labels: [],
          amountOfTime: values.amountOfTime ,
          topicNames: [],
          lessons: [],
      })
        toast.success('Khoá học mới đã được tạo');
        router.push(`${paths.dashboard.explore}/${response.data.id}`);
      } catch (err) {
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

  const handleFilesUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    console.log(formData)
    formData.append('file', files[0]);
    console.log(formData)
    try {
        // NOTE: Make API request
        // console.log(formik.values);
        // console.log(files.map((_file) => _file.path))
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/files/avatar`
        , formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        // const response = await axios.get(`http://localhost:8080/files/9/information`);

        setFileIds([response.data["id"]])
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
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
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
                    label="Cấp độ của khoá học"
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
                    label="Thời lượng của khoá học (phút)"
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
                    Mô tả về khoá học
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
                      Chi phí khoá học
                      </Typography>
                  </Grid>
                  <Grid
                      xs={12}
                      md={8}
                  >
                      <Stack spacing={3}>
                      <TextField
                          error={!!(formik.touched.price && formik.errors.price)}
                          fullWidth
                          label="Giá thông thường"
                          name="price"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="number"
                          disabled={formik.values.free}
                          value={formik.values.free ? 0 : formik.values.price}
                      />
                      <TextField
                          error={!!(formik.touched.salePercent && formik.errors.salePercent)}
                          fullWidth
                          label="Phần trăm giảm (0-100)"
                          InputProps={{ inputProps: { min: 0, max: 100 } }}
                          name="salePercent"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="number"
                          disabled={formik.values.free}
                          value={formik.values.free ? 0 : formik.values.salePercent}
                      />
                      <div>
                          <FormControlLabel
                            control={<Switch defaultChecked />}
                            onChange={formik.handleChange}
                            label="Đây là khoá học miễn phí"
                            name="free"
                            value={formik.values.free}
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
                  <Stack spacing={1}>
                  <Typography variant="h6">
                      Ảnh quảng bá khoá học
                  </Typography>
                  <Typography
                      color="text.secondary"
                      variant="body2"
                  >
                      Size: 700x430 pixels
                  </Typography>
                  </Stack>
              </Grid>
              <Grid
                  xs={12}
                  md={8}
              >
                  <FileDropzoneVn
                  accept={{ 'image/*': [] }}
                  caption="(JPG, PNG maximum 700x430)"
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
      </Grid>
      <Grid item xs={12} md={4}>
        <CourseUploadTips />
      </Grid>
    </Grid>
    </form>
  );
};
