import { userApi } from "../../api/user"
import { useAuth } from "../../hooks/use-auth"
import { useMounted } from "../../hooks/use-mounted";
import { useCallback, useEffect, useState, useRef } from "react";
import { CourseCard } from "./academy/course-card";
import { Button, Grid, SvgIcon, Typography, Input, Chip, Box, Stack, CircularProgress } from "@mui/material";
import { grey } from "@mui/material/colors";
import { AcademyDailyProgress } from "./academy/academy-daily-progress";
import { useSettings } from "../../hooks/use-settings";
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import { paths } from "../../paths";
import { cozeChatbotApi } from "../../api/Coze-chatbot";

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
        const response = await userApi.getUserCourses(id)
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
    const listCourses = [] //useListCourses(user?.id)

    const [chatMess, setChatMess] = useState("");
    const [conversationId, setConversationId] = useState("");
    const [chatContent, setChatContent] = useState([]);
    const [recommendQues, setRecommendQues] = useState(["fdfdfdfdfdfddd dfdfd fdfd dfdfd", "fdfdfdfdfdfddd dfdfd fdfd dfdfd", "fdfdfdfdfdfddd dfdfd fdfd dfdfd", "fdfdfdfdfdfddd dfdfd fdfd dfdfd", "fdfdfdfdfdfddd dfdfd fdfd dfdfd"]);
    const chatBoxRef = useRef();

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatContent]);

    const HandelStartChat = useCallback(async () => {
        setConversationId("1");
        setChatMess("");
        setChatContent(pre => [...pre, { content: chatMess }, { isLoading: true, bot_id: "bot" }]);
        setRecommendQues([]);

        try {
            const conversationData = await cozeChatbotApi.createConversation();
            setConversationId(conversationData.data.data.id);

            const res = await cozeChatbotApi.postMessage(user.id, chatMess, conversationData.data.id);
            const lines = res.data.split('\n');

            lines.forEach((line, i) => {
                if (line.startsWith('event:')) {
                    const eventType = line.split(':')[1].trim();
                    const dataLine = lines[i + 1];

                    if (dataLine && dataLine.startsWith('data:')) {
                        const data = JSON.parse(dataLine.substring(5).trim());
                        switch (eventType) {       
                            case process.env.NEXT_PUBLIC_COZE_CHAT_CONVERSATION_MESS_COMPLETE:
                                if (data.type === "answer") {
                                    setChatContent(pre => [...pre.slice(0, -1), data]);
                                } else if (data.type === "follow_up") {
                                    setRecommendQues(pre => [...pre, data.content])
                                }
                                break;

                            case process.env.NEXT_PUBLIC_COZE_CHAT_CONVERSATION_MESS_FAIL:
                                setChatContent(pre => [...pre.slice(0, -1), { content: `Yêu cầu thất bại (${data.last_error.code}): ${data.last_error.msg}`, bot_id: "bot" }]);
                        }
                    }
                }
            })
        } catch (e) {
            console.error(e);
        };
    }, [chatMess]);

    const HandelSendMess = useCallback(async () => {
        setChatMess("");
        setChatContent(pre => [...pre, { content: chatMess }, { isLoading: true, bot_id: "bot" }]);
        setRecommendQues([]);

        try {
            const res = await cozeChatbotApi.postMessage(user.id, chatMess, conversationId);
            const lines = res.data.split('\n');

            lines.forEach((line, i) => {
                if (line.startsWith('event:')) {
                    const eventType = line.split(':')[1].trim();
                    const dataLine = lines[i + 1];

                    if (dataLine && dataLine.startsWith('data:')) {
                        const data = JSON.parse(dataLine.substring(5).trim());
                        switch (eventType) {
                            case process.env.NEXT_PUBLIC_COZE_CHAT_CONVERSATION_MESS_COMPLETE:
                                if (data.type === "answer") {
                                    setChatContent(pre => [...pre.slice(0, -1), data]);
                                } else if (data.type === "follow_up") {
                                    setRecommendQues(pre => [...pre, data.content])
                                }
                                break;

                            case process.env.NEXT_PUBLIC_COZE_CHAT_CONVERSATION_MESS_FAIL:
                                setChatContent(pre => [...pre.slice(0, -1), { content: `Yêu cầu thất bại (${data.last_error.code}): ${data.last_error.msg}`, bot_id: "bot" }]);

                            case "error":
                                setChatContent(pre => [...pre.slice(0, -1), { content: `Yêu cầu thất bại (${data.code}): ${data.msg}`, bot_id: "bot" }]);
                        }
                    }
                }
            })
        } catch (e) {
            console.error(e);
        };
    }, [chatMess]);

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
                        <Typography variant="h4">
                            Chào mừng trở lại
                        </Typography>
                        <Typography
                            color="text.secondary"
                            sx={{ mt: 1 }}
                            variant="body2"
                            marginBottom={5}
                        >
                            Học là một cuộc phiêu lưu không bao giờ kết thúc.
                        </Typography>
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
                        <Stack mb={4}>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                                mb={3}
                            >
                                <Typography variant="h5">
                                    Chatbot
                                </Typography>
                            </Stack>
                            {conversationId === "" 
                            ? <Stack alignItems="center" justifyContent="center" border="1px solid" borderColor="action.disabledBackground" borderRadius={5} padding={3}>
                                <Typography variant="h5">
                                    Tôi có thể giúp gì cho bạn !
                                </Typography>
                                <Stack
                                    alignItems="center" px={3} py={2} border="1px solid" borderColor="primary.main" borderRadius={10} mt={5} flexDirection="row" width="60%" justifyContent="space-between"
                                >
                                    <Input 
                                        placeholder="Bắt đầu đoạn chat..." 
                                        autoFocus
                                        disableUnderline fullWidth
                                        value={chatMess}
                                        onChange={e => setChatMess(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && chatMess !== "" && HandelStartChat()}
                                    />
                                    <Button 
                                        sx={{ minWidth: 30, maxWidth: 30, minHeight: 30, maxHeight: 30, borderRadius: "100%", color: "text.primary", ml: 2}}
                                        disabled={chatMess === ""}
                                        onClick={() => HandelStartChat()}
                                    >
                                        <ArrowUpwardOutlinedIcon />
                                    </Button>
                                </Stack>
                                <Box width="60%" mt={3}>
                                    {recommendQues.map((label,index) => 
                                    <Chip 
                                        key={index} 
                                        label={label}  
                                        sx={{mr: 1, mb: 1, borderRadius: 1}} 
                                        variant="outlined"
                                        onClick={() => {setChatMess(label)}}
                                    />
                                    )}
                                </Box>
                            </Stack>
                            : <Stack borderRadius={5} padding={3} border="1px solid" borderColor="action.disabledBackground">
                                <Box sx={{ width: "100%", height: 350, overflowY: 'auto', paddingX: 5}} ref={chatBoxRef}>
                                    {chatContent.map((mess, i) => 
                                        <div key={i}>
                                            {mess.bot_id && <Typography variant="body2" color="primary.main">Chatbot</Typography>}
                                            <Stack 
                                                borderRadius={2} 
                                                sx={{ backgroundColor: mess.bot_id ? "action.disabledBackground" : "primary.main", width: "fit-content"}} 
                                                padding={2} 
                                                flexDirection="row" 
                                                justifyContent={mess.bot_id ? "flex-start" : "flex-end"}
                                                ml={mess.bot_id ? 0 : "auto"}
                                                mb={3}
                                            >
                                                {mess.isLoading 
                                                ? <CircularProgress size={20} sx={{color: "white"}}/> 
                                                : <Typography variant="body1" color={mess.bot_id ? "text.primary" : "white"}>
                                                    {mess.content}
                                                </Typography>}
                                            </Stack>
                                        </div>
                                    )}
                                    {recommendQues.map((label,index) => 
                                    <Chip 
                                        key={index} 
                                        label={label}  
                                        sx={{mr: 1, mb: 1, borderRadius: 1}} 
                                        variant="outlined"
                                        onClick={() => {setChatMess(label)}}
                                    />
                                    )}
                                </Box>
                                <Stack
                                    alignItems="center" px={3} py={2} border="1px solid" borderColor="primary.main" borderRadius={10} flexDirection="row" justifyContent="space-between" marginX={5}
                                >
                                    <Input 
                                        placeholder="Chat với bot..." 
                                        autoFocus
                                        disableUnderline fullWidth
                                        value={chatMess}
                                        onChange={e => setChatMess(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && !chatContent[chatContent.length - 1].isLoading && chatMess !== "" && HandelSendMess()}
                                    />
                                    <Button 
                                        sx={{ minWidth: 30, maxWidth: 30, minHeight: 30, maxHeight: 30, borderRadius: "100%", color: "text.primary", ml: 2}}
                                        disabled={chatMess === "" || chatContent[chatContent.length - 1].isLoading}
                                        onClick={() => HandelSendMess()}
                                    >
                                        <ArrowUpwardOutlinedIcon />
                                    </Button>
                                </Stack>
                            </Stack>}
                        </Stack>
                        <Stack
                            alignItems="flex-start"
                            direction="row"
                            justifyContent="space-between"
                            spacing={3}
                            mb={3}
                        >
                            <Typography variant="h5">
                                Học gần đây
                            </Typography>
                        </Stack>
                        <Stack direction={'row'}>
                            {listCourses.map((history, index) => (
                                <Grid
                                    key={index}
                                    xs={4}
                                    md={12}    
                                    marginRight={5}
                                    width={'450px'}
                                >
                                    <CourseCard course={history} />
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