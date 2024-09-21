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
  Unstable_Grid2 as Grid,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FileDropzoneVn } from '../../../components/file-dropzone-vn';
import { QuillEditor } from '../../../components/quill-editor';
import { paths } from '../../../paths';
import { topic_manageApi } from '../../../api/topic-manage';
import { useMounted } from '../../../hooks/use-mounted';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import QueueIcon from '@mui/icons-material/Queue';

// import CourseUploadTips from './course-upload-tip';
// import CourseBuilder from './course-builder';
import CreateCourse from './learning-path-create';
import { LearningPathCreateCourse } from './learning-path-create-course';
import {GroupCreateDialog} from './group-create-dialog';

const initialTopics = [
  { id: '1', title: 'Difficult Things About Education.' },
  { id: '2', title: 'The Complete Histudy 2024: From Zero to Expert!' },
  { id: '3', title: 'The Complete Histudy 2024: From Zero to Expert!' },
  { id: '4', title: 'Five Things You Should Do In Education.' }
];

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
const initialGroupName = [
  {
    label: 'Nhóm 1',
    value: 'gr1'
  },
  {
    label: 'Nhóm 2',
    value: 'gr2'
  },
  {
    label: 'Nhóm 3',
    value: 'gr3'
  },
];

const initialValues = {
  // id: '',
  // category: '',
  // description: '',
  // images: [],
  group_name: ''
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
  group_name: Yup.string().max(255).required(),
  subject: Yup.string().max(255).required(),
  preCourseId: Yup.number().min(0),
  postCourseId: Yup.number().min(0)
  // duration : Yup.number().min(0).required(),
  // difficulty: Yup.number().min(0).required(),
  // newPrice: Yup.number().min(0).required(),
  // oldPrice: Yup.number().min(0),
});

export const LearningPathCreateForm = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [topics, setTopics] = useState(initialTopics);
  const [courseOptions, setCourseOptions] = useState([]);
  const [openGroupCreateDialog, setOpenGroupCreateDialog] = useState(false);


  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newTopics = Array.from(topics);
    const [movedLesson] = newTopics.splice(result.source.index, 1);
    newTopics.splice(result.destination.index, 0, movedLesson);

    setTopics(newTopics);
  };

  const handleAddTopic = () => {
    const newTopic = { id: `${topics.length + 1}`, title: `Topic ${topics.length + 1}` };
    setTopics([...topics, newTopic]);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        // console.log(formik.values);
        await learning_path_manageApi.createCourse({
          title: values.group_name,
          subject: values.subject,
          preCourseIds: [values.preCourseId],
          postCourseIds: [values.postCourseId],
      })
        toast.success('Chủ đề học tập đã được tạo');
        router.push(paths.dashboard.learning_path_manage);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const getCourses = useCallback(async () => {
    try {
      const response = await learning_path_manageApi.getListCourse();

      if (isMounted()) {
        setCourseOptions([...response.data]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [])

  useEffect(() => {
    getCourses();
  },[]);

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

  const handleCreateGroup = useCallback(() => {
    setOpenGroupCreateDialog(true);
  }, [])

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
                  Thông tin cơ bản về lộ trình học
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.group_name && formik.errors.group_name)}
                    fullWidth
                    helperText={formik.touched.group_name && formik.errors.group_name}
                    label="Tên nhóm người học"
                    name="group_name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.group_name}
                    select
                  >
                    {initialGroupName.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                    <MenuItem
                      key="createGroup"
                      value="createGroup" // Maintain the current value to avoid dropdown close
                      onMouseDown={(event) => {
                        event.preventDefault(); // Prevent the default selection behavior
                        handleCreateGroup();
                      }}
                    >
                      Thêm nhóm người học
                    </MenuItem>                    
                  </TextField>
                  <GroupCreateDialog 
                      initialGroupName={initialGroupName}
                      openGroupCreateDialog={openGroupCreateDialog}
                      setOpenGroupCreateDialog={setOpenGroupCreateDialog}
                  />
                  <TextField
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
                    error={!!(formik.touched.preCourseId && formik.errors.preCourseId)}
                    fullWidth
                    label="Chủ đề liền trước"
                    name="preCourseId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.preCourseId}
                    select
                  >
                    {courseOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        selected
                      >
                        {option.title}
                      </MenuItem>
                    ))}                    
                  </TextField>
                  <TextField
                    error={!!(formik.touched.postCourseId && formik.errors.postCourseId)}
                    fullWidth
                    label="Chủ đề học sau"
                    name="postCourseId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.postCourseId}
                    select
                  >
                    {courseOptions
                    .filter((option, index) => index >= formik.values.preCourseId)
                    .map((option) => (
                      <MenuItem key={option.id} value={option.id} selected>
                        {option.title}
                      </MenuItem>
                    ))}
                  </TextField>
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
                    error={!!(formik.touched.belong_to_course && formik.errors.belong_to_course)}
                    fullWidth
                    label="Chủ đề liên quan"
                    name="belong_to_course"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.belong_to_course}
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
                <Typography variant="h6">
                  Tạo lộ trình học
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <LearningPathCreateCourse></LearningPathCreateCourse>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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
                  accept={{ '*//*': [] }}
                  caption="(PDF, SVG, JPG, PNG, or gif maximum 900x400, ...)"
                  files={files}
                  onDrop={handleFilesDrop}
                  onRemove={handleFileRemove}
                  onRemoveAll={handleFilesRemoveAll}
                />
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
        <Box>
          <CreateCourse />
        </Box>
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
