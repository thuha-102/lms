import { Container, Box, Typography, Grid, Paper, Accordion, AccordionSummary, AccordionDetails, Stack, Card, CardContent, TextField, MenuItem, Button, FormControlLabel, Switch, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CourseUploadTips from './course-upload-tip';
import CourseBuilder from './learning-path-builder';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { FileDropzoneVn } from '../../../components/file-dropzone-vn';
import { useCallback, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
const initialValues = {
    // id: '',
    // category: '',
    // description: '',
    // images: [],
    name: ''
    // duration : 0,
    // difficulty: 0,
    // discountedPrice: 0,
    // regularPrice: 0,
    // submit: null
  };
  
  const validationSchema = Yup.object({
    // id: Yup.number().min(0),
    // category: Yup.string().max(255),
    // description: Yup.string().max(5000),
    // images: Yup.array(),
    name: Yup.string().max(255).required(),
    subject: Yup.string().max(255).required(),
    preCourseId: Yup.number().min(0),
    postCourseId: Yup.number().min(0)
    // duration : Yup.number().min(0).required(),
    // difficulty: Yup.number().min(0).required(),
    // discountedPrice: Yup.number().min(0).required(),
    // regularPrice: Yup.number().min(0),
  });

export default function CreateCourse() {
    const [files, setFiles] = useState([]);
    const [topics, setTopics] = useState(initialTopics);

    const handleDragEnd = (result) => {
      if (!result.destination) return;
  
      const newTopics = Array.from(topics);
      const [movedLesson] = newTopics.splice(result.source.index, 1);
      newTopics.splice(result.destination.index, 0, movedLesson);
  
      setTopics(newTopics);
    };
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, helpers) => {
          try {
            // NOTE: Make API request
            // console.log(formik.values);
            await learning_path_manageApi.createCourse({
              title: values.name,
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
    <Container disableGutters maxWidth={false}>
      <Box my={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {/* Accordion cho Course Info */}
            <Accordion sx={{ mb: 3 }}>
              <AccordionSummary 
                sx={{ height: '59px'}}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="course-info-content"
                id="course-info-header"
              >
                <Typography variant="h6">Thông tin khoá học</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <Stack spacing={4}>
                <Card  sx={{ width: '100%' }}>
                <CardContent sx={{ width: '100%', margin: 2 }}>
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
                                error={!!(formik.touched.description && formik.errors.description)}
                                fullWidth
                                helperText={formik.touched.description && formik.errors.description}
                                label="Mô tả khoá học"
                                name="description"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            />
                            <TextField
                                fullWidth
                                label="Phân loại khoá học"
                                name="subject"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.subject}
                                select
                              >
                                {subjectOptions.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                            </TextField>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
                </Card>
                <Card  sx={{ width: '100%' }}>
                <CardContent sx={{ width: '100%', margin: 2 }}>
                    <Grid
                    container
                    spacing={3}
                    >
                        <Grid
                            xs={12}
                            md={4}
                        >
                            <Typography variant="h6">
                            Cài đặt khoá học
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
                                error={!!(formik.touched.description && formik.errors.description)}
                                fullWidth
                                helperText={formik.touched.description && formik.errors.description}
                                label="Mô tả khoá học"
                                name="description"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            />
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
                </Card>
                <Card  sx={{ width: '100%' }}>
                    <CardContent sx={{ width: '100%', margin: 2 }}>
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
                                    error={!!(formik.touched.regularPrice && formik.errors.regularPrice)}
                                    fullWidth
                                    label="Giá thông thường"
                                    name="regularPrice"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="number"
                                    value={formik.values.regularPrice}
                                />
                                <TextField
                                    error={!!(formik.touched.discountedPrice && formik.errors.discountedPrice)}
                                    fullWidth
                                    label="Giá sau giảm"
                                    name="discountedPrice"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="number"
                                    value={formik.values.discountedPrice}
                                />
                                <div>
                                    <FormControlLabel
                                    control={<Switch defaultChecked />}
                                    label="Đây là khoá học miễn phí"
                                    />
                                </div>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card  sx={{ width: '100%' }}>
                    <CardContent sx={{ width: '100%', margin: 2 }}>
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
                            onDrop={handleFilesDrop}
                            onRemove={handleFileRemove}
                            onRemoveAll={handleFilesRemoveAll}
                            />
                        </Grid>
                    </Grid>
                    </CardContent>
                </Card>
                {/* <Stack
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
                </Stack> */}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Accordion cho Course Intro Video */}
            <Accordion sx={{ mb: 3   }}>
              <AccordionSummary
                sx={{ height: '59px'}}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="course-video-content"
                id="course-video-header"
              >
                <Typography variant="h6">Video giới thiệu khoá học</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {/* Thêm form hoặc nội dung cho Course Intro Video */}
                  Đây là phần video giới thiệu khóa học. Bạn có thể thêm các field upload video tại đây.
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Accordion cho Course Intro Video */}
            <Accordion sx={{ mb: 3 }}>
              <AccordionSummary
                sx={{ height: '59px'}}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="course-video-content"
                id="course-video-header"
              >
                <Typography variant="h6">Nội dung khoá học</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Accordion sx={{ mb: 3 }}>
                    <AccordionSummary
                        sx={{ height: '59px'}}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="course-video-content"
                        id="course-video-header"
                    >
                        <Typography variant="h6">Lesson 1</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* Thêm form hoặc nội dung cho Course Intro Video */}
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="topics">
                                {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {topics.map((topic, index) => (
                                    <Draggable key={topic.id} draggableId={topic.id} index={index}>
                                        {(provided) => (
                                        <Paper
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{ mb: 2, padding: 2, display: 'flex', alignItems: 'center' }}
                                        >
                                            <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                            {topic.title}
                                            </Typography>
                                            <IconButton aria-label="edit">
                                            <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete">
                                            <DeleteIcon />
                                            </IconButton>
                                        </Paper>
                                        )}
                                    </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                                )}
                            </Droppable>
                        </DragDropContext>
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
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ mb: 3 }}>
                    <AccordionSummary
                        sx={{ height: '59px'}}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="course-video-content"
                        id="course-video-header"
                    >
                        <Typography variant="h6">Lesson 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        {/* Thêm form hoặc nội dung cho Course Intro Video */}
                        Đây là phần video giới thiệu khóa học. Bạn có thể thêm các field upload video tại đây.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
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
                        Thêm bài học mới
                    </Button>
                </Stack> 
              </AccordionDetails>
            </Accordion>

          </Grid>

          <Grid item xs={12} md={4}>
            <CourseUploadTips />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
