// This course card is used for instructor, having delete options

import NextLink from 'next/link';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Trash02Icon from '@untitled-ui/icons-react/build/esm/Trash02';
import ClockIcon from '@untitled-ui/icons-react/build/esm/Clock';
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
import { useCallback, useState } from 'react';
import { exploreApi } from '../../../api/explore';

export const CourseCardDelete = (props) => {
  const { course } = props;
  const [openDialog, setOpenDialog] = useState(false)

  const handleDeleteCourse = useCallback(async (courseId) => {
    try {
        const response = await exploreApi.detailCourse(courseId);
        console.log(response);
        setOpenDialog(false)
    } catch (err) {
        console.error(err);
    }
  },[])

  return (
    <Card variant="outlined">
      <CardMedia
        component={NextLink}
        href={`${paths.dashboard.explore}/${course.id}`}
        image={'/assets/cards/card-visa.png'}
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
        />
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
            {course.amountOfTime > 3600 ? `${Math.floor(course.amountOfTime/3600)}h${Math.floor((course.amountOfTime%3600)/60)}p` : `${Math.floor(course.amountOfTime/60)}p`}
          </Typography>
        </Stack>
      </CardContent>
      <LinearProgress
        value={course.progress ? course.progress : 100}
        variant="determinate"
      />
      <Box
        sx={{
        //   display: 'flex',
        //   justifyContent: 'flex-end',
          p: 1
        }}
      >
        <Stack direction="row" justifyContent="space-between">
        {props.isExplore ? <></> :
        <div>
            <Button
            color="inherit"
            sx={{ color: 'error.main' }}
            // component={NextLink}
            startIcon={(
                <SvgIcon>
                <Trash02Icon />  
                </SvgIcon>
            )}
            onClick={() => setOpenDialog(true)}
            // href={`${paths.dashboard.explore}/${course.id}`}
            >
                {"Xoá khoá học"}
            </Button>
            <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            // aria-labelledby="alert-dialog-title"
            // aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Xoá bài học"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn chắc chắn xoá bài học này ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Huỷ bỏ</Button>
                    <Button onClick={handleDeleteCourse} autoFocus>
                        Xoá
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
        }
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
        </Stack>
      </Box>
    </Card>
  );
};

CourseCardDelete.propTypes = {
  // @ts-ignore
  course: PropTypes.object.isRequired
};
