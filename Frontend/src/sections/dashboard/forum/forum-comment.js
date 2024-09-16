import PropTypes, { any } from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { ForumCommentAdd } from './forum-comment-add';

const translation_dict = {
  "seconds": "giây",
  "minutes": "phút",
  "second": "giây",
  "minute": "phút",
  "hours": "giờ",
  "hour": "giờ",
  "day": "ngày",
  "week": "tuần",
  "month": "tháng",
  "year": "năm",
  "days": "ngày",
  "weeks": "tuần",
  "months": "tháng",
  "years": "năm",
  "ago": "trước",
  "yesterday": "hôm qua",
  "today": "hôm nay",
  "tomorrow": "ngày mai",
  "last week": "tuần trước",
  "next month": "tháng sau",
  "a few": "vài",
  "about": "khoảng", 
  "less": "ít",
  "more": "nhiều",
  "than": "hơn",
  "a": "1"
}

function translateToVietnamese(sentence) {
  for (let enTerm in translation_dict) {
      if (Object.prototype.hasOwnProperty.call(translation_dict, enTerm)) {
          const viTerm = translation_dict[enTerm];
          const regex = new RegExp(enTerm, 'gi');
          sentence = sentence.replace(regex, viTerm);
      }
  }
  return sentence;
}

export const ForumComment = (props) => {
  const {
    authorAvatar,
    authorName,
    authorRole,
    content,
    replies,
    updatedAt,
    isLiked: isLikedProp,
    likes: likesProp,
    forumId,
    userId,
    statementId,  
    id,
    ...other
  } = props;

  const [addReply, setAddReply] = useState(false);
  const [renderedReplies, setRenderedReplies] = useState(replies);
  const [showReplies, setShowReplies] = useState(replies.length == 0 ? null : false);

  return (
    <Stack alignItems="flex-start" direction="row" spacing={1} width="100%">
      <Avatar src={authorAvatar} />
      <Stack flexGrow={1} direction="column" spacing={1} width="100%">
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? 'neutral.900'
              : 'neutral.100',
            borderRadius: 1,
            p: 2,
            flexGrow: 1
          }}
        >
          <Box
            sx={{
              alignItems: 'flex-start',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="subtitle2">
              {authorName}
            </Typography>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              {translateToVietnamese(formatDistanceToNow(new Date(updatedAt), { addSuffix: true }))}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 1 }}
          >
            {content}
          </Typography>
        </Box>
        <Stack justifyContent="flex-start" direction="row" spacing={0.5} width="100%" >
          <Button color="inherit" sx={{p: 0.5, fontWeight: 500, fontSize: 12}} onClick={() => {
            setAddReply(true);
            setShowReplies(true);
          }}>Phản hồi</Button>
          {showReplies == false && <Button color="inherit"  sx={{p: 0.5, fontWeight: 500, fontSize: 12}} onClick={() => setShowReplies(true)}>Hiển thị tất cả phản hồi</Button>}
        </Stack>
        {addReply == true && <ForumCommentAdd forumId={forumId} statementId={id} setComments={setRenderedReplies}/>}
        {showReplies == true && renderedReplies.map(r => <ForumComment key={r.id} {...r} />)}
      </Stack>
    </Stack>   
  );
};

ForumComment.propTypes = {
  authorAvatar: PropTypes.string,
  authorName: PropTypes.string.isRequired,
  authorRole: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likes: PropTypes.number.isRequired,
  forumId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  statementId: PropTypes.number,
  replies: PropTypes.arrayOf(any),
  id: PropTypes.number.isRequired,
};
