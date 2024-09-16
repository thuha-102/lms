import Head from 'next/head';
import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  LinearProgress
} from '@mui/material';
import { usePageView } from '../../../hooks/use-page-view';
import { useSettings } from '../../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { ChooseGoalLearningPathDialog } from '../../../sections/dashboard/learning-path/choose-goal-learning-path-dialog';
import { BaseInfoLearningPathDialog } from '../../../sections/dashboard/learning-path/base-info-learning-path-dialog';
import { learningPathApi } from '../../../api/learning-path';
import { paths } from '../../../paths';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/use-auth';

const Page = () => {
  const settings = useSettings();
  const router = useRouter();
  const { user } = useAuth();

  const [openSelectGoalDialog, setOpenSelectGoalDialog] = useState(false);
  const [openBaseInfoDialog, setOpenBaseInfoDialog] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [baseInfoAnswer, setBaseInfoAnswer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendedLearningPaths, setRecommendedLearningPaths] = useState([]);

  const handleCreateLearningPath = useCallback( async (chosenLearningPath) => {
    await learningPathApi.createLearningPath(user.id, {
      "LOs": chosenLearningPath
    })
      .then(() => {
        router.push(paths.dashboard.learningPaths.index);
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
        // console.log(response);
        // if (response.data.length == 1) {
        //   handleCreateLearningPath(response.data[0]);
        // }
        setLoading(false);
        setRecommendedLearningPaths(response.data);
        router.push(paths.dashboard.learningPaths.index);
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
          py: 8
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
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">
                    Lộ trình học của bạn
                  </Typography>
                </div>
                {!loading && recommendedLearningPaths.length == 0 &&
                <Stack justifyContent="space-between" spacing={2}>
                  <div>
                    <Typography variant="body1">
                      Bạn hiện chưa có lộ trình học
                    </Typography>
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      onClick={() => setOpenSelectGoalDialog(true)}
                    >
                      Tạo ngay!
                    </Button>
                  </div>
                </Stack>}
                {loading && 
                <Stack justifyContent="space-between" spacing={2}>
                  <div>
                    <Typography variant="body1">
                      Lộ trình học cá nhân của bạn đang được khởi tạo, vui lòng chờ...
                    </Typography>
                  </div>
                  <LinearProgress />
                </Stack>}
                {/* {recommendedLearningPaths.length != 0 &&
                <Stack justifyContent="space-between" spacing={2}>
                  <div>
                    <Typography variant="body1">
                      Chúng tôi đề xuất lộ trình học cho bạn như sau
                    </Typography>
                  </div>
                  {recommendedLearningPaths.map((p, idx) =>
                  <div key={idx}> 
                    <Button
                      variant="outlined"
                      sx = {{
                        borderColor: "lightgrey",
                        color: "text.primary",
                      }}
                      onClick={() => handleCreateLearningPath(p)}
                    >
                      Lộ trình {idx}
                    </Button>  
                  </div>)}
                </Stack>} */}
              </Stack>
            </Grid>
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
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
