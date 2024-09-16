import Head from 'next/head';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Card,
  CardHeader,
  CardContent
} from '@mui/material';
import { usePageView } from '../../hooks/use-page-view';
import { useSettings } from '../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { AnalyticsStats } from '../../sections/dashboard/analytics/analytics-stats';
import { AnalyticsMostVisited } from '../../sections/dashboard/analytics/analytics-most-visited';
import { AnalyticsSocialSources } from '../../sections/dashboard/analytics/analytics-social-sources';
import { AnalyticsTrafficSources } from '../../sections/dashboard/analytics/analytics-traffic-sources';
import { AnalyticsVisitsByCountry } from '../../sections/dashboard/analytics/analytics-visits-by-country';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { useCallback, useEffect, useState } from 'react';
import { useMounted } from '../../hooks/use-mounted';
import { analyticsApi } from '../../api/analytics';



export const DashboardAdmin = () => {
    const settings = useSettings()
    const isMounted = useMounted();
    const [historyWeekUser, setHistoryWeekUser] = useState(null)
    const [historyMonthUser, setHistoryMonthUser] = useState(null)
    const [historyWeekLog, setHistoryWeekLog] = useState(null)
    const [historyMonthLog, setHistoryMonthLog] = useState(null)
    const [historyForum, setHistoryForum] = useState(null)

    const getApi = useCallback(async () => {
        try {
            const weekUser = await analyticsApi.getHistoryUser("week")
            const monthUser = await analyticsApi.getHistoryUser("month")
            const weekLog = await analyticsApi.getHistoryLog("week")
            const monthLog = await analyticsApi.getHistoryLog("month")
            const reponse = await analyticsApi.getHistoryForum()
            
            const forum = reponse.data.thisMonthLearnerForum.map(item => ({ x: item.forum_id, y: Number(item.total_access_time) }))

            if (isMounted()) {
                setHistoryWeekUser(String(weekUser.data.todayLogin));
                setHistoryMonthUser(String(monthUser.data.todayLogin));
                setHistoryWeekLog(String(weekLog.data.todayLearnerLog));
                setHistoryMonthLog(String(monthLog.data.todayLearnerLog));
                setHistoryForum(forum);
            }
        } catch (err) {
            console.error(err);
        }
    }, [])

    useEffect(() => {
        getApi()
    }, [])

    return (
        <>
            <Box
                component="main"
            >
                <Container maxWidth={settings.stretch ? false : 'xl'}>
                <Grid
                    container
                    spacing={{
                        xs: 3,
                        lg: 4
                    }}
                >
                    <Grid
                        xs={12}
                        md={3}
                    >
                        <AnalyticsStats title="Tổng lượt truy cập trong tuần" value = {historyWeekUser}/>
                    </Grid>
                    <Grid
                        xs={12}
                        md={3}
                    >
                        <AnalyticsStats title="Tổng lượt truy cập trong tháng" value = {historyMonthUser}/>
                    </Grid>
                    <Grid
                        xs={12}
                        md={3}
                    >
                        <AnalyticsStats title="Tổng ghi nhận lịch sử học trong tuần" value = {historyWeekLog}/>
                    </Grid>
                    <Grid
                        xs={12}
                        md={3}
                    >
                        <AnalyticsStats title="Tổng ghi nhận lịch sử học trong tháng" value = {historyMonthLog}/>
                    </Grid>
                    
                    <Grid
                        xs={12}
                        lg={12}
                        >
                        <AnalyticsTrafficSources
                            data={historyForum ? historyForum : []}
                            type={"forum"}
                        />
                    </Grid>
                </Grid>
                </Container>
            </Box>
        </>
    )
}