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
import { CreateCourseDialog } from './course-create-dialog';

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
  // id: '',
  // category: '',
  // description: '',
  // images: [],
  name: ''
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
  subject: Yup.string().max(255).required(),
  preCourseId: Yup.number().min(0),
  postCourseId: Yup.number().min(0)
  // duration : Yup.number().min(0).required(),
  // difficulty: Yup.number().min(0).required(),
  // newPrice: Yup.number().min(0).required(),
  // oldPrice: Yup.number().min(0),
});

export const LearningPathCreateCourse = (props) => {
  const courseUrl = window.location.href.split('/');
  const courseId = (courseUrl[courseUrl.length - 1]);
  const isMounted = useMounted();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [topics, setTopics] = useState(initialTopics);
  const [courseOptions, setCourseOptions] = useState([]);
  const [openCreateCourseDialog, setOpenCreateCourseDialog] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newTopics = Array.from(topics);
    const [movedLesson] = newTopics.splice(result.source.index, 1);
    newTopics.splice(result.destination.index, 0, movedLesson);

    setTopics(newTopics);
  };

    const handleClose = () => {
        setOpenCreateCourseDialog(false);
    };

    const handleAddTopic = (name) => {
        const newTopic = { id: `${topics.length + 1}`, title: `${name}` };
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


  // Hàm xử lý khi click vào Edit
  const handleEdit = async (topicId) => {
    const topicToEdit = topics.find(topic => topic.id === topicId);
    if (topicToEdit) {
      // Thực hiện hành động chỉnh sửa, ví dụ mở một form để chỉnh sửa
      console.log("Editing topic:", topicToEdit);
    //   setEditingTopic(topicToEdit); // Lưu topic cần chỉnh sửa vào state
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
      // Xóa topic bằng cách lọc ra khỏi mảng topics
      const updatedTopics = topics.filter(topic => topic.id !== topicId);
      setTopics(updatedTopics);
      console.log("Deleted topic with id:", topicId);
    }
  };

  return (
    <>
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
                        <IconButton 
                            aria-label="edit"   
                            onClick={() => handleEdit(topic.id)}    
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton 
                            aria-label="delete"
                            onClick={() => handleDelete(topic.id)} // Gọi hàm khi click
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
    <Paper
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
    onClick={() => router.push(`${paths.dashboard.explore}/create`)}
    >
    <QueueIcon/>
    <Typography variant="body1" sx={{px: 2, ml: 2}}>
        Thêm khoá học mới 
    </Typography>
    </Paper>
    <CreateCourseDialog
        courseId={courseId}
        openCreateCourseDialog={openCreateCourseDialog}
        setOpenCreateCourseDialog={setOpenCreateCourseDialog}
        handleClose={handleClose}
        handleAddTopic={handleAddTopic}
    />
    </>
  );
};
