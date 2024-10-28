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
    avatarId,
    ...other
  } = props;

  console.log(id);

  return (
    <Card {...other} sx={{border:"1px solid", borderColor: "action.disabledBackground"}}>
      <CardMedia
        component={NextLink}
        href={`${paths.dashboard.explore}/${id}`}
        image={avatarId?`${process.env.NEXT_PUBLIC_SERVER_API}/files/${avatarId}`:initialCover}
        sx={{ height: 300 }}
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
            mt: 1,
          }}
          variant="body1"
        >
          {lessonsCount} bài giảng • {time > 60 ? `${Math.floor(time/60)} tiếng` + ( Math.floor(time%60) === 0 ? "" : `${Math.floor(time%60)} phút`) : `${Math.floor(time)}phút`}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            position: 'relative',
            // minHeight: '3em',  // Đảm bảo chiều cao đủ cho 2 dòng (nếu line-height là 1.5em)
            // lineHeight: '1.5em',
            '& p': { // Loại bỏ margin của các thẻ <p>
              margin: 0,
            },
            '&::after': {
              content: '""',
              display: 'block',
              height: '100%',
              visibility: 'hidden',
            },
          }}
          variant="subtitle2"
          dangerouslySetInnerHTML={{ __html: description || ' ' }}
        >
          {/* {description} */}
        </Typography>
        <Stack sx={{backgroundColor: "action.disabledBackground", borderRadius: 10}} width="100%" height={8} mt={2}>
          <Stack width={`${score}%`} height={8} sx={{backgroundColor: "primary.main", borderRadius: 10}}></Stack>
        </Stack>
        <Button variant="contained" href={`${paths.dashboard.explore}/${id}`} sx={{width: "100%", mt: 2}}>
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
  avatarId: PropTypes.string,
};
