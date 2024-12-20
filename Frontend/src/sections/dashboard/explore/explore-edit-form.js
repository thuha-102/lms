'use client'
import { useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  Unstable_Grid2 as Grid,
  CardMedia,
} from '@mui/material';
import { FileDropzoneVn } from '../../../components/file-dropzone-vn';
import { QuillEditor } from '../../../components/quill-editor';
import { paths } from '../../../paths';
import { exploreApi } from '../../../api/explore';
import { useMounted } from '../../../hooks/use-mounted';
import axios from 'axios';
import CourseUploadTips from '../learning-path-manage/course-upload-tip';

const initialCover = '/assets/covers/minimal-1-4x3-large.png';

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
  id: "",
  createdAt: "",
  updatedAt: "",
  level: "",
  name: "",
  description: "",
  price: "",
  avatarId: "",
  amountOfTime: "",
  topics: [
    {
      id: 0,
      name: "",
      lessons: [
          {
              id: 0,
              title: "",
              fileId: 0,
              type: ""
          },
      ]
    },
  ],
};

// const validationSchema = Yup.object({
//   name: Yup.string().max(255).required(),
//   idInstructor: Yup.number(),
//   visibility: Yup.boolean().required(),
//   level: Yup.string().max(255).required(),
//   amountOfTime: Yup.number().min(0),
//   description: Yup.string().max(5000),
// });

export const CourseEditForm = () => {
  const isMounted = useMounted();
  const param = usePathname()
  const [courseId, setCourseId] = useState("");
  const [details, setDetails] = useState();
  const [visibilityChecked, setVisibilityChecked] = useState(false);
  const [freeChecked, setFreeChecked] = useState(false);
  const [preview, setPreview] = useState();

  const handleVisibilityChange = () => {
    setVisibilityChecked(!visibilityChecked);
  };
  const [files, setFiles] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const formik = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await exploreApi.updateCourse(values.id, {
          name: values.name,
          description: values.description ,
          avatarId: fileId,
          price: values.price,
          salePercent: values.salePercent,
          // idInstructor: parseInt(localStorage.getItem("id"), 10),
          visibility: freeChecked,
          level: values.level,
          // labels: [],
          amountOfTime: values.amountOfTime,
          topicNames: [],
          lessons: [],
        })

        setFiles([])
        setFileId(null)
        toast.success('Khoá học đã cập nhật');
        // router.push(`${paths.dashboard.explore}/${response.data.id}`);
      } catch (err) {
        toast.error('Xảy ra lỗi');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const getDetails = useCallback(async (courseId) => {
    try {
      const response = await exploreApi.detailCourse(courseId);
      if (isMounted()) {
        formik.setValues(response.data);
        setDetails(response.data);
        setVisibilityChecked(response.data.visibility)
        setFreeChecked(response.data.price == 0)
      }
    } catch (err) {
      console.error(err);
    }
  }, [])

  useEffect(() => {
    if (param) getDetails(param.split('/')[3]);
  },[param]);

  useEffect(() => {
    console.log(fileId)
  }, [preview, fileId])

  const handleFilesDrop = useCallback((newFiles) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        setPreview([reader.result]);
    };
    reader.readAsDataURL(newFiles[0]);

    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleFileRemove = useCallback((file) => {
    setPreview(null)
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleFilesRemoveAll = useCallback(() => {
    setPreview(null)
    setFiles([]);
  }, []);

  const handleFilesUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', files[0]);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/files/avatar`
        , formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setFileId(response.data["id"])
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
    <form onSubmit={formik.handleSubmit} >
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
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
                              disabled={freeChecked}
                              type="number"
                              // placeholder={details?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                              value={freeChecked ? 0 : formik.values.price}
                          />
                          <TextField
                              error={!!(formik.touched.salePercent && formik.errors.salePercent)}
                              fullWidth
                              label="Phần trăm giảm (0-100)"
                              name="salePercent"
                              InputProps={{ inputProps: { min: 0, max: 100 } }}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              disabled={freeChecked}
                              type="number"
                              value={freeChecked ? 0 : formik.values.salePercent*100}
                          />
                          <div>
                              <FormControlLabel
                                control={<Switch checked={freeChecked} onChange={() => setFreeChecked(!freeChecked)}/>}
                                label="Đây là khoá học miễn phí"
                                name="free"
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
                  direction={'column'}
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
                  <Grid>
                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={4}>
                      <Card sx={{height: 300, width: 600}}> 
                        <CardMedia 
                          sx={{height: 300}}
                          image={
                            preview
                            ? 
                              preview
                            :
                              (
                                details?.avatarId  
                                ? 
                                  `${process.env.NEXT_PUBLIC_SERVER_API}/files/${details?.avatarId}`
                                :
                                  "/assets/cards/card-visa.png"
                              )
                          }
                        />
                      </Card>
                      <FileDropzoneVn
                        accept={{ 'image/*': [] }}
                        caption="(JPG, PNG maximum 700x430)"
                        oneFile={files.length === 1}
                        files={files}
                        disabled={disabled}
                        onDrop={handleFilesDrop}
                        onRemove={handleFileRemove}
                        onRemoveAll={handleFilesRemoveAll}
                        onUpload={handleFilesUpload}
                      />
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
              Chỉnh sửa
            </Button>
          </Stack>
        </Stack>
        </Grid>
      </Grid>
    </form>
  );
};
