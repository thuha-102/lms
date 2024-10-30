import { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import { Drawer, IconButton, Stack, SvgIcon, Typography, Box, Input, Button, Chip, CircularProgress, Rating } from '@mui/material';
import { Scrollbar } from '../scrollbar';
import { cozeChatbotApi } from "../../api/Coze-chatbot";
import { useAuth } from "../../hooks/use-auth"
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import { FinalRating } from "./final-rating";
import { styled } from '@mui/material/styles';
import { userApi } from "../../api/user";

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
  '& .MuiRating-iconHover': {
    color: theme.palette.primary.main,
  },
}));

export const ChatbotDrawer = (props) => {
  const { onClose, onUpdate, open, values = {}, ...other } = props;

  const chatBoxRef = useRef();
  const [chatMess, setChatMess] = useState("");
  const { user } = useAuth()

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [values.chatContent]);

  const HandelStartChat = useCallback(async () => {
    handleFieldUpdate("conversationId", "1");
    handleFieldUpdate("chatContent", [...values.chatContent, { content: chatMess }, { isLoading: true, bot_id: "bot" }]);
    handleFieldUpdate("recommendQues", []);
    setChatMess("");

    try {
      const conversationData = await cozeChatbotApi.createConversation();
      handleFieldUpdate("conversationId", conversationData.data.data.id);

      const res = await cozeChatbotApi.postMessage(user.id, chatMess, conversationData.data.id);
      const lines = res.data.split('\n');
      var newRecommendQues = [];

      lines.forEach((line, i) => {
        if (line.startsWith('event:')) {
          const eventType = line.split(':')[1].trim();
          const dataLine = lines[i + 1];

          if (dataLine && dataLine.startsWith('data:')) {
            const data = JSON.parse(dataLine.substring(5).trim());
            switch (eventType) {       
              case process.env.NEXT_PUBLIC_COZE_CHAT_CONVERSATION_MESS_COMPLETE:
                if (data.type === "answer") {
                  handleFieldUpdate("chatContent", [...values.chatContent, { content: chatMess }, {...data, rating: 0}]);
                } else if (data.type === "follow_up") {
                  newRecommendQues = [...newRecommendQues, data.content];
                }
                break;

              case process.env.NEXT_PUBLIC_COZE_CHAT_CONVERSATION_MESS_FAIL:
                handleFieldUpdate("chatContent", [...values.chatContent, { content: chatMess }, { content: `Yêu cầu thất bại (${data.last_error.code}): ${data.last_error.msg}`, bot_id: "bot" }]);
            }
          }
        }
      })
      handleFieldUpdate("recommendQues", newRecommendQues);
    } catch (e) {
      console.error(e);
    };
  }, [chatMess]);

  const HandelSendMess = useCallback(async () => {
      handleFieldUpdate("chatContent", [...values.chatContent, { content: chatMess }, { isLoading: true, bot_id: "bot" }]);
      handleFieldUpdate("recommendQues", []);
      setChatMess("");

      try {
        const res = await cozeChatbotApi.postMessage(user.id, chatMess, values.conversationId);
        const lines = res.data.split('\n');
        var newRecommendQues = [];

        lines.forEach((line, i) => {
          if (line.startsWith('event:')) {
            const eventType = line.split(':')[1].trim();
            const dataLine = lines[i + 1];

            if (dataLine && dataLine.startsWith('data:')) {
              const data = JSON.parse(dataLine.substring(5).trim());
              switch (eventType) {
                case process.env.NEXT_PUBLIC_COZE_CHAT_CONVERSATION_MESS_COMPLETE:
                    if (data.type === "answer") {
                      handleFieldUpdate("chatContent", [...values.chatContent, { content: chatMess }, {...data, rating: 0}]);
                    } else if (data.type === "follow_up") {
                      newRecommendQues = [...newRecommendQues, data.content];
                    }
                    break;

                case process.env.NEXT_PUBLIC_COZE_CHAT_CONVERSATION_MESS_FAIL:
                  handleFieldUpdate("chatContent", [...values.chatContent, { content: chatMess }, { content: `Yêu cầu thất bại (${data.last_error.code}): ${data.last_error.msg}`, bot_id: "bot" }]);

                case "error":
                  handleFieldUpdate("chatContent", [...values.chatContent, { content: chatMess }, { content: `Yêu cầu thất bại (${data.code}): ${data.msg}`, bot_id: "bot" }]);
              }
            }
          }
        })
        handleFieldUpdate("recommendQues", newRecommendQues);
      } catch (e) {
        console.error(e);
      };
  }, [values.chatContent, chatMess]);

  const handleFieldUpdate = useCallback((field, value) => {
    onUpdate?.({
      [field]: value
    });
  }, [onUpdate]);

  const HandelSubmitRating = useCallback(async (data) => {
    try {
      switch (data.type) {
        case "course":
          await userApi.rateCourse(user.id, {
            courseid: data.courseid,
            rating: data.rating,
            comment: data.comment !== "" ? data.comment : undefined,
          })
          handleFieldUpdate("chatContent", [...values.chatContent.slice(0, data.i), ...values.chatContent.slice(data.i+1)]);
        case "sequenceCourse":
          await userApi.rateSequenceCourse(user.id, {
            rating: data.rating,
            comment: data.comment !== "" ? data.comment : undefined,
          })
          handleFieldUpdate("chatContent", [...values.chatContent.slice(0, data.i), ...values.chatContent.slice(data.i+1)]);
        case "chatbot":
          await userApi.rateChatbot(user.id, {
            rating: data.rating
          })
          handleFieldUpdate("chatContent", [...values.chatContent.slice(0, data.i), {...data.mess, rating: undefined}, ...values.chatContent.slice(data.i+1)]);
      }
    } catch (e) {
      console.error(e);
    };
  }, [values.chatContent]);

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true
        },
        sx: { zIndex: 1300 }
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: '100%',
          width: 390,
          marginRight: 12,
          maxHeight: 500,
          marginTop: 15,
          border: '1px solid',
          borderRadius: 2,
        }
      }}
      {...other}>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          },
          '& .simplebar-scrollbar:before': {
            background: 'var(--nav-scrollbar-color)'
          }
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
          sx={{
            px: 3,
            py: 1
          }}
          borderBottom="1px solid"
        > 
          <Typography variant="h6">
            Chatbot
          </Typography>
          <Stack
            alignItems="center"
            direction="row"
            spacing={0.5}
          >
            <IconButton
              color="inherit"
              onClick={onClose}
            >
              <SvgIcon>
                <XIcon />
              </SvgIcon>
            </IconButton>
          </Stack>
        </Stack>
        <Stack
          spacing={5}
          sx={{ p: 3 }}
        >
          {values.conversationId === "" 
          ? <Stack>
            <Box width="100%" sx={{ width: "100%", height: 350, overflowY: 'auto'}}>
              <Stack alignItems="center" justifyContent="center">
                <Typography variant="h5">
                  Xin chào !
                </Typography>
                <Typography variant="h6" mt={2}>
                  Tôi có thể giúp gì cho bạn ?
                </Typography>
              </Stack>
              <Box width="100%" mt={3}>
                {values.recommendQues.map((label,index) => 
                <Chip 
                    key={index} 
                    label={label}  
                    sx={{mr: 1, mb: 1, borderRadius: 1}} 
                    variant="outlined"
                    onClick={() => {setChatMess(label)}}
                />
                )}
              </Box>
            </Box>
            <Stack
              alignItems="center" px={3} py={1} border="1px solid" borderColor="primary.main" borderRadius={10} flexDirection="row" width="100%" justifyContent="space-between"
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
          </Stack>
          : <Stack>
            <Box sx={{ width: "100%", height: 350, overflowY: 'auto', overflowX: "clip",  
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'scrollbar.background',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'scrollbar.thumb',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'scrollbar.thumbHover',
              },}} ref={chatBoxRef}
            >
              {values.chatContent.map((mess, i) => 
                mess.content === "rating" 
                ? <FinalRating title={mess.title} description={mess.description} courseId={mess.courseId} i={i} onSubmit={HandelSubmitRating}/>
                : <Stack key={i}>
                  {mess.bot_id && <Typography variant="body1" fontSize={14} color="primary.main">Chatbot</Typography>}
                  <Stack 
                    borderRadius={1} 
                    sx={{ backgroundColor: mess.bot_id ? "action.disabledBackground" : "primary.main", width: "fit-content"}} 
                    padding={1} 
                    flexDirection="row" 
                    justifyContent={mess.bot_id ? "flex-start" : "flex-end"}
                    ml={mess.bot_id ? 0 : "auto"}
                    mb={mess.rating !== undefined ? 0 : 2}
                  >
                    {mess.isLoading 
                    ? <CircularProgress size={15} sx={{color: "white"}}/> 
                    : <Typography variant="body1" fontSize={13} color={mess.bot_id ? "text.primary" : "white"}>
                      {mess.content}
                    </Typography>}
                  </Stack>
                  {mess.rating !== undefined && <StyledRating
                    value={mess.rating}
                    onChange={(_, newValue) => {
                      HandelSubmitRating({
                        type: "chatbot",
                        rating: newValue,
                        i: i,
                        mess: mess
                      })
                    }}
                    precision={1}
                    sx={{mb:2}}
                    size="small"
                    color="primary.main"
                  />}
                </Stack>
              )}
              {values.recommendQues.map((label,index) => 
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
              alignItems="center" px={3} py={1} border="1px solid" borderColor="primary.main" borderRadius={10} flexDirection="row" justifyContent="space-between"
            >
              <Input 
                placeholder="Chat với bot..." 
                autoFocus
                disableUnderline fullWidth
                value={chatMess}
                onChange={e => setChatMess(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !values.chatContent[values.chatContent.length - 1].isLoading && chatMess !== "" && HandelSendMess()}
              />
              <Button 
                sx={{ minWidth: 30, maxWidth: 30, minHeight: 30, maxHeight: 30, borderRadius: "100%", color: "text.primary", ml: 2}}
                disabled={chatMess === "" || values.chatContent[values.chatContent.length - 1].isLoading}
                onClick={() => HandelSendMess()}
              >
                <ArrowUpwardOutlinedIcon />
              </Button>
            </Stack>
          </Stack>}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

ChatbotDrawer.propTypes = {
  onClose: PropTypes.func,
  onUpdate: PropTypes.func,
  open: PropTypes.bool,
  // @ts-ignore
  values: PropTypes.object
};
