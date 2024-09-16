import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Autocomplete, { createFilterOptions }from '@mui/material/Autocomplete';
import {
  Box,
  Button,
  Chip,
  Card,
  CardContent,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { FileDropzoneVn } from '../../../components/file-dropzone-vn';
import { QuillEditor } from '../../../components/quill-editor';
import { paths } from '../../../paths';
import { topic_manageApi } from '../../../api/topic-manage';
import { lm_manageApi } from '../../../api/lm-manage';
import { useMounted } from '../../../hooks/use-mounted';
import axios from 'axios';


const typeOptions = [
  {
    label: 'VIDEO',
    value: 'VIDEO'
  },
  {
    label: 'PDF',
    value: 'PDF'
  },
  {
    label: 'QUIZ',
    value: 'QUIZ'
  },
  {
    label: 'WORD',
    value: 'WORD'
  },
  {
    label: 'CODE',
    value: 'CODE'
  },
  {
    label: 'PPT',
    value: 'PPT'
  }
];

const initialValues = {
  // id: '',
  type: '',
  // description: '',
  // images: [],
  name: '',
  time : 0,
  difficulty: 0,
  percentOfPass: 100,
  // newPrice: 0,
  // oldPrice: 0,
  score: 10,
  rating: 5,
  topicId: 0,
  fileId: 0,
  // submit: null
};

const validationSchema = Yup.object({
  // id: Yup.number().min(0),
  type: Yup.string().max(255),
  // description: Yup.string().max(5000),
  // images: Yup.array(),
  name: Yup.string().max(255).required(),
  time : Yup.number().min(0).required(),
  difficulty: Yup.number().min(0).max(10).required(),
  percentOfPass: Yup.number().min(0).max(100).required(),
  rating: Yup.number().min(0).max(5),
  score: Yup.number().min(0),
  topicId: Yup.number().required(),
  fileId: Yup.number(),
  // newPrice: Yup.number().min(0).required(),
  // oldPrice: Yup.number().min(0),
});

export const LMCreateForm = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const [topicIds, setTopicIds] = useState([])
  const [newTopicId, setNewTopicId] = useState('');
  const [files, setFiles] = useState([]);
  const filter = createFilterOptions();
  const [topicOptions, setTopicOptions] = useState([]);
  const [idLMList, setIdLMList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        values.type === "QUIZ" 
        ? await lm_manageApi.createLM({
          name: values.name,
          difficulty: values.difficulty,
          type: values.type,
          score: values.score,
          rating: values.rating,
          percentOfPass: values.percentOfPass,
          time: values.time,
          topicId: values.topicId,
          quiz: {
            duration: values.time,
            shuffle: true,
            fileId: idLMList[0],
          }
        })
        : await lm_manageApi.createLM({
          name: values.name,
          difficulty: values.difficulty,
          percentOfPass: values.percentOfPass,
          type: values.type,
          score: values.score,
          rating: values.rating,
          time: values.time,
          // topicIds: topicIds.map((topicIds) => topicIds.id)
          topicId: values.topicId,
          fileId: idLMList[0]
      })
        // await lm_manageApi.createLM(values);
        toast.success('Tài liệu học tập đã được tạo');
        router.push(paths.dashboard.lm_manage);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        // helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const getTopics = useCallback(async () => {
    try {
      const response = await topic_manageApi.getListTopic();

      if (isMounted()) {
        setTopicOptions([...response.data]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [])

  useEffect(() => {
    getTopics();
  },[]);

  const handleFilesDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
    setDisabled(false);
  }, []);

  const handleFileRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
    setDisabled(false);
  }, []);

  const handleFilesRemoveAll = useCallback(() => {
    setFiles([]);
    setDisabled(false);

  }, []);

  const handleFilesUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', files[0]);
    try {
        // NOTE: Make API request
        // console.log(formik.values);
        // console.log(files.map((_file) => _file.path))
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/files`,
            formData, {
            headers: {
                "Content-Type": "multipart/form-data",
              },
          });

        setIdLMList([response.data["id"]])
        setDisabled(true);
        toast.success('File đã đăng tải thành công');
        // router.push(`${paths.dashboard.explore}/course`);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        console.error('Error uploading file:', err);
      }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}>
      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={4}
              >
                <Typography variant="h6">
                  Thông tin cơ bản
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    label="Tên tài liệu học tập"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  <TextField
                    error={!!(formik.touched.type && formik.errors.type)}
                    fullWidth
                    label="Phân loại"
                    name="type"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.type}
                    select
                  >
                    {typeOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        selected
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    error={!!(formik.touched.time && formik.errors.time)}
                    fullWidth
                    label="Thời lượng (phút)"
                    name="time"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.time}
                  />
                  <TextField
                    error={!!(formik.touched.difficulty && formik.errors.difficulty)}
                    fullWidth
                    label="Độ khó (Trên thang 1-10)"
                    name="difficulty"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.difficulty}
                  />
                  <TextField
                    error={!!(formik.touched.percentOfPass && formik.errors.percentOfPass)}
                    fullWidth
                    label="Chuẩn đầu ra (%)"
                    name="percentOfPass"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.percentOfPass}
                  />
                  <TextField
                    error={!!(formik.touched.topicId && formik.errors.topicId)}
                    fullWidth
                    label="Chủ đề học liên quan"
                    name="topicId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.topicId}
                    select
                  >
                    {topicOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        selected
                      >
                        {option.title}
                      </MenuItem>
                    ))}
                  </TextField>
                  {/* <Autocomplete
                    value={newTopicId}
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        setNewTopicId({
                          title: newValue,
                        });
                      } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        setNewTopicId({
                          title: newValue.inputValue,
                        });
                      } else {
                        setNewTopicId(newValue);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (newTopicId !== '') {
                          setTopicIds([...topicIds,newTopicId]);
                        }
                        setNewTopicId('');
                        e.preventDefault();
                      }}
                    }
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some((option) => inputValue === option.title);
                      if (inputValue !== '' && !isExisting) {
                        filtered.push({
                          inputValue,
                          label: `Add "${inputValue}"`,
                        });
                      }

                      return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="topicIds"
                    options={topicOptions}
                    getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === 'string') {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option.title;
                    }}
                    renderOption={(props, option) => <li {...props}>{option.title}</li>}
                    fullWidth
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Chủ đề học liên quan" />
                    )}
                  /> 
                  <Box >
                    {topicIds.map((topicId,index) => 
                      <Chip 
                        key={index} 
                        label={topicId.title}  
                        onDelete={e => setTopicIds(topicIds.filter(l => l !== topicId))}
                        sx={{mr: 1, mb: 1}} 
                      />
                    )}
                  </Box> */}

                  {/* <div>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 2 }}
                      variant="subtitle2"
                    >
                      Mô tả
                    </Typography>
                    <QuillEditor
                      onChange={(value) => {
                        formik.setFieldValue('description', value);
                      }}
                      placeholder="Write something"
                      sx={{ height: 400 }}
                      value={formik.values.description}
                    />
                    {!!(formik.touched.description && formik.errors.description) && (
                      <Box sx={{ mt: 2 }}>
                        <FormHelperText error>
                          {formik.errors.description}
                        </FormHelperText>
                      </Box>
                    )}
                  </div> */}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h6">
                    Tài liệu học
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    Tài liệu học sẽ xuất hiện trên hệ thống.
                  </Typography>
                </Stack>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <FileDropzoneVn
                  accept={{ '*/*': [] }}
                  caption="(PDF, SVG, JPG, PNG, or gif maximum 900x400, ...)"
                  files={files}
                  disabled={disabled}
                  onDrop={handleFilesDrop}
                  onRemove={handleFileRemove}
                  onRemoveAll={handleFilesRemoveAll}
                  onUpload={handleFilesUpload}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* <Card>
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={4}
              >
                <Typography variant="h6">
                  Pricing
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.oldPrice && formik.errors.oldPrice)}
                    fullWidth
                    label="Old price"
                    name="oldPrice"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.oldPrice}
                  />
                  <TextField
                    error={!!(formik.touched.newPrice && formik.errors.newPrice)}
                    fullWidth
                    label="New Price"
                    name="newPrice"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.newPrice}
                  />
                  <div>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Keep selling when stock is empty"
                    />
                  </div>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={4}
              >
                <Typography variant="h6">
                  Category
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.category && formik.errors.category)}
                    fullWidth
                    label="Category"
                    name="category"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    value={formik.values.category}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card> */}
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="flex-end"
          spacing={1}
        >
          <Button color="inherit">
            Huỷ thay đổi
          </Button>
          <Button
            type="submit"
            variant="contained"
          >
            Tạo mới
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
