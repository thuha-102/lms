import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  FormHelperText,
  Link,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
  SvgIcon,
  IconButton
} from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
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
import { CreateCourseDialog } from './course-create-dialog';
import { BrowserRouter } from 'react-router-dom';

// import CourseUploadTips from './course-upload-tip';
// import CourseBuilder from './course-builder';
import CreateCourse from './learning-path-create';

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

const initialValues = {
  name: ''
};

const validationSchema = Yup.object({
  name: Yup.string().max(255).required(),
  subject: Yup.string().max(255).required(),
  preCourseId: Yup.number().min(0),
  postCourseId: Yup.number().min(0)
});

export const LearningPathCreateCourse = () => {
  // localStorage.setItem("sequenceCourseIds", JSON.stringify(courseIds));
  const courseUrl = window.location.href.split('/');
  const courseId = (courseUrl[courseUrl.length - 1]);
  const isMounted = useMounted();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  // const [topics, setTopics] = useState(initialTopics);
  const [courseOptions, setCourseOptions] = useState([]);
  const [openCreateCourseDialog, setOpenCreateCourseDialog] = useState(false);
  const [courseIds, setCourseIds] = useState(() => {
    // Khởi tạo state từ localStorage nếu có
    const listCourseIds = localStorage.getItem("sequenceCourseIds");
    console.log(listCourseIds)
    return listCourseIds ? JSON.parse(listCourseIds) : [];
  });

  // const handleDragEnd = (result) => {
  //   if (!result.destination) return;

  //   const newCourseIds = Array.from(courseIds);
  //   const [movedLesson] = newCourseIds.splice(result.source.index, 1);
  //   newCourseIds.splice(result.destination.index, 0, movedLesson);

  //   setCourseIds(newCourseIds);
  // };

    const handleDragEnd = (result) => {
      if (!result.destination) return;

      const newCourseIds = Array.from(courseIds);
      const [movedCourse] = newCourseIds.splice(result.source.index, 1);
      newCourseIds.splice(result.destination.index, 0, movedCourse);

      setCourseIds(newCourseIds);
      console.log(courseIds)
    };

    const handleClose = () => {
        setOpenCreateCourseDialog(false);
    };

    const handleAddCourseId = (name) => {
        const newCourseId = { id: `${courseIds.length + 1}`, name: `${name}` };
        setCourseIds([...courseIds, newCourseId]);
        // setMaincourseIds(courseIds);
    };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        // console.log(formik.values);
        await learning_path_manageApi.createCourse({
          name: values.name,
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
    // getCourses();
    localStorage.setItem("sequenceCourseIds", JSON.stringify(courseIds));
  },[courseIds]);


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


  // Hàm xử lý khi click vào Edit
  const handleEdit = async (topicId) => {
    const topicToEdit = courseIds.find(topic => topic.id === topicId);
    if (topicToEdit) {
      // Thực hiện hành động chỉnh sửa, ví dụ mở một form để chỉnh sửa
      console.log("Editing topic:", topicToEdit);
    //   setEditingCourseId(topicToEdit); // Lưu topic cần chỉnh sửa vào state
    try {
        // NOTE: Make API request
        // console.log(formik.values);
        // await learning_path_manageApi.createCourse({
        //   title: values.name,
        //   subject: values.subject,
        //   preCourseIds: [values.preCourseId],
        //   postCourseIds: [values.postCourseId],
        // })
        toast.success('Tên khoá học đã được sửa');
        router.push(`${paths.dashboard.explore}/course/1`);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
      // Bạn có thể hiển thị form chỉnh sửa ở đây
    }
  };


  // Hàm xử lý khi click vào Delete
  const handleDelete = (topicId) => {
    // Xác nhận trước khi xóa
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa mục này không?");
    if (confirmDelete) {
      // Xóa topic bằng cách lọc ra khỏi mảng courseIds
      const updatedCourseIds = courseIds.filter(topic => topic.id !== topicId);
      setCourseIds(updatedCourseIds);
      console.log("Deleted topic with id:", topicId);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="course">
            {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
                {courseIds.map((courseId, index) => (
                <Draggable key={courseId.id} draggableId={String(courseId.id)} index={index}>
                    {(provided) => (
                    <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ mb: 2, padding: 2, display: 'flex', alignItems: 'center' }}
                    >
                        <IconButton 
                            aria-label="edit"   
                            href={`${paths.dashboard.explore}/${courseId.id}`} 
                        >
                            <NavigateNextRoundedIcon />
                        </IconButton>
                        <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {courseId.name}
                        </Typography>
                        {/* <Link
                          color="text.primary"
                          component={NextLink}
                          href={paths.dashboard.topic_manage}
                          variant="subtitle2"
                        >
                          <PlaylistAddIcon />
                        </Link> */}
                        <IconButton 
                            aria-label="edit"   
                            onClick={() => handleEdit(courseId.id)}    
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton 
                            aria-label="delete"
                            onClick={() => handleDelete(courseId.id)} // Gọi hàm khi click
                        >
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
    {/* <Paper
    sx={{
        mb: 2,
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: '#e3e7ea'
    }}
    // onClick={handleAddTopic}
    // onClick={() => setOpenCreateCourseDialog(true) }
    onClick={() => router.push(${paths.dashboard.learning_path_manage}/create-course)}
    >
    <QueueIcon/>
    <Typography variant="body1" sx={{px: 2, ml: 2}}>
        Thêm khoá học mới 
    </Typography>
    </Paper> */}
      <Stack
        justifyContent="flex-end"  // Canh ngang các phần tử về bên phải
        direction="row"
        spacing={3}
      >
        <Button
          component={NextLink}
          // Thay đổi đường dẫn để lưu vào db
          href={`${paths.dashboard.learning_path_manage}/create-course`}
          startIcon={(
            <SvgIcon>
              <QueueIcon />
            </SvgIcon>
          )}
          variant="contained"
        >
          Thêm khoá học mới
        </Button>
      </Stack>

    <CreateCourseDialog
        courseId={courseId}
        openCreateCourseDialog={openCreateCourseDialog}
        setOpenCreateCourseDialog={setOpenCreateCourseDialog}
        handleClose={handleClose}
        handleAddCourseId={handleAddCourseId}
    />
    </>
  );
};