import Head from 'next/head';
import { useState, useCallback, useEffect, useMemo } from 'react';
import Shuffle01Icon from '@untitled-ui/icons-react/build/esm/Shuffle01';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  LinearProgress
} from '@mui/material';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { usePageView } from '../../../hooks/use-page-view';
import { useSettings } from '../../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { LearningPathDoneLOs } from '../../../sections/dashboard/learning-path/learning-path-done-LOs';
import { LearningPathProcessLOs } from '../../../sections/dashboard/learning-path/learning-path-process-LOs';
import { LearningPathLockedLOs } from '../../../sections/dashboard/learning-path/learning-path-locked-LOs';
import { useMounted } from '../../../hooks/use-mounted';
import { learningPathApi } from '../../../api/learning-path';
import { useRouter } from 'next/router';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';

import * as consts from '../../../constants';
import { ChooseGoalLearningPathDialog } from '../../../sections/dashboard/learning-path/choose-goal-learning-path-dialog';
import { BaseInfoLearningPathDialog } from '../../../sections/dashboard/learning-path/base-info-learning-path-dialog';
import { LearningPathGraph } from '../../../sections/dashboard/learning-path/learning-path-graph';

import TopicGraph from './new-course-graph'

const useLOs = (update) => {
  const isMounted = useMounted();
  const [LOs, setLOs] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  const getLearningPath = useCallback(async () => {
    try {
      // const response = await learningPathApi.getLearningPath(user.id);
      const response = await learningPathApi.getLearningGraph(user.id)
      if (isMounted()) {
        if (response.data.length == 0) {
          router.push(paths.dashboard.learningPaths.create);
        } else {
          setLOs(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getLearningPath();
  },[update]);

  return LOs;
};

const Page = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const LOs = useLOs(update);
  const settings = useSettings();
  const [openSelectGoalDialog, setOpenSelectGoalDialog] = useState(false);
  const [openBaseInfoDialog, setOpenBaseInfoDialog] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [baseInfoAnswer, setBaseInfoAnswer] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const onProcessingLOPage = LOs ? Math.floor((LOs.map(LO => LO.score == 0).indexOf(true) - 1) / consts.LOS_PER_PAGE) : 0;
    setPage(onProcessingLOPage >= 0 ? onProcessingLOPage : 0);
  },[LOs]);

  const handleCreateLearningPath = useCallback( async (chosenLearningPath) => {
    await learningPathApi.createLearningPath(user.id, {
      "LOs": chosenLearningPath
    })
      .then(async () => {
        // router.push(paths.dashboard.learningPaths.index);
        setUpdate(!update)
      })
      .catch(error => {
        setLoading(false);
        console.error('Error posting data:', error);
      })
  })

  const handleConfirmButton = useCallback(async () => {
    setOpenBaseInfoDialog(false);
    setLoading(true);

    await learningPathApi.getRecommendedLearningPaths(user.id, {
      "goal": selectedGoals[0],
      "learningStyleQA": [...baseInfoAnswer.slice(2)],
      "backgroundKnowledge": baseInfoAnswer.length == 0 ? null : baseInfoAnswer[1],
      "qualification": baseInfoAnswer.length == 0 ? null : baseInfoAnswer[0]
    })
      .then((response) => {
        console.log(response);

        handleCreateLearningPath(response.data[0]);
        setLoading(false);
        setRecommendedLearningPaths(response.data);
      })
      .catch(error => {
        setLoading(false);
        console.error('Error posting data:', error);
      })
  }, [selectedGoals, baseInfoAnswer])

  usePageView();

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
          py: 8,
          overflow: 'auto',
          maxWidth: '100%'
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            disableEqualOverflow
            spacing={{
              xs: 3,
              lg: 4
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">
                    Lộ trình học của bạn
                  </Typography>
                </div>
                <div>
                  <Stack
                    direction="row"
                    spacing={4}
                    // sx={{ overflowX: 'auto' }}
                  >
                    <Button
                      startIcon={(
                        <SvgIcon>
                          <Shuffle01Icon />
                        </SvgIcon>
                      )}
                      variant="contained"
                      onClick={() => setOpenSelectGoalDialog(true)}
                    >
                      Thay đổi lộ trình
                    </Button>
                  </Stack>
                </div>
              </Stack>
            </Grid>
            {/* {LOs
            .slice(page*consts.LOS_PER_PAGE, page*consts.LOS_PER_PAGE + consts.LOS_PER_PAGE)
            .map((LO, index) => {
              const LearningPathLOs = LO.score >= LO.percentOfPass ? LearningPathDoneLOs : (page*consts.LOS_PER_PAGE + index == 0 || LOs[page*consts.LOS_PER_PAGE + index - 1].score >= LO.percentOfPass) ? LearningPathProcessLOs : LearningPathLockedLOs;
              return (
                <Grid
                  xs={12}
                  md={4}
                  key={LO.id}
                >
                  <LearningPathLOs id={LO.id} topic={LO.Topic.title} learningObject={LO.name} finished={LO.score} />
                </Grid>
              )
            })} */}
            {/* <Box sx={{ overflowX: 'auto', maxWidth: '100%' }}> */}
            <Grid xs={12}>
              <TopicGraph LOs={LOs} page={page} />
            </Grid>
            {/* </Box> */}
            {/* <Grid xs={12}>
              <Box mt={4}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  disabled={page == 0}
                  onClick={() => {
                    setPage(page - 1);
                    window.scrollTo(0, 0);
                  }}
                  startIcon={(
                    <SvgIcon>
                      <ArrowLeftIcon />
                    </SvgIcon>
                  )}
                >
                </Button>
                <Typography variant="body1">
                  {page + 1} / {Math.ceil(LOs.length / consts.LOS_PER_PAGE)}
                </Typography>
                <Button
                  disabled={page == Math.floor(LOs.length / consts.LOS_PER_PAGE)}
                  onClick={() => {
                    setPage(page + 1);
                    window.scrollTo(0, 0);
                  }}
                  endIcon={(
                    <SvgIcon>
                      <ArrowRightIcon />
                    </SvgIcon>
                  )}
                >
                </Button>
              </Box>
            </Grid> */}
          </Grid>
        </Container>
      </Box>
      {openSelectGoalDialog && <ChooseGoalLearningPathDialog 
        onClose={() => {
          setSelectedGoals([]);
          setOpenSelectGoalDialog(false);
        }}
        onContinue={() => {
          setOpenSelectGoalDialog(false);
          setOpenBaseInfoDialog(true);
        }}
        open={openSelectGoalDialog}
        setSelectedGoals={setSelectedGoals}
        selectedGoals={selectedGoals}
      />}
      {openBaseInfoDialog && <BaseInfoLearningPathDialog 
        onClose={() => {
          setSelectedGoals([]);
          setBaseInfoAnswer([]);
          setOpenBaseInfoDialog(false);
        }}
        onContinue={() => {
          handleConfirmButton();
        }}
        onBack={() => {
          setOpenSelectGoalDialog(true);
          setOpenBaseInfoDialog(false);
          setBaseInfoAnswer([]);
        }}
        open={openBaseInfoDialog}
        setBaseInfoAnswer={setBaseInfoAnswer}
        baseInfoAnswer={baseInfoAnswer}
      />}
    </>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
