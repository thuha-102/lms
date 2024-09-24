import Head from 'next/head';
import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Breadcrumbs,
  Link
} from '@mui/material';
import { usePageView } from '../../../hooks/use-page-view';
import { useSettings } from '../../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { introQuestionApi } from '../../../api/introQuestion';
import { paths } from '../../../paths';
import { useMounted } from '../../../hooks/use-mounted';
import { useAuth } from '../../../hooks/use-auth';
import { NextLink } from 'next/link';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { QuizSteps } from '../../../sections/dashboard/intro-questions/quiz_steps';

const useIntroQuestions = () => {
  const isMounted = useMounted();
  const [questions, setQuestions] = useState(null);

  const getQuestions = useCallback(async () => {
    try {
      const response = await introQuestionApi.getIntroQuestions();

      if (isMounted()) {
        setQuestions(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getQuestions();
  },[]);

  return questions;
};

const Page = () => {
  const settings = useSettings();
  const { user } = useAuth();
  const questions = useIntroQuestions();

  usePageView();
  
  if (!user || !questions) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Lộ trình học
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Stack spacing={1} mb={5}>
            <Typography variant="h3">
              Lộ trình học của bạn
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
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Lộ trình học của bạn
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Typography variant='h5' mb={5}>Bạn chưa có lộ trình học. Trả lời những câu hỏi sau đây để tiến hành tạo lộ trình học</Typography>
          {questions.length > 0 && <QuizSteps 
            questions={questions}
          />}
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
