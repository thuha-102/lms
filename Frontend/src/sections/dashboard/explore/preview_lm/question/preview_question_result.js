import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import { Avatar, Button, Card, Stack, SvgIcon, Typography } from '@mui/material';
import { learning_logApi } from '../../../../../api/learning-log';
import { LmRating } from '../lm_rating'
import NextLink from 'next/link';
import { paths } from '../../../../../paths';
import {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation'

export const JobPreview = ({lmId, user, answers}) => {
  const [valueRating, setValueRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(3);
  const [updateRatingId, setUpdateRatingId] = useState();
  const [score, setScore] = useState();
  const router = useRouter()

  
  const createQuizLog = async (lmId, user, answers) => {
    try {
      const response = await learning_logApi.createLog(user.id, {
        rating: valueRating,
        learnerAnswer: answers,  
        time: 120, //chỗ này cần phải lấy time của lm sau đó gắn vào
        attempts: 1,
        learningMaterialId: lmId,
      });
      setScore([response.data.score, response.data.maxScore])
      setUpdateRatingId(response.data.id)
      console.log(score);
  
    } catch (err) {
      console.error(err);
    }
  }

  const updateRatingLog = async (logId) => {
    try {
      const response = await learning_logApi.updateRating(logId, {
        rating: valueRating,
      });
  
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    try {
      createQuizLog(parseInt(lmId,10), user, answers)
    } catch (err) {
      console.error(err);
    }}, []);

  useEffect(() => {
    if(updateRatingId) {
      try {
        updateRatingLog(updateRatingId)
      } catch (err) {
        console.error(err);
      }
    }
  }, [valueRating]);

  return (
    <Stack spacing={2}>
    <div>
      <Stack
          alignItems="center"
          direction="row"
          spacing={2}
      >
        <Avatar
          sx={{
            backgroundColor: 'success.main',
            color: 'success.contrastText',
            height: 40,
            width: 40
          }}
        >
          <SvgIcon>
            <CheckIcon />
          </SvgIcon>
        </Avatar>
        <div>
          <Typography
            variant="h6"
            sx={{ mt: 0 }}
          >
            Cảm ơn bài đã hoàn thành tài liệu học!
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Dưới đây là điểm số của bạn 
          </Typography>
        </div>
      </Stack>
    </div>
    <Card variant="outlined">
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.5
        }}
      >
        <div>
          <Typography variant="subtitle1">
            Thời gian 
          </Typography>
          <Typography
            color="text.secondary"
            variant="caption"
          >
            {(new Date()).toLocaleString("es-AR")}
          </Typography>
        </div>
        {/* <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        > */}
          <div>
            <Typography variant="subtitle2">
              Điểm số
            </Typography>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              {score ? `${score[0]}/${score[1]}`: ``}
            </Typography>
          </div>
          <Button 
            size="small"
            // component={NextLink}
            // href={paths.dashboard.explore}
            onClick={() => router.back()}
          >
            Xong
          </Button>
        {/* </Stack> */}
      </Stack>
    </Card>
    <LmRating 
                value={valueRating} 
                setValue={setValueRating} 
                hover={hoverRating} 
                setHover={setHoverRating}
      />
  </Stack>
  );
};
