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

const useListCourses = (id) => {
  const isMounted = useMounted();
  const [listCourses, setListCourses] = useState([{
        lastestLessonMinuteComplete: 0,
        lastestLesson: {
            id: 0,
            title: "",
            amountOfTime: 0,
        },
        course: {
            id: 0,
            name: ""
        }
    }]);

  const getListCourses = useCallback(async () => {
    try {
        const response = await userApi.getUserCourses(id, 3)
        if (isMounted()) {
          setListCourses(response.data);
        }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getListCourses();
  }, [id]);
  return listCourses;   
}; 

export const DashboardLearner = () => {
    const settings = useSettings();
    const { user } = useAuth()
    const listCourses = useListCourses(user?.id)

    return (
        <>
        <Box
            component="main"
            sx={{ flexGrow: 1 }}
        >
            <Box sx={{ py: '64px' }}>
                <Stack direction={'column'} maxWidth={settings.stretch ? false : 'xl'}>
                    {/* <Grid
                        container
                        spacing={{
                            xs: 3,
                            lg: 4
                        }}
                    > */}
                        <Grid>
                            <Typography variant="h4">
                                Chào mừng trở lại
                            </Typography>
                            <Typography
                                color="text.secondary"
                                sx={{ mt: 1 }}
                                variant="body2"
                                marginBottom={2}
                            >
                                Học là một cuộc phiêu lưu không bao giờ kết thúc.
                            </Typography>
                        </Grid>
                        {/* <Grid
                            xs={12}
                            md={12}
                        >
                            {listCourses[0]?.lastestLesson && <AcademyDailyProgress
                                timeCurrent={listCourses[0]?.lastestLessonMinuteComplete*60}
                                timeGoal={listCourses[0]?.lastestLesson ? listCourses[0]?.lastestLesson.amountOfTime : ""}
                                courseName = {listCourses[0]?.course.name}
                                lessonName = {listCourses[0]?.lastestLesson ? listCourses[0]?.lastestLesson.title : ""}
                            />}
                        </Grid> */}
                        <Grid marginBottom={2}>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Typography variant="h5">
                                    Học gần đây
                                </Typography>
                            </Stack>
                        </Grid>
                        <Stack direction={'row'}>
                            {listCourses.map((history) => (
                                <Grid
                                    key={history.course.id}
                                    xs={4}
                                    md={12}    
                                    marginRight={5}
                                    width={'450px'}
                                >
                                    <CourseCard course={history.course} />
                                </Grid>
                            ))}
                            
                        </Stack>
                    {/* </Grid> */}
                </Stack>
            </Box>
        </Box>
    </>
    )
}