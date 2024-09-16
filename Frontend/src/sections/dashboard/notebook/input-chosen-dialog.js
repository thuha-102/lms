import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  Dialog,
  DialogContent,
  Stack,
  SvgIcon,
  Typography,
  Link,
  Button,
  Input,
  Card,
  Avatar,
  Badge
} from '@mui/material';
import { modelApi } from '../../../api/model';
import { datasetApi } from '../../../api/dataset';
import { paths } from '../../../paths';
import { userApi } from '../../../api/user';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { useAuth } from '../../../hooks/use-auth';
import { ModelChosen } from './model-chosen';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 30,
  height: 30,
  border: `2px solid ${theme.palette.background.paper}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderColor: theme.palette.action.disabledBackground
}));

export const InputChosenDialog = (props) => {
  const { onClose, open = false, setDatasets, setModelVariations, datasets, modelVariations, ...other } = props;
  const { user } = useAuth();
  const [filters, setFilters] = useState([
    {
      label: "Của bạn",
      value: true,
    },
    {
      label: "Tất cả",
      value: false
    },
    {
      label: "Mô hình",
      value: false
    },
    {
      label: "Tập dữ liệu",
      value: false
    }
  ]);
  const [chooseModel, setChooseModel] = useState(null);
  const [ recommendDatasets, setRecommendDatasets ] = useState([]);
  const [ recommendModels, setRecommendModels ] = useState([]);

  useEffect(() => {
    const getRecommendModels = async (criteria) => {
      try {
        const response = await modelApi.getModels(criteria);
        const recommendModelsInfo = await Promise.all(response.data.map(async r => {
          const userResponse = await userApi.getUser(r.userId);
          return {
            ...r, 
            author: {
              avatar: userResponse.data.avatar,
              name: userResponse.data.username
            }
          }
        }));
        setRecommendModels(recommendModelsInfo);
      } catch (err) {
        console.error(err);
      }
    };

    const getRecommendDatasets = async (criteria) => {
      try {
        const response = await datasetApi.getDatasets(criteria);
        const recommendDatasetsInfo = await Promise.all(response.data.map(async r => {
          const userResponse = await userApi.getUser(r.userId);
          return {
            ...r, 
            author: {
              avatar: userResponse.data.avatar,
              name: userResponse.data.username
            }
          }
        }));
        setRecommendDatasets(recommendDatasetsInfo);
      } catch (err) {
        console.error(err);
      }
    }

    if (filters[3].value) {
      setRecommendModels([]);
    } else {
      getRecommendModels(filters[0].value ? { userId: user.id } : { userId: user.id, isPublic: true });
    }

    if (filters[2].value) {
      setRecommendDatasets([]);
    } else {
      getRecommendDatasets(filters[0].value ? { userId: user.id } : { userId: user.id, isPublic: true });
    }
  },[filters, user]);

  const handelAddModel = useCallback((model) => {
    const modelVariationsMap = new Map();
    for (let i = 0; i < model.modelVariations.length; i++) {
      const framework = model.modelVariations[i].framework;
      const slugName = model.modelVariations[i].slugName;
      if (!modelVariationsMap.has(framework)) {
        modelVariationsMap.set(framework, new Map());
      }
      if (!modelVariationsMap.get(framework).has(slugName)) {
        modelVariationsMap.get(framework).set(slugName, []);
      }
      modelVariationsMap.get(framework).get(slugName).push({
        id: model.modelVariations[i].id,
        version: model.modelVariations[i].version,
        filesType: model.modelVariations[i].filesType,
        description: model.modelVariations[i].description,
        exampleUse: model.modelVariations[i].exampleUse,
        modelId: model.modelVariations[i].modelId,
      });
    }
    setChooseModel({...model, modelVariations: modelVariationsMap});
  }, [recommendModels])
  
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
      {...other}
    >
      {chooseModel == null ? <>
        <Typography variant='h5' mt={3} ml={2}>Chọn Input</Typography>
        <Card
          elevation={16}
          sx={{
            alignItems: 'center',
            borderRadius: 2,
            display: 'flex',
            px: 2,
            py: 1, 
            my: 2,
            mx: 2
          }}
        >
          <SvgIcon fontSize="medium" htmlColor="#848C97" >
            <SearchMdIcon />
          </SvgIcon>
          <Input placeholder="Tìm kiếm từ khóa..." disableUnderline fullWidth sx={{marginLeft: 2}} inputProps={{ style: { fontSize: '13px' } }}/>
        </Card>
        <Stack direction="row" justifyItems="flex-start" spacing={1} sx={{mb: 2, mx: 2}}>
          {filters.map((f, i) => 
            <Button 
              key={i}
              color="inherit" 
              sx={{border: '1px solid', borderColor: "text.disabled", borderRadius: 10, p: 1, backgroundColor: filters[i].value?"action.disabledBackground":"inherit", fontSize: 13}}
              onClick={() => {
                if (i == 1) {
                  setFilters([{...filters[0], value: false}, {...filters[1], value: true}, {...filters[2], value: false}, {...filters[3], value: false}])
                } else if ((i == 2 && filters[3].value) || (i == 3 && filters[2].value)) {
                  setFilters([...filters.slice(0, 2), {...filters[2], value: !filters[2].value}, {...filters[3], value: !filters[3].value}]);  
                } else {
                  setFilters([{...filters[0], value: i==0?!filters[0].value:filters[0].value}, {...filters[1], value: filters[i].value?filters[1].value:false}, {...filters[2], value: i==2?!filters[2].value:filters[2].value}, {...filters[3], value: i==3?!filters[3].value:filters[3].value}])
                }
              }}
            >
              {f.label}
            </Button>
          )}
        </Stack>
        <DialogContent>
          <Stack overflow="auto" height={300}>
            {recommendDatasets.map(dataset => 
              <Stack key={dataset.id} border="1px solid" borderColor="action.disabledBackground" p={2} direction="row" alignItems="center">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <SmallAvatar>
                      <TableChartOutlinedIcon fontSize='small'/>
                    </SmallAvatar>
                  }
                  sx={{mr: 3}}
                >
                  <Avatar src={dataset.author.avatar} style={{width: 50, height: 50}} />
                </Badge>
                <Link 
                  color="text.primary"
                  noWrap
                  sx={{ cursor: 'pointer' }}
                  underline="none"
                  target='_blank'
                  href={paths.dashboard.dataset.details.replace(':datasetId', dataset.id)}
                >
                  <Typography variant='h6' fontSize={14}>{dataset.title}</Typography>
                  <Typography sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {dataset.author.name} - Cập nhật mới nhất {dataset.updatedAt}
                  </Typography>
                  <Typography sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {dataset.votes} bình chọn - {dataset.filesType.length} tệp
                  </Typography>
                </Link>
                <Button 
                  sx={{ minWidth: 30, maxWidth: 30, minHeight: 30, maxHeight: 30, borderRadius: "100%", color: datasets.includes(dataset) ? "primary" : "text.primary", ml: "auto" }}
                  onClick={() => datasets.some(d => d.dataset.id === dataset.id) ? setDatasets([...datasets.slice(0, datasets.findIndex(d => d.dataset.id === dataset.id)), ...datasets.slice(datasets.findIndex(d => d.dataset.id === dataset.id) + 1)]) : setDatasets([...datasets, {dataset: dataset}])}
                >
                  <AddCircleOutlineIcon />
                </Button>
              </Stack>
            )}
            {recommendModels.map(model => 
              <Stack key={model.id} border="1px solid" borderColor="action.disabledBackground" p={2} direction="row" alignItems="center">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <SmallAvatar>
                      <ModelTrainingOutlinedIcon fontSize='small'/>
                    </SmallAvatar>
                  }
                  sx={{mr: 3}}
                >
                  <Avatar src={model.author.avatar} style={{width: 50, height: 50}} />
                </Badge>
                <Link 
                  color="text.primary"
                  noWrap
                  sx={{ cursor: 'pointer' }}
                  underline="none"
                  target='_blank'
                  href={paths.dashboard.model.details.replace(':modelId', model.id)}
                >
                  <Typography variant='h6' fontSize={14}>{model.title}</Typography>
                  <Typography sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {model.description && model.description != "" ? model.description : "Không có mô tả"}
                  </Typography>
                  <Typography sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {model.author.name} - {model.votes} bình chọn
                  </Typography>
                </Link>
                <Button 
                  sx={{ minWidth: 30, maxWidth: 30, minHeight: 30, maxHeight: 30, borderRadius: "100%", color: "text.primary", ml: "auto" }}
                  onClick={() => handelAddModel(model)}
                >
                  <AddCircleOutlineIcon />
                </Button>
              </Stack>
            )}
          </Stack>   
          <Stack flexDirection="row" justifyContent="flex-end" pt={3}>
            <Button
              variant="contained"
              onClick={onClose}
            >
              Hoàn tất
            </Button>
          </Stack>
        </DialogContent>
      </>
      : <>
        <ModelChosen chooseModel={chooseModel} setChooseModel={setChooseModel} modelVariations={modelVariations} setModelVariations={setModelVariations}/>
      </>}
    </Dialog>
  );
}

InputChosenDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  modelVariations: PropTypes.arrayOf(PropTypes.object).isRequired,
  setDatasets: PropTypes.func.isRequired,
  setModelVariations: PropTypes.func.isRequired
};
