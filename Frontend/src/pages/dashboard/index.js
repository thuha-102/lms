import Head from 'next/head';
import { addDays, subDays, subHours, subMinutes } from 'date-fns';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { usePageView } from '../../hooks/use-page-view';
import { useSettings } from '../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { OverviewBanner } from '../../sections/dashboard/overview/overview-banner';
import { OverviewDoneTasks } from '../../sections/dashboard/overview/overview-done-tasks';
import { OverviewEvents } from '../../sections/dashboard/overview/overview-events';
import { OverviewInbox } from '../../sections/dashboard/overview/overview-inbox';
import { OverviewTransactions } from '../../sections/dashboard/overview/overview-transactions';
import { OverviewPendingIssues } from '../../sections/dashboard/overview/overview-pending-issues';
import { OverviewSubscriptionUsage } from '../../sections/dashboard/overview/overview-subscription-usage';
import { OverviewHelp } from '../../sections/dashboard/overview/overview-help';
import { OverviewJobs } from '../../sections/dashboard/overview/overview-jobs';
import { OverviewOpenTickets } from '../../sections/dashboard/overview/overview-open-tickets';
import { OverviewTips } from '../../sections/dashboard/overview/overview-tips';
import { useAuth } from '../../hooks/use-auth';
import { DashboardAdmin } from '../../sections/dashboard/dashboard-admin';
import { DashboardLearner } from '../../sections/dashboard/dashboard-learner';
import { DashboardInstructor } from '../../sections/dashboard/dashboard-instructor';

const now = new Date();

const Page = () => {
  const settings = useSettings();
  const { user } = useAuth()

  usePageView();

  return (
    <>
      <Head>
        <title>
          Tổng quan
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
                {
                  user?.accountType !== 'LEARNER' && <div>
                    <Typography variant="h4">
                      Tổng quan
                    </Typography>
                  </div>
                }
                <Box>
                  {
                    user?.accountType === 'INSTRUCTOR' && <DashboardInstructor/>
                  }  
                  {
                    user?.accountType === 'ADMIN' && <DashboardAdmin/>
                  }
                  {
                    user?.accountType === 'LEARNER' && <DashboardLearner/>
                  }
                </Box>
              </Stack>
            </Grid>
          </Grid>
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
