// import { Layout as DashboardLayout } from '../../../layouts/dashboard';
// export const Page = () => {
//     return (
//         <h1>LEARNING PATH LIST</h1>
//     )
// }

// Page.getLayout = (page) => (
//     <DashboardLayout>
//         {page}
//     </DashboardLayout>
// );

// export default Page;


//-----------------------
import Head from 'next/head';
import PropTypes from 'prop-types';
import { useState } from 'react'; // Import useState hook
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
import { usePageView } from '../../../hooks/use-page-view';
import { useSettings } from '../../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { OverviewBanner } from '../../../sections/dashboard/overview/overview-banner';
import { OverviewDoneTasks } from '../../../sections/dashboard/overview/overview-done-tasks';
import { OverviewEvents } from '../../../sections/dashboard/overview/overview-events';
import { OverviewInbox } from '../../../sections/dashboard/overview/overview-inbox';
import { OverviewTransactions } from '../../../sections/dashboard/overview/overview-transactions';
import { OverviewPendingIssues } from '../../../sections/dashboard/overview/overview-pending-issues';
import { OverviewSubscriptionUsage } from '../../../sections/dashboard/overview/overview-subscription-usage';
import { OverviewHelp } from '../../../sections/dashboard/overview/overview-help';
import { OverviewJobs } from '../../../sections/dashboard/overview/overview-jobs';
import { OverviewOpenTickets } from '../../../sections/dashboard/overview/overview-open-tickets';
import { OverviewTips } from '../../../sections/dashboard/overview/overview-tips';
import { LearningObject } from '../../../sections/dashboard/overview/learning-object';

const now = new Date();

export const Learning_Path_List = (props) => {
    const {page} = props;
//   const settings = useSettings();
//   const [page, setPage] = useState(1); // State to manage current page
//   const tasksPerPage = 10; // Number of tasks per page

  usePageView();

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  usePageView();

  return (
    <>
            <Grid
            xs={12}
            md={4}
            >
            {/* Render OverviewDoneTasks component with pagination */}
              <OverviewDoneTasks amount={page*9}/>
            </Grid>
            <Grid
            xs={12}
            md={4}
            >
            {/* Render OverviewDoneTasks component with pagination */}
              <OverviewDoneTasks amount={page*9+1}/>
            </Grid>
            <Grid
            xs={12}
            md={4}
            >
            {/* Render OverviewDoneTasks component with pagination */}
              <OverviewDoneTasks amount={page*9+2}/>
            </Grid>
            <Grid
            xs={12}
            md={4}
            >
            {/* Render OverviewDoneTasks component with pagination */}
              <OverviewDoneTasks amount={page*9+3}/>
            </Grid>
            <Grid
            xs={12}
            md={4}
            >
            {/* Render OverviewDoneTasks component with pagination */}
              <OverviewDoneTasks amount={page*9+4}/>
            </Grid>
            <Grid
            xs={12}
            md={4}
            >
            {/* Render OverviewDoneTasks component with pagination */}
              <OverviewDoneTasks amount={page*9+5}/>
            </Grid>
            <Grid
            xs={12}
            md={4}
            >
            {/* Render OverviewDoneTasks component with pagination */}
              <OverviewDoneTasks amount={page*9+6}/>
            </Grid>
            <Grid
            xs={12}
            md={4}
            >
            {/* Render OverviewDoneTasks component with pagination */}
              <OverviewDoneTasks amount={page*9+7}/>
            </Grid>
            <Grid
            xs={12}
            md={4}
            >
            {/* Render OverviewDoneTasks component with pagination */}
              <OverviewDoneTasks amount={page*9+8}/>
            </Grid>
            {/* Pagination controls */}
            {/* <Box mt={4}>
              <Button
                disabled={page === 0}
                onClick={handlePrevPage}
              >
                Previous Page
              </Button>
              <Button
                disabled={page * tasksPerPage >= 100}
                onClick={handleNextPage}
              >
                Next Page
              </Button>
            </Box> */}
    </>
  );
};

Learning_Path_List.propTypes = {
    page: PropTypes.number.isRequired,
  };
