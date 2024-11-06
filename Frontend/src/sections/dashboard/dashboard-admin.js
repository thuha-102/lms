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
    const [weeklyCreateUser, setWeeklyCreateUser] = useState(null)
    const [monthlyCreateUser, setMonthlyCreateUser] = useState(null)
    const [weeklyPurchaseCourse, setWeeklyPurchaseCourse] = useState(null)
    const [monthlyPurchaseCourse, setMonthlyPurchaseCourse] = useState(null)
    // const [historyForum, setHistoryForum] = useState(null)
    const [historyForum, setHistoryForum] = useState(["A", "B", "C"])
    const [groupRateLog, setGroupRateLog] = useState(null)
    const [groupProgressAndScoreLog, setGroupProgressAndScoreLog] = useState(null)
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState(null);
    const learner = useLearner(user?.id, user?.accountType, filter);
    const handleFilter = useCallback((filterBy) => setFilter(filterBy), [])

    const series = [
        { type: 'line', dataKey: 'avg_score', color: theme.palette.secondary.main, label: 'Điểm trung bình', valueFormatter:valueFormatterBarChart },
        // { type: 'line', dataKey: 'max', color: '#fe5f55', label: 'max temperature', valueFormatter:valueFormatterBarChart},
        { type: 'bar', dataKey: 'sequence_progress', color: theme.palette.primary.main, yAxisId: 'rightAxis', label: 'Tiến độ', valueFormatter:valueFormatterBarChart},
      ];

    const getApi = useCallback(async () => {
        try {
            const groupRate = await analyticsApi.getGroupRate()
            const groupProgressAndScore = await analyticsApi.getGroupProgressAndScore()
            const weeklyCreateUser = await analyticsApi.getAnnuallyCreateUser("week")
            const monthlyCreateUser = await analyticsApi.getAnnuallyCreateUser("month")
            const weeklyPurchaseCourse = await analyticsApi.getAnnuallyPurchaseCourse("week")
            const monthlyPurchaseCourse = await analyticsApi.getAnnuallyPurchaseCourse("month")
            // const reponse = await analyticsApi.getHistoryForum()
            
            // const forum = reponse.data.thisMonthLearnerForum.map(item => ({ x: item.forum_id, y: Number(item.total_access_time) }))

            // setHistoryWeekUser(String(weekUser.data.todayLogin));
            // setHistoryMonthUser(String(monthUser.data.todayLogin));
            // setHistoryWeekLog(String(weekLog.data.todayLearnerLog));
            // setHistoryMonthLog(String(monthLog.data.todayLearnerLog));
            if(isMounted()) {
                console.log(groupRate.data)
                setGroupRateLog(groupRate.data);
                setGroupProgressAndScoreLog(groupProgressAndScore.data);
                setWeeklyCreateUser(weeklyCreateUser.data.numOfCreateUser);
                setMonthlyCreateUser(monthlyCreateUser.data.numOfCreateUser);
                setWeeklyPurchaseCourse(weeklyPurchaseCourse.data.numOfPurchaseCourse);
                setMonthlyPurchaseCourse(monthlyPurchaseCourse.data.numOfPurchaseCourse);
            }
            // console.log(groupRate.data)
            // setHistoryForum(forum);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); // Kết thúc quá trình tải dữ liệu
        }
    }, [isMounted])

    useEffect(() => {
        getApi();
    }, [getApi])

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

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

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
                            lg={3}
                            container
                            spacing={{
                                xs: 3,
                                lg: 4
                            }}
                        >
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <AnalyticsStats title="Số người dùng đăng ký mới trong tuần" value = {weeklyCreateUser}/>
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <AnalyticsStats title="Số người dùng đăng ký mới trong tháng" value = {monthlyCreateUser}/>
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <AnalyticsStats title="Số khoá học đăng ký mới trong tuần" value = {weeklyPurchaseCourse}/>
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <AnalyticsStats title="Số khoá học đăng ký mới trong tháng" value = {monthlyPurchaseCourse}/>
                            </Grid>
                        </Grid>
                        <Grid
                            xs={12}
                            lg={9}
                            container
                            spacing={{
                                xs: 3,
                                lg: 4
                            }}>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                {groupRateLog && <AnalyticsGroupRate
                                    data={groupRateLog.group_rates}
                                    valueFormatter={valueFormatter}
                                    title={"Tỷ lệ học viên ở mỗi nhóm"}
                                />}
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                {groupProgressAndScoreLog && <AnalyticsScoreAndProcess 
                                    series={series}
                                    dataset={groupProgressAndScoreLog}
                                    title={"Điểm trung bình và tiến độ của học viên ở mỗi nhóm"}
                                />}
                            </Grid>
                        </Grid>
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