import { userApi } from "../../api/user"
import { useAuth } from "../../hooks/use-auth"
import { useMounted } from "../../hooks/use-mounted";
import { useCallback, useEffect, useState } from "react";
import { CourseCard } from "./academy/course-card";
import { Button, Grid, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { grey } from "@mui/material/colors";
import { AcademyDailyProgress } from "./academy/academy-daily-progress";
import { useSettings } from "../../hooks/use-settings";
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { paths } from "../../paths";
import { AnalyticsStats } from "./analytics/analytics-stats";
import { AnalyticsTrafficSources } from "./analytics/analytics-traffic-sources";
import { analyticsApi } from "../../api/analytics";

export const DashboardInstructor = () => {
    const { user } = useAuth()
    const settings = useSettings();
    const isMounted = useMounted();
    const [historyWeekRegister, setHistoryWeekRegister] = useState(0)
    const [historyMonthRegister, setHistoryMonthRegister] = useState(0)
    const [historyWeekRegisterCourse, setHistoryWeekRegisterCourse] = useState([])

    const getApi = useCallback(async () => {
        try {
            const weekRegiter = await analyticsApi.getHistoryRegister(user.id, "week")
            const monthRegiter = await analyticsApi.getHistoryRegister(user.id, "month")
            const reponse = await analyticsApi.getHistoryRegisterCourse(user.id)

            const registerCourse = reponse.data.map(item => ({ x: item.name, y: Number(item.numberOfRegister), id: item.id}))

            if (isMounted()) {
                setHistoryWeekRegister(String(weekRegiter.data.historyRegister));
                setHistoryMonthRegister(String(monthRegiter.data.historyRegister));
                setHistoryWeekRegisterCourse(registerCourse);
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
                            md={6}
                        >
                            <AnalyticsStats title="Tổng đăng kí mới trong tuần" value = {historyWeekRegister}/>
                        </Grid>
                        <Grid
                            xs={12}
                            md={6}
                        >
                            <AnalyticsStats title="Tổng đăng kí mới trong tuần" value = {historyMonthRegister}/>
                        </Grid>
                        
                        <Grid
                            xs={12}
                            lg={12}
                            >
                            <AnalyticsTrafficSources
                                data={historyWeekRegisterCourse}
                                type="registerCourse"
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    )
}