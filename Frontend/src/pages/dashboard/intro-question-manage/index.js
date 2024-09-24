import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
  Input,
  TextField,
  Select,
  MenuItem
} from '@mui/material';
import { introQuestionApi } from '../../../api/introQuestion';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';

const Page = () => {
  const [ searchStr, setSearchStr ] = useState('');
  const [ questions, setQuestions ] = useState([]);
  const [ editQuestions, setEditQuestions ] = useState({});

  useEffect(() => {
    const handler = setTimeout(async () => {
        try {
            const response = await introQuestionApi.getIntroQuestions(searchStr != '' ? {searchString: searchStr} : {});
            setQuestions(response.data);
        } catch (err) {
          console.error(err);
        }
    }, 500); // Wait for 500ms after the user stops typing

    return () => {
      clearTimeout(handler); // Cleanup timeout if the query changes before 500ms
    };
  }, [searchStr]);

  const handleDeleteQues = useCallback(async (id) => {
    try {
      const response = await introQuestionApi.deleteIntroQuestion(id);
      setQuestions(questions.filter(q => q.id !== response.data.id));
    } catch (err) {
      console.error(err);
    }
  }, [questions])

  const handleEditQues = useCallback(async (i) => {
    try {
      const {id, ...rest} = editQuestions[i];
      const response = id ? await introQuestionApi.putIntroQuestion(id, rest) : await introQuestionApi.postIntroQuestion({order: i + 1, ...rest});
      const newQuestions = questions;
      newQuestions[i] = response.data;
      const { [i]: _, ...newEditQuestions } = editQuestions; 
      setQuestions(newQuestions);
      setEditQuestions(newEditQuestions);
    } catch (err) {
      console.error(err);
    }
  }, [editQuestions])

  const handleAddQues = useCallback(async (i) => {
    const newQues = {
      "question": "",
      "answers": [],
      "scores": [],
    }
    const newEditQuestions = {};
    Object.keys(editQuestions).forEach(key => {
      (Number(key) > i) ? newEditQuestions[Number(key) + 1] = editQuestions[key] : newEditQuestions[key] = editQuestions[key];
    });
    newEditQuestions[i + 1] = newQues;
    setEditQuestions(newEditQuestions);
    setQuestions([...questions.slice(0, i + 1), newQues, ...questions.slice(i + 1)]);
  }, [editQuestions, questions]);

  const handleCancelEditQues = useCallback(async (i) => {
    if (editQuestions[i].id) {
      const { [i]: _, ...newEditQuestions } = editQuestions; 
      setEditQuestions(newEditQuestions);
    } else {
      const newEditQuestions = {};
      Object.keys(editQuestions).forEach(key => {
        (Number(key) == i) ? null : (Number(key) > i) ? newEditQuestions[Number(key) - 1] = editQuestions[key] : newEditQuestions[key] = editQuestions[key];
      });
      setEditQuestions(newEditQuestions);
      setQuestions([...questions.slice(0, i), ...questions.slice(i + 1)]);
    }
  }, [editQuestions, questions]);

  const handleChangeOrderQues = useCallback(async (i, newOrder) => {
    if (i + 1 == newOrder) {
      return;
    }
    const response = await introQuestionApi.putIntroQuestion(questions[i].id, { order: newOrder });
    const newQuestions = [...questions.slice(0, i), ...questions.slice(i + 1)];
    newQuestions.splice(newOrder - 1, 0, response.data);
    setQuestions(newQuestions);
  }, [questions]);
  
  usePageView();

  return (
    <>
      <Head>
        <title>
          Quản lý câu hỏi phân loại
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
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">
                Quản lý câu hỏi phân loại
              </Typography>
              <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.dashboard.index}
                  variant="subtitle2"
                >
                  Trang chủ
                </Link>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.dashboard.lm_manage}
                  variant="subtitle2"
                >
                  Quản lý câu hỏi phân loại
                </Link>
              </Breadcrumbs>
            </Stack>
            <Card
              elevation={16}
              sx={{
                alignItems: 'center',
                borderRadius: 1,
                display: 'flex',
                px: 3,
                py: 2, 
                mb: 2,
                mt: 6,
              }}
            >
              <SvgIcon fontSize="medium" >
                <SearchMdIcon />
              </SvgIcon>
              <Input 
                placeholder="Tìm kiếm câu hỏi..." 
                disableUnderline fullWidth sx={{marginLeft: 2}} 
                value={searchStr}
                onChange={e => setSearchStr(e.target.value)}
                onFocus={() => setEditQuestions({})}
              />
            </Card>
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-around"
            >
              <Button
                sx={{ maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40, borderRadius: "100%", fontSize: 25}}
                onClick={() => handleAddQues(-1)}
              >
                +
              </Button>
            </Stack>
            <Stack spacing={2}>
              {questions.map((q,i) => 
                <div key={i}>
                  <Card 
                    variant="outlined"
                    sx={{ 
                      alignItems: 'center',
                      borderRadius: 1,
                      display: 'flex',
                      px: 3,
                      py: 2,
                    }}
                  > 
                    {editQuestions[i] 
                    ? <Stack width="100%">
                      <Stack flexDirection="row" alignItems="center" width="100%">
                        <Typography color="text.primary" variant="h6" width={70} spacing={1}>Câu {i + 1}:</Typography>
                        <TextField 
                          placeholder="Nhập câu hỏi..." 
                          fullWidth
                          inputProps={{ style: { fontSize: '17px', height: "auto" } }}
                          value={editQuestions[i].question}
                          onChange={e => {
                            const newInfo = editQuestions[i]; 
                            newInfo.question = e.target.value;
                            setEditQuestions({...editQuestions, [i]: newInfo});
                          }}
                          multiline
                        />
                      </Stack>
                      <Stack spacing={1} width="100%" mt={2}>
                        {editQuestions[i].answers.map((a,ai) => 
                          <Stack flexDirection="row" alignItems="center" width="100%" key={ai}>
                            <Typography color="text.primary" variant="body2" sx={{ fontSize: 14 }} width="2%">{String.fromCharCode
                            ('a'.charCodeAt() + ai)}.</Typography>
                            <Stack width="85%">
                              <TextField 
                                placeholder="Nhập câu trả lời..." 
                                value={a}
                                onChange={e => {
                                  const newInfo = editQuestions[i]; 
                                  newInfo.answers[ai] = e.target.value;
                                  setEditQuestions({...editQuestions, [i]: newInfo});
                                }}
                                fullWidth
                                multiline
                                inputProps={{ style: { fontSize: '14px', height: "auto"} }}
                              />
                            </Stack> 
                            <Stack width="7%" ml={2}>
                              <TextField 
                                inputProps={{ style: { fontSize: '14px'} }}
                                value={editQuestions[i].scores[ai]}
                                onChange={e => {
                                  const newInfo = editQuestions[i]; 
                                  newInfo.scores[ai] = Number(e.target.value);
                                  setEditQuestions({...editQuestions, [i]: newInfo});
                                }}
                                fullWidth
                                hiddenLabel
                                type='number'
                              />
                            </Stack>
                            <Button style={{ borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40, marginLeft: "auto", fontSize: 25}} variant="text" onClick={() => {
                              const newInfo = editQuestions[i]; 
                              newInfo.answers = [...newInfo.answers.slice(0, ai), ...newInfo.answers.slice(ai+1)]
                              newInfo.scores = [...newInfo.scores.slice(0, ai), ...newInfo.scores.slice(ai+1)]
                              setEditQuestions({...editQuestions, [i]: newInfo});
                            }}>
                              -
                            </Button>
                          </Stack>
                        )}
                        <Stack flexDirection="row" pt={1}>
                          <Button variant="outlined" onClick={() => {
                            const newInfo = editQuestions[i]; 
                            newInfo.answers = [...newInfo.answers, ""]
                            newInfo.scores = [...newInfo.scores, 0]
                            setEditQuestions({...editQuestions, [i]: newInfo});
                          }}>
                            + Thêm câu trả lời
                          </Button>
                        </Stack>
                        <Stack flexDirection="row" pt={1} justifyContent="flex-end">
                          <Button variant="contained" onClick={() => handleEditQues(i)}>
                            Lưu
                          </Button>
                          <Button variant="contained" sx={{ marginLeft: 1}} onClick={() => handleCancelEditQues(i)}>
                            Hủy
                          </Button>
                        </Stack>
                      </Stack>
                    </Stack>
                    : <Stack width="100%">
                    <Stack flexDirection="row" width="100%" alignItems="center" justifyContent="space-between">
                      <Typography color="text.primary" variant="h6" mb={2} sx={{ width: "90%"}}>Câu {i + 1}: {q.question}</Typography>
                      <Stack flexDirection="row" alignItems="center">
                        <Select
                          value={i + 1}
                          onChange={(e) => handleChangeOrderQues(i, Number(e.target.value))}
                          autoWidth
                          label="Thứ tự"
                          sx={{ marginRight: 2 }}
                        >
                          {questions.map((_, ind) => <MenuItem key={ind} value={ind + 1}>{ind+1}</MenuItem>)}
                        </Select>
                        <Button style={{ borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40, marginRight: 10 }} variant='outlined' onClick={() => {setEditQuestions({...editQuestions, [i]: q})}}>
                          <CreateOutlinedIcon fontSize='small'/>
                        </Button>
                        <Button style={{ borderRadius: '100%', maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40 }} variant='outlined' onClick={() => handleDeleteQues(q.id)}>
                          <DeleteOutlineOutlinedIcon fontSize='small'/>
                        </Button>
                      </Stack>
                    </Stack>
                    <Stack spacing={1} width="100%" mt={2}>
                      {q.answers.map((a,ai) => 
                        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" key={ai}>
                          <Typography color="text.primary" variant="body2" sx={{ fontSize: 14, width: "90%"}}>{String.fromCharCode('a'.charCodeAt() + ai)}. {a}</Typography>
                          <Typography color="text.primary" variant="body2" sx={{ fontSize: 14 }}>({q.scores[ai]})</Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>}
                  </Card>
                  <Stack
                    mt={2}
                    alignItems="center"
                    direction="row"
                    justifyContent="space-around"
                  >
                    <Button
                      sx={{ maxWidth: 40, minWidth: 40, minHeight: 40, maxHeight: 40, borderRadius: "100%", fontSize: 25}}
                      onClick={() => handleAddQues(i)}
                    >
                      +
                    </Button>
                  </Stack>
                </div>
              )}  
            </Stack>
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
