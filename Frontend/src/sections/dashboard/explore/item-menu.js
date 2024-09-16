import PropTypes from 'prop-types';
import Link01Icon from '@untitled-ui/icons-react/build/esm/Link01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Trash02Icon from '@untitled-ui/icons-react/build/esm/Trash02';
import { Menu, MenuItem, menuItemClasses, SvgIcon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { paths } from '../../../paths';
import NextLink from 'next/link';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';


export const ItemMenu = (props) => {
  const { anchorEl, onClose, onDelete, open = false, idCourse, idLesson, openDialog = false, setOpenDialog } = props;

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
        onClick={onClose}
        component={NextLink}
        href={`${paths.dashboard.explore}/lm_create/${idLesson}`}
        >
        <SvgIcon fontSize="small">
          <CreateNewFolderOutlinedIcon />
        </SvgIcon>
        Tạo tài liệu học mới
      </MenuItem>
      {/* <MenuItem 
        onClick={onClose}
        component={NextLink}
        href={`${paths.dashboard.explore}/lm_question_create/${idLesson}`}
        >
        <SvgIcon fontSize="small">
          <QuestionMarkOutlinedIcon />
        </SvgIcon>
        Tạo tài liệu câu hỏi mới
      </MenuItem> */}
      <MenuItem 
        onClick={onClose}
        component={NextLink}
        href={`${paths.dashboard.explore}/lm_code_create/${idLesson}`}
        >
        <SvgIcon fontSize="small">
          <CodeOutlinedIcon />
        </SvgIcon>
        Tạo tài liệu code mới
      </MenuItem>
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
            Bạn chắc chắn xoá bài học này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Huỷ bỏ</Button>
          <Button onClick={onDelete} autoFocus>
            Xoá
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
