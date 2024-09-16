import PropTypes from 'prop-types';
import FaceSmileIcon from '@untitled-ui/icons-react/build/esm/FaceSmile';
import Attachment01Icon from '@untitled-ui/icons-react/build/esm/Attachment01';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { useCallback, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  OutlinedInput,
  Stack,
  SvgIcon,
  useMediaQuery,
} from '@mui/material';
import { useAuth } from '../../../hooks/use-auth';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import { forumApi } from '../../../api/forum';

export const ForumCommentAdd = (props) => {
  const { forumId, statementId, setComments , ...other } = props;

  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const { user } = useAuth();
  const [content, setContent] = useState('');

  const handleSubmitButton = useCallback(async () => {
    console.log(content);
    if (content != '') {
      await forumApi.postComment({
        "statementId": statementId,
        "content": content,
        "forumId": forumId,
        "userId": user.id
      })
        .then((response) => {
          console.log(response);
          setContent('');
          setComments(pre => [...pre, {
            ...response.data,
            replies: [], 
            authorAvatar: user.avatar,
            authorName: user.username,
            authorRole: "",
            isLiked: false,
            likes: 0,
          }])
        })
        .catch(error => {
          console.error('Error posting data:', error);
        })
    }
  }, [content]);

  if (!user) return null;

  return (
    <div {...other}>
      <Stack
        alignItems="flex-start"
        direction="row"
        spacing={2}
      >
        <Avatar
          src={user.avatar}
          sx={{
            height: 40,
            width: 40
          }}
        >
          <SvgIcon>
            <User01Icon />
          </SvgIcon>
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <OutlinedInput
            fullWidth
            multiline
            placeholder="Thêm bình luận..."
            rows={3}
            value={content}
            onChange={e => {
              setContent(e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSubmitButton();
                e.preventDefault();
              }}
            }
          />
          <Stack
            alignItems="center"
            direction="row"
            spacing={3}
            justifyContent="space-between"
            sx={{ mt: 3 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
            >
              {!smUp && (
                <IconButton>
                  <SvgIcon>
                    <PlusIcon />
                  </SvgIcon>
                </IconButton>
              )}
              {smUp && (
                <>
                  <IconButton>
                    <SvgIcon>
                      <Image01Icon />
                    </SvgIcon>
                  </IconButton>
                  <IconButton>
                    <SvgIcon>
                      <Attachment01Icon />
                    </SvgIcon>
                  </IconButton>
                  <IconButton>
                    <SvgIcon>
                      <FaceSmileIcon />
                    </SvgIcon>
                  </IconButton>
                </>
              )}
            </Stack>
            <div>
              <Button variant="contained" onClick={handleSubmitButton}>
                Gửi
              </Button>
            </div>
          </Stack>
        </Box>
      </Stack>
    </div>
  );
};

ForumCommentAdd.propTypes = {
  forumId: PropTypes.number.isRequired,
  statementId: PropTypes.number,
  setComments: PropTypes.func.isRequired
};
