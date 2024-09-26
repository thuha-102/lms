import PropTypes from 'prop-types';
import { CardContent, Card, CardMedia, Stack, Typography, Button, Link } from '@mui/material';
import { paths } from '../../../paths';
import NextLink from 'next/link';

const initialCover = '/assets/covers/abstract-1-4x3-large.png';

export const CourseProcess = (props) => {
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
    <Card {...other} sx={{border:"1px solid", borderColor: "action.disabledBackground"}}>
      <CardMedia
        component={NextLink}
        href={`${paths.dashboard.explore}/${id}`}
        image={coverId?`${process.env.NEXT_PUBLIC_SERVER_API}/files/${coverId}`:initialCover}
        sx={{ height: 200 }}
      />
      <CardContent>
        <Link
          color="text.primary"
          component={NextLink}
          href={`${paths.dashboard.explore}/${id}`}
          variant="h5"
        >
          {name}
        </Link>
        <Typography
          color="text.secondary"
          sx={{
            mt: 2,
          }}
          variant="body1"
        >
          {lessonsCount} bài giảng • {time > 60 ? `${Math.floor(time/60)} tiếng` + ( Math.floor(time%60) === 0 ? "" : `${Math.floor(time%60)} phút`) : `${Math.floor(time)}phút`}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            mt: 2,
          }}
          variant="subtitle2"
        >
          {description}
        </Typography>
        <Stack sx={{backgroundColor: "action.disabledBackground", borderRadius: 10}} width="100%" height={10} mt={3}>
          <Stack width={`${score}%`} height={10} sx={{backgroundColor: "primary.main", borderRadius: 10}}></Stack>
        </Stack>
        <Button variant="contained" href={`${paths.dashboard.explore}/${id}`} sx={{width: "100%", mt: 5}}>
          Tiếp tục tiến trình
        </Button>
      </CardContent>
    </Card>
  );
};

CourseProcess.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  lessonsCount: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  coverId: PropTypes.string,
};
