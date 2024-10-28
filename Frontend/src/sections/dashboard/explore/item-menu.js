import PropTypes from 'prop-types';
import Link01Icon from '@untitled-ui/icons-react/build/esm/Link01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import EditIcon from '@mui/icons-material/Edit';
import Trash02Icon from '@untitled-ui/icons-react/build/esm/Trash02';
import { Menu, MenuItem, menuItemClasses, SvgIcon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Input, TextField } from '@mui/material';
import { paths } from '../../../paths';
import NextLink from 'next/link';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { exploreApi } from '../../../api/explore';


export const ItemMenu = (props) => {
  const { anchorEl, onClose, onDelete, open = false, idCourse, topicId, topicName, openDialog = false, setOpenDialog, setTopicList } = props;
  const [newTopicName, setTopicName] = useState("")
  const [openRenameDialog, setRenameDialog] = useState(false)

  const renameTopic = useCallback(async () => {
    try{
      console.log("hello");
      await exploreApi.updateTopic(topicId, {name: newTopicName})
      setTopicList(prev => {
        prev.forEach(topic => {
          if (topicId === topic.id) topic.name = newTopicName
        });
        return prev
      })
      setRenameDialog(false)
      onClose()
      // toast.success("Cập nhật tên bài học thành công")
    } 
    catch(error){
      toast.error("Xảy ra lỗi")
    }
  }, [newTopicName])

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      sx={{
        [`& .${menuItemClasses.root}`]: {
          fontSize: 14,
          '& svg': {
            mr: 1
          }
        }
      }}
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top'
      }}
    >
      <MenuItem 
        onClick={() => setRenameDialog(true)}
      >
        <SvgIcon fontSize="small">
          <EditIcon />
        </SvgIcon>
        Đổi tên bài học
      </MenuItem>
      <MenuItem 
        onClick={onClose}
        component={NextLink}
        href={`${paths.dashboard.explore}/lm_create/${topicId}`}
      >
        <SvgIcon fontSize="small">
          <CreateNewFolderOutlinedIcon />
        </SvgIcon>
        Tạo tài liệu học mới
      </MenuItem>
      {/* <MenuItem 
        onClick={onClose}
        component={NextLink}
        href={`${paths.dashboard.explore}/lm_question_create/${topicId}`}
        >
        <SvgIcon fontSize="small">
          <QuestionMarkOutlinedIcon />
        </SvgIcon>
        Tạo tài liệu câu hỏi mới
      </MenuItem> */}
      {/* <MenuItem 
        onClick={onClose}
        component={NextLink}
        href={`${paths.dashboard.explore}/lm_code_create/${topicId}`}
        >
        <SvgIcon fontSize="small">
          <CodeOutlinedIcon />
        </SvgIcon>
        Tạo tài liệu code mới
      </MenuItem> */}
      <MenuItem
        onClick={() => setOpenDialog(true)}
        sx={{ color: 'error.main' }}
      >
        <SvgIcon fontSize="small">
          <Trash02Icon />
        </SvgIcon>
        Xoá bài học
      </MenuItem>
      <Dialog
        open={openDialog}
        onClose={onClose}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xoá bài học"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn xoá bài học này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Huỷ bỏ</Button>
          <Button onClick={onDelete} autoFocus>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        open={openRenameDialog}
        onClose={() => setRenameDialog(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            renameTopic()
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Tên mới cho bài học "{topicName}"
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            fullWidth
            variant="standard"
            value={newTopicName} 
            onChange={(event) => setTopicName(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialog(false)}>Huỷ bỏ</Button>
          <Button type='submit'>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Menu>
  );
};

ItemMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool
};
