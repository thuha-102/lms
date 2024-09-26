import PropTypes from 'prop-types';
import { CardContent, Card, CardMedia, Typography, Stack } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const initialCover = '/assets/covers/abstract-2-4x3-large.png';

export const CourseLock = (props) => {
  const {
    id,
    name,
    description,
    time,
    lessonsCount,
    score,
    coverId,
    ...other
  } = props;

  console.log(id);

  return (
    <Card {...other} sx={{border:"3px solid", borderColor: "action.disabledBackground"}}>
      <CardMedia
        aria-disabled
        image={coverId?`${process.env.NEXT_PUBLIC_SERVER_API}/files/${coverId}`:initialCover}
        sx={{ height: 150 }}
      />
      <CardContent>
        <Typography
          color="action.disabled"
          variant="h6"
        >
          {name}
        </Typography>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
            }}
            variant="subtitle2"
          >
            {lessonsCount} bài giảng • {time > 60 ? `${Math.floor(time/60)} tiếng` + ( Math.floor(time%60) === 0 ? "" : `${Math.floor(time%60)} phút`) : `${Math.floor(time)}phút`}
          </Typography>
          <LockOutlinedIcon />
        </Stack> 
      </CardContent>
    </Card>
  );
};

CourseLock.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  lessonsCount: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  coverId: PropTypes.string,
};
