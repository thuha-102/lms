import PropTypes from 'prop-types';
import { CardContent, Card, CardMedia, Stack, Typography, Button, Link } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { paths } from '../../../paths';
import NextLink from 'next/link';

const initialCover = '/assets/covers/minimal-1-4x3-large.png';

export const CourseDone = (props) => {
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
    <Card {...other} sx={{border:"3px solid", borderColor: "primary.main"}}>
      <CardMedia
        component={NextLink}
        href={`${paths.dashboard.explore}/${id}`}
        image={coverId?`${process.env.NEXT_PUBLIC_SERVER_API}/files/${coverId}`:initialCover}
        sx={{ height: 150 }}
      />
      <CardContent>
       <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Link
            color="primary.main"
            component={NextLink}
            href={`${paths.dashboard.explore}/${id}`}
            variant="h6"
          >
            {name}
          </Link>
          <DoneIcon sx={{ color: "primary.main"}}/>
        </Stack>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
            }}
            variant="subtitle2"
          >
            {lessonsCount} bài giảng • {time} tiếng
          </Typography>
          <Stack flexDirection="row" alignItems="center" justifyContent="center">
            <Typography color="text.primary" sx={{ mt: 2 }} variant="subtitle2" fontWeight={700}>
              {score} %
            </Typography>
          </Stack> 
        </Stack>
      </CardContent>
    </Card>
  );
};

CourseDone.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  lessonsCount: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  coverId: PropTypes.string,
};
