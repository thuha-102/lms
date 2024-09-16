import { useState } from 'react';
import PropTypes, { any } from 'prop-types';
import {
  DialogContent,
  Stack,
  FormControl,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  Button,
  Avatar,
} from '@mui/material';
import { FRAMEWORKS } from '../../../constants'
import AddIcon from '@mui/icons-material/Add';


export const ModelChosen = (props) => {
  const { chooseModel, setChooseModel, setModelVariations, modelVariations, ...other } = props;
  const [framework, setFramework] = useState("selecting");
  const [slugName, setSlugName] = useState("selecting");
  const [variation, setVariation] = useState("selecting");

  return (
    <>
      <Typography variant="h5" mt={3} ml={2}>Thêm mô hình</Typography>
      <DialogContent>
        <Stack direction="row" alignItems="center" spacing={1} mt={2}>
          <Avatar src={chooseModel.author.avatar} style={{width: 20, height: 20}} />
          <Typography variant="subtitle2">{chooseModel.author.name} - Cập nhật mới nhất {chooseModel.updatedAt}</Typography>
        </Stack>
        <Typography variant="h4" mt={3} mb={4}>{chooseModel.title}</Typography>
        <FormControl sx={{ mb: 3, width: "100%" }}>
          <InputLabel>Framework</InputLabel>
          <Select
            value={framework}
            onChange={(e) => {
              setFramework(e.target.value);
              setSlugName("selecting");
              setVariation("selecting");
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
            sx={{color: framework === "selecting" ? "text.disabled" : "text.primary"}}
          >
            <MenuItem value="selecting">
              Chọn Framework
            </MenuItem>
            {Array.from(chooseModel.modelVariations).map(([f, _]) => 
              <MenuItem value={f} key={f}>
                {FRAMEWORKS.get(f)}
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl sx={{ mb: 3, width: "100%"  }}>
          <InputLabel>Biến thể</InputLabel>
          <Select
            value={slugName}
            onChange={(e) => {
              setSlugName(e.target.value);
              setVariation("selecting");   
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
            sx={{color: slugName === "selecting" ? "text.disabled" : "text.primary"}}
          >
            <MenuItem value="selecting">
              Chọn Biến thể
            </MenuItem>
            {chooseModel.modelVariations.get(framework) && Array.from(chooseModel.modelVariations.get(framework)).map(([slug, _]) => 
              <MenuItem value={slug} key={slug} disabled={modelVariations.findIndex(v => v.modelId == chooseModel.id && v.framework == framework && v.slugName == slug) != -1}>
                {slug}
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl sx={{ mb: 3, width: "100%" }}>
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
            sx={{color: variation === "selecting" ? "text.disabled" : "text.primary"}}
          >
            <MenuItem value="selecting">
              Chọn phiên bản
            </MenuItem>
            {chooseModel.modelVariations.get(framework) && chooseModel.modelVariations.get(framework).get(slugName) && chooseModel.modelVariations.get(framework).get(slugName).map(vari => 
              <MenuItem value={vari} key={vari.version}>
                Phiên bản {vari.version}
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <Stack direction="row" justifyContent="flex-end">    
          <Button sx={{ mr: 2, color: "text.primary" }} onClick={() => setChooseModel(null)}>Hủy</Button>   
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            disabled={framework === "selecting" || slugName === "selecting" || variation === "selecting"}
            onClick={() => {
              setModelVariations([...modelVariations, {modelVariation: {...variation, framework: framework, slugName: slugName, model: {
                id: chooseModel.id,
                title: chooseModel.title 
              }}}]);
              setChooseModel(null);
            }}
          >
            Thêm mô hình
          </Button> 
        </Stack>
      </DialogContent>
    </>
  );
}

ModelChosen.propTypes = {
  chooseModel: PropTypes.object.isRequired,
  setChooseModel: PropTypes.func.isRequired,
  modelVariations: PropTypes.arrayOf(PropTypes.object).isRequired,
  setModelVariations: PropTypes.func.isRequired
};
