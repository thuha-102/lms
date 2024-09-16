import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Link,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useAuth } from '../../../hooks/use-auth';
import { FRAMEWORKS } from '../../../constants';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

export const ModelVariationsShow = (props) => {
  const { modelVariations, ownerId } = props;
  const { user } = useAuth();
  const [framework, setFramework] = useState(modelVariations.keys().next().value);
  const [slugName, setSlugName] = useState(modelVariations.get(modelVariations.keys().next().value).keys().next().value);
  const [variation, setVariation] = useState(modelVariations.get(modelVariations.keys().next().value).get(modelVariations.get(modelVariations.keys().next().value).keys().next().value)[0]);
 
  return (
    <Stack border="1px solid" borderColor="action.disabledBackground" p={3} borderRadius={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <FormControl variant="standard">
          <InputLabel>Framework</InputLabel>
          <Select
            value={framework}
            onChange={(e) => {
              setFramework(e.target.value);
              setSlugName(modelVariations.get(e.target.value).keys().next().value);
              setVariation(modelVariations.get(e.target.value).get(modelVariations.get(e.target.value).keys().next().value)[0]);
            }}
            autoWidth
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            }}
            sx={{width: 500}}
          >
            {Array.from(modelVariations).map(([f, _]) => 
              <MenuItem value={f} key={f}>
                {FRAMEWORKS.get(f)}
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <Button startIcon={<FileDownloadOutlinedIcon />} variant='outlined' color='inherit'>Tải xuống</Button>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={10} mb={6}>
        <FormControl variant="standard">
          <InputLabel>Biến thể</InputLabel>
          <Select
            value={slugName}
            onChange={(e) => {
              setSlugName(e.target.value);
              setVariation(modelVariations.get(framework).get(e.target.value)[0]);
            }}
            autoWidth
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            }}
            sx={{width: 500}}
          >
            {Array.from(modelVariations.get(framework)).map(([slug, _]) => 
              <MenuItem value={slug} key={slug}>
                {slug}
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl variant="standard">
          <InputLabel>Phiên bản</InputLabel>
          <Select
            value={variation}
            onChange={(e) => {
              setVariation(e.target.value);
            }}
            autoWidth
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            }}
            sx={{width: 200}}
          >
            {modelVariations.get(framework).get(slugName).map(vari => 
              <MenuItem value={vari} key={vari.version}>
                Phiên bản {vari.version}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Stack>
      <Stack spacing={3}>
        <Stack direction='row' alignItems="center">
          <Typography variant="h6">Thông tin biến thể</Typography>
          {ownerId == user.id && <Button style={{ marginLeft: 'auto', borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40 }}>
            <CreateOutlinedIcon />
          </Button>}
        </Stack>
        <Typography
          color="text.secondary"
          variant="subtitle2"
        >
          {variation.description?variation.description:"Chưa có thông tin"}
        </Typography>
      </Stack>
      <Divider sx={{ my: 3 }}/>
      <Stack spacing={3} mb={6}>
        <Stack direction='row' alignItems="center">
          <Typography variant="h6">Cách sử dụng</Typography>
          {ownerId == user.id && <Button style={{ marginLeft: 'auto', borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40 }}>
            <CreateOutlinedIcon />
          </Button>}
        </Stack>
        <Typography
          color="text.secondary"
          variant="subtitle2"
        >
          {variation.exampleUse?variation.exampleUse:"Chưa có cách sử dụng"}
        </Typography>
      </Stack>
      <Stack mb={3}>
        <Typography variant="h6">Các tệp</Typography>
      </Stack>
      <Stack>
        <Stack border="1px solid" borderColor="action.disabledBackground" px={3} pt={3} pb={2} borderRadius={2}>
          {variation.filesType.map((t, idx) => (
            <Link
              key={idx}
              href={`${process.env.NEXT_PUBLIC_SERVER_API}/uploads/modelVariations/${variation.id}_${idx}${t}`}
              color="text.primary"
              target="_blank" 
              rel="noopener noreferrer"
              mb={1}
            >
              <Stack direction="row" spacing={1}>
                <InsertDriveFileOutlinedIcon fontSize='small'/>
                <Typography variant="body2">{variation.id}_{idx}{t}</Typography>
              </Stack>
            </Link>  
          ))} 
        </Stack>
      </Stack>
    </Stack>
  );
};

ModelVariationsShow.propTypes = {
  modelVariations: PropTypes.any.isRequired,
  ownerId: PropTypes.number.isRequired,
};
