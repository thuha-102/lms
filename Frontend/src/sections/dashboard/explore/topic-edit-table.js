import * as React from 'react';
import { Suspense } from 'react'
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DotsVerticalIcon from '@untitled-ui/icons-react/build/esm/DotsVertical';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-hot-toast';
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    IconButton,
    Stack,
    SvgIcon,
    Tooltip,
    Typography
} from '@mui/material';
import { FileIcon } from '../../../components/file-icon';
import { styled } from '@mui/material/styles';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMounted } from '../../../hooks/use-mounted';
import { exploreApi } from '../../../api/explore';
import { fileApi } from '../../../api/file';
import { userApi } from '../../../api/user';
import { learning_logApi } from '../../../api/learning-log';
import { ItemMenu } from './item-menu';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { batch, useDispatch } from 'react-redux';
import { sortBy } from 'lodash';
import { Scrollbar } from '../../../components/scrollbar';
import { useTheme } from '@mui/material/styles';
import { LessonDeleteDialog } from '../academy/lesson-delete-dialog';
import { LessonEditDialog } from '../academy/lesson-edit-dialog';
import { useChatbot } from '../../../hooks/use-chatbot';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function Row(props) {
    const theme = useTheme()
    const router = useRouter();
    const courseUrl = window.location.href.split('/');
    const courseId = (courseUrl[courseUrl.length - 1]);
    const isMounted = useMounted();
    const menuRef = useRef(null);
    const { user } = useAuth();
    const [openMenu, setOpenMenu] = useState(false);
    const [ openDeleteLessonDialog, setDeleteLessonDialog] = useState(0)
    const [ openEditLessonDialog, setEditLessonDialog] = useState(0)
    const { row, topicIndex, dragging, ref, setTopicList } = props;
    const [open, setOpen] = React.useState(false);
    const [openDeleteTopicDialog, setOpenDeleteTopicDialog] = useState(false)
    const [listLMAccordingToLesson, setListLMAccordingToLesson] = useState({
        "id": -1, 
        "name": "",
        "lessons": [
            {
                "id": 9,
                "type": "PDF",
                "title": "Document21",
                "fileId": 1
            }
        ],
});
    const [fileGet, setFileGet] = useState("")
    const [editLessonTitle, setEditLessonTitle] = useState("")
    const chatbot = useChatbot();
    const [currentLessonType, setCurrentLessonType] = useState("")

    // const getLesson = useCallback(async (id) => {
    //     try {
    //     // const response = await exploreApi.getTopic(id);

    //     if (isMounted()) {
    //         setListLMAccordingToLesson(response.data);
    //     }
    //     } catch (err) {
    //     console.error(err);
    //     }
    // }, [open])

    // const getUser = useCallback(async (id) => {
    //   try {
    //     const response = await userApi.getUser(id);

    //     if (isMounted()) {
    //       console.log(response.data)
    //       return response.data;
    //     }
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }, [])


    const createFileLog = async (lessonId, user) => {
        try {
        const result = await learning_logApi.createLog(user.id, lessonId
            // {
            //   rating: 3,
            //   time: 120, //chỗ này cần phải lấy time của lm sau đó gắn vào
            //   attempts: 1,
            //   lessonId: lessonId,
            // }
        );
    
        if (result.data.ratingCourse !== undefined && result.data.ratingCourse !== null) {
            chatbot.handleUpdate({
              chatContent: [...chatbot.chatContent, {
                content: "rating",
                title: result.data.ratingCourse.title,
                description: result.data.ratingCourse.description,
                id: result.data.ratingCourse.id
              }]
            })
          }
          
          if (result.data.ratingSequenceCourse !== undefined && result.data.ratingSequenceCourse !== null) {
            chatbot.handleUpdate({
              chatContent: [...chatbot.chatContent, {
                content: "rating",
                title: "Lộ trình học",
                description: "Độ phù hợp",
                typeLearnerId: result.data.ratingSequenceCourse.typeLearnerId,
              }]
            })
          }

        } catch (err) {
        console.error(err);
        }
    }

    const getFile = useCallback(async (fileId, type) => {
        try {
        // const response = await fileApi.getFileFromGGDrive(id);

        if (isMounted()) {
            // console.log(response.data)
            // setFileGet(response.data.url);
            if (type === 'VIDEO')
            window.open(`${process.env.NEXT_PUBLIC_SERVER_API}/files/video/${fileId}`, '_blank');
            else
            window.open(`${process.env.NEXT_PUBLIC_SERVER_API}/files/${fileId}`, '_blank');
            // console.log(fileGet)

        }
        } catch (err) {
        console.error(err);
        }
    }, [open])

    const handleCheckLm = (lm) => {
        switch(lm.type) {
            case "VIDEO":
            router.push(`${paths.dashboard.explore}/preview_lm/${lm.fileId}`);
            break;
            case "PDF":
            router.push(`${paths.dashboard.explore}/preview_lm/${lm.fileId}`);
            break;
            case "QUIZ":
            router.push(`${paths.dashboard.explore}/preview_lm/${lm.fileId}`);
            break;
            default:
            router.push(`${paths.dashboard.explore}/preview_lm/${lm.fileId}`);
            break;
        }
    }

    const handleMenuClose = useCallback(() => {
        setOpenMenu(false);
    }, []);

    const handleMenuOpen = useCallback(() => {
        setOpenMenu(true);
    }, []);

    const handleDeleteTopic = useCallback(async (id) => {
        console.log("delete topic")
        try {
            await exploreApi.deleteTopic(id);
            setTopicList(prev => prev.filter(topic => topic.id !== id))
            toast.success("Đã xóa bài học thành công")
        } catch (err) {
        console.error(err);
        }
    }, [])

    const handleDeleteLesson = useCallback(async (lmId) => {
        setDeleteLessonDialog(lmId)
    }, [])

    const handleEditLesson = useCallback(async (lmId, lessonName, lessonType) => {
        setEditLessonDialog(lmId)
        setEditLessonTitle(lessonName)
        setCurrentLessonType(lessonType)
    }, [])

    useEffect(() => {
        if (openEditLessonDialog !== 0 && currentLessonType === 'QUIZ') {
            router.push(`${paths.dashboard.explore}/lm_edit/${openEditLessonDialog}`);
        }
    }, [openEditLessonDialog, currentLessonType, router]);

    return (
        <React.Fragment>
            {
                openDeleteLessonDialog !== 0 && <LessonDeleteDialog lessonId={openDeleteLessonDialog} open={openDeleteLessonDialog} setDeleteDialog={setDeleteLessonDialog} setTopicList={setTopicList}/>
            }
            {
                openEditLessonDialog !== 0 && currentLessonType !== 'QUIZ' && <LessonEditDialog topicIndex={topicIndex} lessonId={openEditLessonDialog} lessonTitle={editLessonTitle} open={openEditLessonDialog} setEditDialog={setEditLessonDialog} setTopicList={setTopicList}/>
            }
            <TableRow 
                ref={ref}
                sx={{
                     '& > *': { borderBottom: 'unset'},
                    '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'neutral.700'
                        : 'neutral.50'
                    },
                    display: 'flex', justifyContent: 'space-between', alignItems: 'stretch'
                }}
            >
                <TableCell >
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            setOpen(!open)
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                {row.name}
                </TableCell>
                <TableCell align="right">
                    <IconButton
                        onClick={handleMenuOpen}
                        ref={menuRef}
                    >
                        <SvgIcon fontSize="small">
                            <DotsVerticalIcon />
                        </SvgIcon>
                    </IconButton>
                </TableCell>
            </TableRow>
            
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Droppable droppableId={`droppatable-lesson-${topicIndex}`}>
                            {(droppableProvided, snapshot) => (
                                <Box
                                    ref={droppableProvided.innerRef}
                                    {...droppableProvided.droppableProps}
                                    sx={{
                                        flexGrow: 1,
                                        minHeight: 80,
                                        overflowY: 'auto',
                                    }}
                                >
                                    {row.lessons.map((_lm, index) => (
                                        <Draggable draggableId={`dragtable-lm-${_lm.id}-${index}`} index={index} key={index}>
                                            {(draggableProvided, snapshot) => (
                                                <Box 
                                                    ref={draggableProvided.innerRef}
                                                    {...draggableProvided.draggableProps}
                                                    {...draggableProvided.dragHandleProps}
                                                    // style={{ ...draggableProvided.draggableProps.style }}
                                                    direction="column"
                                                    sx={{
                                                        outline: 'none',
                                                        overflow: 'hidden',
                                                        bgcolor: theme.palette.background.paper,
                                                    }}
                                                >
                                                    <Item
                                                        sx={{
                                                            my: 1,
                                                            mx: 'auto',
                                                            p: 1,
                                                        }}
                                                    >
                                                        <Stack direction="row" alignItems={'center'} justifyContent={'space-between'}>
                                                            <Stack spacing={2} direction='row' alignItems='center' onClick={() => handleCheckLm(_lm)}>
                                                                <FileIcon extension={_lm.type} />
                                                                <Typography align='left' noWrap>{_lm.title}</Typography>
                                                            </Stack>
                                                            <Stack direction={'row'}>
                                                                <IconButton aria-label="edit" color='primary' size="large" onClick={() => handleEditLesson(_lm.id, _lm.title, _lm.type)}>
                                                                    <EditIcon/>
                                                                </IconButton>
                                                                <IconButton aria-label="delete" color='error' size="large" onClick={() => handleDeleteLesson(_lm.id)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Stack>
                                                        </Stack>
                                                    </Item>
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))}
                                    {droppableProvided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </Collapse>
                </TableCell>
            </TableRow>
            <ItemMenu
                anchorEl={menuRef.current}
                onClose={handleMenuClose}
                onDelete={() => handleDeleteTopic(row.id)}
                open={openMenu}
                topicId={row.id}
                topicName={row.name}
                idCourse={parseInt(courseId, 10)}
                openDialog={openDeleteTopicDialog}
                setOpenDialog={setOpenDeleteTopicDialog}
                setTopicList={setTopicList}
            />
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
    }).isRequired,
};

export default function TopicEditTable(props) {
    const { rows, updateOrder, setTopicList} = props
    const theme = useTheme()
    const dispatch = useDispatch()
    const handleDragEnd = useCallback(async ({ source, destination, draggableId }) => {
        try {
            if (!source || !destination || !draggableId) return;

            if (draggableId.includes('topic')){
                updateOrder('topic', source.index, destination.index)
            }
            else{
                const sourceLessonIndex = source.index, sourceTopicIndex = `${source.droppableId}`.split('-').slice(-1)[0];
                const destinationLessonIndex = destination.index, destinationTopicIndex = `${destination.droppableId}`.split('-').slice(-1)[0];
                
                updateOrder(
                    'lesson', 
                    {topicIndex: parseInt(sourceTopicIndex), lessonIndex: sourceLessonIndex}, 
                    {topicIndex: parseInt(destinationTopicIndex), lessonIndex: destinationLessonIndex}
                )
            }
        }
        catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    }, [rows]);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center' colSpan={3}>
                            Tên chủ đề học
                        </TableCell>
                    </TableRow>
                </TableHead>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId='topic' type='topic'>
                        {(droppableProvided, snapshot) => (
                            <TableBody
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                                sx={{
                                    flexGrow: 1,
                                    minHeight: 80,
                                    overflowY: 'auto',
                                    px: 3,
                                    pt: 1.5
                                }}
                            >   
                                <TableRow>
                                    <TableCell>
                                        {
                                            rows.map((row, index) => (
                                                <Draggable draggableId={`dragtable-topic-${index}`} index={index} key={index}>
                                                    {(draggableProvided, snapshot) => (
                                                        <Table
                                                            ref={draggableProvided.innerRef}
                                                            {...draggableProvided.draggableProps}
                                                            {...draggableProvided.dragHandleProps}
                                                            // style={{ ...draggableProvided.draggableProps.style }}
                                                            sx={{
                                                                outline: 'none',
                                                                py: 1.5,
                                                                overflow: 'hidden',
                                                                bgcolor: theme.palette.background.paper,
                                                            }}
                                                        >
                                                            <TableBody>
                                                                <Row key={index} topicIndex={index} row={row} dragging={snapshot.isDragging} setTopicList={setTopicList}/>
                                                            </TableBody>
                                                        </Table>
                                                    )}
                                                </Draggable>
                                            ))
                                        }
                                    </TableCell>
                                </TableRow>
                                {droppableProvided.placeholder}
                            </TableBody>
                        )}
                    </Droppable>
                </DragDropContext>
            </Table>
        </TableContainer>
    )
}