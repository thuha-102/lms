import NextLink from 'next/link';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import ClockIcon from '@untitled-ui/icons-react/build/esm/Clock';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Link,
  Stack,
  SvgIcon,
  Typography
} from '@mui/material';
import { paths } from '../../../paths';

export const CourseCard = (props) => {
  const { course } = props;

  return (
    <Card variant="outlined">
      <CardMedia
        component={NextLink}
        href={`${paths.dashboard.explore}/${course.id}`}
        image={`${process.env.NEXT_PUBLIC_SERVER_API}/files/${course.avatarId}`}
        sx={{ height: 180 }}
      />
      <CardContent>
        <Link
          color="text.primary"
          component={NextLink}
          href={`${paths.dashboard.explore}/${course.id}`}
          underline="none"
          variant="subtitle1"
        >
          {course.name}
        </Link>
        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
          variant="body2"
          dangerouslySetInnerHTML={{__html: course.description}}
        >
        </Typography>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
          sx={{ mt: 1 }}
        >
          <SvgIcon>
            <ClockIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            variant="caption"
          >
            {course.amountOfTime > 60 ? `${Math.floor(course.amountOfTime/60)} tiếng` + ( Math.floor(course.amountOfTime%60) === 0 ? "" : `${Math.floor(course.amountOfTime%60)} phút`) : `${Math.floor(course.amountOfTime)} phút`}
          </Typography>
        </Stack>
      </CardContent>
      <LinearProgress
        value={course.progress ? course.progress : 100}
        variant="determinate"
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 1
        }}
      >
        <Button
          color="inherit"
          component={NextLink}
          endIcon={(
            <SvgIcon>
              <ArrowRightIcon />  
            </SvgIcon>
          )}
          href={`${paths.dashboard.explore}/${course.id}`}
        >
          {props.isExplore ? "Khám phá" : "Tiếp tục"}
        </Button>
      </Box>
    </Card>
  );
};

CourseCard.propTypes = {
  // @ts-ignore
  course: PropTypes.object.isRequired
};
