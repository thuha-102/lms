import { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Stack,
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { useAuth } from '../../../../hooks/use-auth';
import { modelApi } from '../../../../api/model';
import { useRouter } from 'next/router';
import { FRAMEWORKS } from '../../../../constants';
import { useMounted } from '../../../../hooks/use-mounted';
import { FileDropzoneVn } from '../../../../components/file-dropzone-vn';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const useModelVariations = () => {
  const isMounted = useMounted();
  const [modelVariations, setModelVariations] = useState([]);
  const [modelInfo, setModelInfo] = useState();
  const router = useRouter();

  const getModelVariations = useCallback(async () => {
    try {
      if (router.isReady) {
        const modelId = router.query.modelId;
        const response = await modelApi.getModelDetail(modelId);
        console.log(response);
        
        if (isMounted()) {
          setModelInfo({id: response.data.id, title: response.data.title});
          const modelVariationsMap = new Map();
          for (let i = 0; i < response.data.modelVariations.length; i++) {
            const framework = response.data.modelVariations[i].framework;
            const slugName = response.data.modelVariations[i].slugName;
            if (!modelVariationsMap.has(framework)) {
              modelVariationsMap.set(framework, new Map());
            }
            if (!modelVariationsMap.get(framework).has(slugName)) {
              modelVariationsMap.get(framework).set(slugName, []);
            }
            modelVariationsMap.get(framework).get(slugName).push({
              id: response.data.modelVariations[i].id,
              version: response.data.modelVariations[i].version,
              filesStyle: response.data.modelVariations[i].filesStyle
            });
          }
          setModelVariations(modelVariationsMap);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted,router.isReady]);

  useEffect(() => {
    getModelVariations();
  }, [router.isReady]);

  return {modelInfo, modelVariations, setModelVariations};
};

const Page = () => {
  const {modelInfo, modelVariations, setModelVariations} = useModelVariations();
  const [files, setFiles] = useState([]);
  const [framework, setFramework] = useState("selecting");
  const [slugName, setSlugName] = useState("");
  const { user } = useAuth();
  
  usePageView();

  const handleSubmitModelVariation = useCallback(async () => {
    let version = 1;
    const modelVariationFormData = new FormData();
    modelVariationFormData.append("framework", framework);
    modelVariationFormData.append("slugName", slugName);
    if (modelVariations.has(framework) && modelVariations.get(framework).has(slugName)) {
      version = modelVariations.get(framework).get(slugName)[0].version + 1;
    }
    modelVariationFormData.append("version", version);
    files.forEach(file => {
      modelVariationFormData.append("files", file);
    });
    modelVariationFormData.append("modelId", modelInfo.id);

    await modelApi.postModelVariation(modelVariationFormData)
      .then((response) => {
        console.log(response);
        if (!modelVariations.has(framework)) {
          modelVariations.set(framework, new Map());
        }
        if (!modelVariations.get(framework).has(slugName)) {
          modelVariations.get(framework).set(slugName, []);
        }
        modelVariations.get(framework).get(slugName).push({
          id: response.data.id,
          version: response.data.version,
          filesStyle: response.data.filesStyle
        });
        setModelVariations(modelVariations);
        setFiles([]);
        setSlugName("");
      })
      .catch((err) => {
        console.error(err);
      })
  }, [framework, slugName, files, modelInfo, user]);

  const handleCoverDrop = useCallback(async (filesUpload) => {
    console.log(filesUpload)
    setFiles(pre => [...pre, ...filesUpload]);
  }, []);

  if (!user || !modelInfo) return null;

  return (
    <>
      <Head>
        <title>
          Model: ModelVariation Create
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={1} mb={5}>
            <Typography variant="h3">
              Thêm biến thể mới
            </Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.dashboard.index}
                variant="subtitle2"
              >
                Dashboard
              </Link>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.dashboard.model.index}
                variant="subtitle2"
              >
                Mô hình
              </Link>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.dashboard.model.details.replace(':modelId', modelInfo.id)}
                variant="subtitle2"
              >
                {modelInfo.title}
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Tạo biến thể
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Stack width={700}>
            <FormControl variant="filled" >
              <InputLabel>Framework</InputLabel>
              <Select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                style={{ width: 700}}
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
              >
                <MenuItem value="selecting">
                  Chọn Framework
                </MenuItem>
                {Array.from(FRAMEWORKS).map(([value, label]) => 
                  <MenuItem value={value} key={value}>
                    {label} {modelVariations.has(value) && `(${modelVariations.get(value).size})`}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            {framework != "selecting" && <>
              <Typography variant='h6' my={4}>Các biến thể</Typography>
              {!modelVariations.has(framework)
                ? <Typography variant='body1' mb={5}>Chưa có biến thể</Typography>
                : <TableContainer component={Paper} sx={{mb: 5}}>
                  <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên</TableCell>
                        <TableCell>Phiên bản</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.from(modelVariations.get(framework)).map(([name, files]) => (
                        <TableRow key={name}>
                          <TableCell>{name}</TableCell>
                          <TableCell>{files[0].version}</TableCell>
                          <TableCell align='right'>
                            <Button variant="inherit" sx={{marginLeft: "auto", maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40, borderRadius: '100%'}}>
                              <DeleteOutlineIcon fontSize='small'/>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
              <FileDropzoneVn
                accept={{ 
                  'image/*': [],
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc', '.docx'],
                  'text/plain': ['.txt'],
                  'application/octet-stream': ['.pb', '.h5', '.ckpt', '.pt', '.pth', '.pkl', '.onnx', '.json', '.keras'],
                  'application/zip': ['.zip']
                }}
                maxFiles={10}
                onDrop={handleCoverDrop}
                caption="(Zip các file kích thước lớn để giảm kích thước, tối đa 10 tệp)"
              />
              <Typography variant='h6' my={4}>Tệp tải lên</Typography>
              {files.map((file, index) => 
                <Stack key={index} direction="row" alignItems="center" borderBottom="1px solid" borderTop="1px solid" borderColor="text.disabled" py={1}>
                  <InsertDriveFileOutlinedIcon />
                  <Typography variant='body2' ml={2}>{file.name} ({file.size} bytes)</Typography>
                  <Button variant="inherit" sx={{marginLeft: "auto", maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40, borderRadius: '100%'}} onClick={() => setFiles([...files.slice(0, index), ...files.slice(index+1, files.length)])}>
                    <CloseOutlinedIcon fontSize='small'/>
                  </Button>
                </Stack>
              )}
              {files.length > 0 && 
                <>
                  <TextField
                    sx={{marginTop: 3}}
                    fullWidth
                    label="Tên đường dẫn "
                    name="slugName"
                    required
                    value={slugName}
                    onChange={e => {
                      setSlugName(e.target.value);
                    }}
                  />
                  <Button 
                    style={{ marginLeft: 'auto'}} 
                    variant="contained"
                    sx={{ mt: 3}}
                    disabled={slugName === ""}
                    onClick={handleSubmitModelVariation}
                  >
                    Thêm biến thể
                  </Button>
                </>
              }
            </>}
          </Stack>
        </Container>
      </Box>
    </>
  );
  
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
