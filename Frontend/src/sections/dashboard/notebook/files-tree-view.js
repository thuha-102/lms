import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  Button,
  Link,
  Typography
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';

export const FilesTreeView = (props) => {
  const { filesTree, setFiles, variationKeyId, editDisabled, ...other } = props;
  const [expandList, setExpandList] = useState(filesTree.map(_ => false));

  return (
    <Stack sx={{ width: "100%", mb: 1 }} overflow="auto">
      {filesTree.map((f, i) =>
        <Stack key={i}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Button variant="inherit" sx={{pl: 1, py: 0, fontWeight: 400}} startIcon={expandList[i] ? <ArrowRightOutlinedIcon /> : <ArrowDropDownIcon />} onClick={() => setExpandList([...expandList.slice(0, i), !expandList[i], ...expandList.slice(i+1)])}>
              <Typography fontSize={14} sx={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                {f.title}
              </Typography>
            </Button>
            {!editDisabled && <Button variant="inherit" 
              sx={{marginLeft: "auto", maxWidth: 30, minWidth: 30, minHeight: 30, maxHeight: 30, borderRadius: '100%', p: 1}}
              onClick={() => setFiles(pre => pre.filter(p => p[variationKeyId].id != f.id))}
            >
              <DeleteOutlinedIcon fontSize='small'/>
            </Button>}
          </Stack>
          {expandList[i] && f.items.map(item => 
            <Link
              key={item}
              href={`${process.env.NEXT_PUBLIC_SERVER_API}/uploads/${item}`}
              color="text.primary"
              target="_blank" 
              rel="noopener noreferrer"
              ml={4}
            >
              <Stack alignItems="center" direction="row">
                <InsertDriveFileOutlinedIcon sx={{ mr: 1 }} fontSize='small'/>
                <Typography variant='body2' fontSize={13}>{item.split('/', 2)[1]}</Typography>  
              </Stack>
            </Link>
          )}   
        </Stack>
      )}          
    </Stack>
  );
}

FilesTreeView.propTypes = {
  filesTree: PropTypes.arrayOf(PropTypes.object).isRequired,
  setFiles: PropTypes.func.isRequired,
  variationKeyId: PropTypes.string.isRequired,
  editDisabled: PropTypes.bool.isRequired
};
