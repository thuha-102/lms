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
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { usePageView } from '../../hooks/use-page-view';
import { useSettings } from '../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { AnalyticsStats } from '../../sections/dashboard/analytics/analytics-stats';
import { AnalyticsMostVisited } from '../../sections/dashboard/analytics/analytics-most-visited';
import { AnalyticsSocialSources } from '../../sections/dashboard/analytics/analytics-social-sources';
import { AnalyticsTrafficSources } from '../../sections/dashboard/analytics/analytics-traffic-sources';
import { AnalyticsTrafficKeyword } from '../../sections/dashboard/analytics/analytics-traffic-keyword';
import { AnalyticsTrafficComment } from '../../sections/dashboard/analytics/analytics-traffic-comment';
import { AnalyticsChatbotAccess } from '../../sections/dashboard/analytics/analytics-chatbot-access';
import { AnalyticsGroupRate } from './analytics/analytics-group-rate.js';
import { AnalyticsScoreAndProcess } from './analytics/analytics-score-and-process.js';
import { AnalyticsVisitsByCountry } from '../../sections/dashboard/analytics/analytics-visits-by-country';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { CourseSearch } from '../../sections/dashboard/academy/course-search.js';
import { useCallback, useEffect, useState } from 'react';
import { useMounted } from '../../hooks/use-mounted';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../hooks/use-auth';
import { analyticsApi, desktopOS, valueFormatter, dataset, valueFormatterBarChart } from '../../api/analytics';
import { margin } from '@mui/system';
import { AnalyticsSatisfaction } from '../../sections/dashboard/analytics/analytics-satisfaction';

const datasett = [
  { min: 12, max: 20, precip: 79, typeLearner: 'Nhóm 1' },
  { min: 13, max: 20, precip: 66, typeLearner: 'Nhóm 2' },
  { min: 14, max: 20, precip: 76, typeLearner: 'Nhóm 3' },
  { min: 15, max: 20, precip: 106, typeLearner: 'Nhóm 4' },
  { min: 16, max: 20, precip: 105, typeLearner: 'Nhóm 5' },
];
const historyForum = ["A", "B", "C"];

const useLearner = (id, accountType, filter) => {
    const isMounted = useMounted();
    const [listCourses, setListCourses] = useState([{
            id: 0,
            name: "",
            amountOfTime: 0,
            description: "",
            visibility: true
      }]);
  
    const getListCourses = useCallback(async (filter) => {
      try {
        const response = accountType === "LEARNER" ? await userApi.getUserCourses(id, filter?.keyword) : await userApi.getOwnCourses(id, filter?.keyword, filter?.visibility);
  
          let courses = response.data
          
          // if (filter) {
          //   courses = courses.filter(c => c.name.toLowerCase().includes(filter.name.toLowerCase()))          
          //   if (filter.level !== "NONE") courses = courses.filter(c => c.level.includes(filter.level))
          //   courses = courses.filter(c => c.visibility === filter.visibility)
          // }
          
          if (isMounted()) {
            setListCourses(courses);
          }
      } catch (err) {
        console.error(err);
      }
    }, [isMounted]);
  
    useEffect(() => {
      getListCourses(filter);
    }, [id, filter]);
  
    return listCourses; 
  };

export const DashboardAdmin = () => {
    const theme = useTheme();
    const settings = useSettings()
    const isMounted = useMounted();
    const {user} = useAuth()
    const [historyWeekUser, setHistoryWeekUser] = useState(null)
    const [historyMonthUser, setHistoryMonthUser] = useState(null)
    const [historyWeekLog, setHistoryWeekLog] = useState(null)
    const [historyMonthLog, setHistoryMonthLog] = useState(null)
    // const [historyForum, setHistoryForum] = useState(null)
    const [historyForum, setHistoryForum] = useState(["A", "B", "C"])
    const [filter, setFilter] = useState(null);
    const learner = useLearner(user?.id, user?.accountType, filter);
    const handleFilter = useCallback((filterBy) => setFilter(filterBy), [])

    const series = [
        { type: 'line', dataKey: 'min', color: theme.palette.secondary.main, label: 'Điểm trung bình', valueFormatter:valueFormatterBarChart },
        { type: 'line', dataKey: 'max', color: '#fe5f55', label: 'max temperature', valueFormatter:valueFormatterBarChart},
        { type: 'bar', dataKey: 'precip', color: theme.palette.primary.main, yAxisId: 'rightAxis', label: 'Tiến độ', valueFormatter:valueFormatterBarChart},
      ];

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

    const getLast7Days = () => {
        const days = [];
        const today = new Date();
      
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          days.push(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
        }
      
        return days.reverse(); // Đảo ngược mảng để có thứ tự từ ngày cũ nhất đến mới nhất
      };
      
    const xAxisData = getLast7Days();

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
                    {/* <Grid
                        xs={12}
                        lg={12}
                    >
                        <CourseSearch isInstructor={user.accountType!=="LEARNER"} onFilter={handleFilter} />
                    </Grid> */}
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
                        md={6}
                    >
                        <AnalyticsGroupRate
                            data={desktopOS}
                            valueFormatter={valueFormatter}
                            title={"Tỷ lệ học viên ở mỗi nhóm"}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={6}
                    >
                        <AnalyticsScoreAndProcess 
                            series={series}
                            dataset={datasett}
                            title={"Điểm trung bình và tiến độ của học viên ở mỗi nhóm"}
                        />
                    </Grid>
                    {/* <Grid
                        xs={12}
                        lg={12}
                        >
                        <AnalyticsTrafficSources
                            data={historyForum ? historyForum : []}
                            type={"forum"}
                        />
                    </Grid> */}
                <Grid
                    container
                    spacing={{
                        xs: 3,
                        lg: 4
                    }}
                    >
                    <Grid
                        xs={12}
                        lg={4}
                        container
                        spacing={{
                            xs: 3,
                            lg: 4
                        }}
                    >
                        <Grid
                            xs={12}
                            lg={12}
                        >
                            <AnalyticsSatisfaction 
                                value={70} 
                                valueMax={100} 
                                title={"Tỷ lệ học viên hài lòng về khoá học"}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={12}
                        >
                            <AnalyticsSatisfaction 
                                value={50} 
                                valueMax={100} 
                                title={"Tỷ lệ học viên hài lòng về lộ trình học"}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        xs={12}
                        lg={8}
                        container
                        spacing={{
                            xs: 3,
                            lg: 4
                        }}
                    >
                        <Grid
                            xs={12}
                            lg={6}
                        >
                            <AnalyticsTrafficKeyword />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={6}
                        >
                            <AnalyticsTrafficComment 
                                sx={{ height: '100%' }}
                                comments={[
                                {
                                    title: 'New fresh design.',
                                    content: 'Your favorite template has a new trendy look, more customization options, screens & more.'
                                },
                                {
                                    title: 'Tip 2.',
                                    content: 'Tip content'
                                },
                                {
                                    title: 'Tip 3.',
                                    content: 'Tip content'
                                }
                                ]}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={12}
                        >
                            <AnalyticsChatbotAccess
                                title={"Tỷ lệ truy cập chatbot"}
                                xAxis={[{scaleType: 'point', data: xAxisData }]}
                                series={[
                                    {
                                        curve: "linear",
                                      data: [1,2,3,4,8,9,10],
                                    //   showMark: ({ index }) => index % 2 === 0,
                                      color: theme.palette.primary.main,
                                      label: "Số lượt truy cập",
                                      id: "accessRate"
                                    },
                                    {
                                        curve: "linear",
                                        data: [4,5,8,7,8,4,10],
                                        // showMark: ({ index }) => index % 2 === 0,
                                        color: theme.palette.primary.dark,
                                        label: "Số lượt hài lòng",
                                        id: "satisfactionRate"
                                    },
                                  ]}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                </Grid>
                </Container>
            </Box>
        </>
    )
}