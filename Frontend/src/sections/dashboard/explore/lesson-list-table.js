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
import {
    Avatar,
    AvatarGroup,
    Box,
    Card,
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




const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

// function createData(name, price) {
//   return {
//     name,
//     price,
//     history: [
//       {
//         date: '2020-01-05',
//         customerId: '11091700',
//         type: "PDF",
//       },
//       {
//         date: '2020-01-02',
//         customerId: 'Anonymous',
//         type: "VIDEO"
//       },
//     ],
//   };
// }
export const Video = ({lmId}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const videoRef = useRef(null);

  // const getFile = async (lmId) => {
  //   const response = await fileApi.getFileFromGGDrive(lmId)
  //   console.log(response)
  //   return response.data
  // }

  // useEffect(()=>{
  //   getFile(lmId)
  // },[])

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const updateCurrentTime = () => {
      setCurrentTime(video.currentTime);
    };

    const handleSeekStart = () => {
      setIsSeeking(true);
    };

    const handleSeekEnd = () => {
      setIsSeeking(false);
    };

    video.addEventListener('timeupdate', updateCurrentTime);
    video.addEventListener('seeking', handleSeekStart);
    video.addEventListener('seeked', handleSeekEnd);

    return () => {
      video.removeEventListener('timeupdate', updateCurrentTime);
      video.removeEventListener('seeking', handleSeekStart);
      video.removeEventListener('seeked', handleSeekEnd);
    };
  }, [videoRef.current]);

  const handleVideoSeek = (event) => {
    const video = videoRef.current;
    const time = parseFloat(event.target.value);

    // Kiểm tra xem giá trị thời gian có hợp lệ không
    if (!isNaN(time) && isFinite(time)) {
      setCurrentTime(time);
      if (video) {
        video.currentTime = time;
      }
    }
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <video
        ref={videoRef}
        width="70%"
        // height="70%"
        controls
        preload="none"
        onTimeUpdate={handleVideoSeek}
      >
        <source src={`${process.env.NEXT_PUBLIC_SERVER_API}/learning-materials/${lmId}`} type="video/mp4" />
        <track
          src="/path/to/captions.vtt"
          kind="subtitles"
          srcLang="en"
          label="English"
        />
        Your browser does not support the video tag.
      </video>
      {!isSeeking && (
        <p>Current Time: {currentTime.toFixed(2)} seconds</p>
      )}
    </div>
      )
}


function Row(props) {
  const router = useRouter();
  const courseUrl = window.location.href.split('/');
  const courseId = (courseUrl[courseUrl.length - 1]);
  const isMounted = useMounted();
  const menuRef = useRef(null);
  const { user } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const { row, accountType, isInstructor, registered } = props;
  const [open, setOpen] = React.useState(false);
  const [listLMAccordingToLesson, setListLMAccordingToLesson] = useState({
    "title": "",
    "learningMaterial": [
        {
            "id": 9,
            "name": "Document21"
        }
    ],
    "amountOfTime": 0,
    "visibility": true,
    "courseId": 1
});
  const [fileGet, setFileGet] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const getLesson = useCallback(async (id) => {
    try {
      const response = await exploreApi.getLesson(id);

      if (isMounted()) {
        setListLMAccordingToLesson(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [open])

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


  const createFileLog = async (lm, user) => {
    try {
      const response = await learning_logApi.createLog(user.id, {
        rating: 3,
        time: 120, //chỗ này cần phải lấy time của lm sau đó gắn vào
        attempts: 1,
        learningMaterialId: lm.id,
      });
      console.log(response);

    } catch (err) {
      console.error(err);
    }
  }

  const getFile = useCallback(async (id) => {
    try {
      // const response = await fileApi.getFileFromGGDrive(id);

      if (isMounted()) {
        // console.log(response.data)
        // setFileGet(response.data.url);
        window.open(`${process.env.NEXT_PUBLIC_SERVER_API}/learning-materials/${id}`, '_blank');
        // console.log(fileGet)

      }
    } catch (err) {
      console.error(err);
    }
  }, [open])

  const handlePageChange = (lm, registered) => {  
    // Kiểm tra trước xem khoá học này đã được user register chưa, nếu được register rồi thì mới gửi api createFileLog và getFile
    if(registered) {
      // Gửi api createFileLog và getFile
      switch(lm.type) {
        case "VIDEO":
          router.push(`${paths.dashboard.explore}/preview_lm/${lm.id}`);
          break;
        case "PDF":
          router.push(`${paths.dashboard.explore}/preview_lm/${lm.id}`);
          break;
        case "QUIZ":
          router.push(`${paths.dashboard.explore}/preview_lm/${lm.id}`);
          break;
        case "CODE":
          router.push(`${paths.dashboard.explore}/preview_lm/${lm.id}`);
          break;
        default:
          // code block
          createFileLog(lm, user)
          getFile(lm.id)
      }
    }
  }

  const handleMenuClose = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleMenuOpen = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleDeleteLesson = useCallback(async (id) => {
    console.log("Delete lesson")
    try {
      const response = await exploreApi.deleteLesson(id);
      console.log(response)
    } catch (err) {
      console.error(err);
    }
  }, [])


  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {setOpen(!open)
                            getLesson(row.id)
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        {
          accountType !== "LEARNER" && isInstructor &&
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
        }
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
                {listLMAccordingToLesson.learningMaterial.map((_lm) => (
                <div key={_lm.id}>
                  <Item
                      sx={{
                      my: 1,
                      mx: 'auto',
                      p: 1,
                      }}
                      onClick={() => handlePageChange(_lm, registered)}
                  >
                      <Stack spacing={2} direction="row" alignItems="center">
                          <FileIcon extension={_lm.type} />
                          <Typography noWrap>{_lm.name}</Typography>
                      </Stack>
                  </Item>
                  {/* {console.log(_lm.id)}
                  {_lm.type === "VIDEO" ? <Video lmId={_lm.id}/> : <></>} */}
                </div>
                ))}
            </Box>
            {console.log(listLMAccordingToLesson["learningMaterial"])}
          </Collapse>
        </TableCell>
      </TableRow>
      {accountType !== "LEARNER" && isInstructor && <ItemMenu
        anchorEl={menuRef.current}
        onClose={handleMenuClose}
        onDelete={handleDeleteLesson}
        open={openMenu}
        idLesson={row.id}
        idCourse={parseInt(courseId, 10)}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />}
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default function CollapsibleTable({accountType, rows, isInstructor, registered}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Danh sách bài học</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} accountType={accountType} isInstructor={isInstructor} registered={registered}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}