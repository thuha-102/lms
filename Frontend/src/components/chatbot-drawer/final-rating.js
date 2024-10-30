import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Rating,
  Typography
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { styled } from '@mui/material/styles';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
  '& .MuiRating-iconHover': {
    color: theme.palette.primary.main,
  },
}));

const labels = {
    1: 'Rất tệ',
    2: 'Tệ',
    3: 'Trung bình',
    4: 'Tốt',
    5: 'Rất tốt',
  };
  
const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon color="error" />,
      label: 'Very Dissatisfied',
    },
    2: {
      icon: <SentimentDissatisfiedIcon color="error" />,
      label: 'Dissatisfied',
    },
    3: {
      icon: <SentimentSatisfiedIcon color="warning" />,
      label: 'Neutral',
    },
    4: {
      icon: <SentimentSatisfiedAltIcon color="success" />,
      label: 'Satisfied',
    },
    5: {
      icon: <SentimentVerySatisfiedIcon color="success" />,
      label: 'Very Satisfied',
    },
  };
  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }
  
export const FinalRating = (props) => {
  const { title, description, onSubmit, courseId, i } = props;
  const [value, setValue] = React.useState(null);
  const [hover, setHover] = React.useState(null);
  const [comment, setComment] = React.useState("");

  return (
    <Box
      sx={{
        position: 'relative',
        pb: 6,
        mb: 2
      }}
    >
      <Card>
        <CardHeader
          title={title}
          subheader={description}
        />
        <Divider />
        <CardContent sx={{ textAlign: 'center' }}>
          {/* <CourseLesson content={chapter.lesson || ''} /> */}
            <Typography component="legend" sx={{mt:10, mb:1}}>Đánh giá</Typography>
            {value !== null && (
                <div className="satisfy-icon">
                {
                    React.cloneElement(customIcons[hover !== -1 ? hover : value].icon, { 
                        sx: { fontSize: '100px', width: '100px', height: '100px', mb: 1 },
                        // color: hover >= parseInt(key) ? 'primary' : 'action'
                    })
                }
                </div>
            )}
            <StyledRating
                name="hover-feedback"
                value={value}
                precision={1}
                getLabelText={getLabelText}
                onChange={(_, newValue) => {
                  setValue(newValue);
                }}
                onChangeActive={(_, newHover) => {
                    setHover(newHover);
                }}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {value !== null && (
                <Box sx={{ mt:1, mb:5}}>{labels[hover !== -1 ? hover : value]}</Box>
            )}
            <TextField 
                id="outlined-basic" 
                placeholder="Để lại nhận xét..." 
                variant="outlined"
                sx = {{ width: '100%', mt: 2 }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <Button sx={{ mt: 2  }} variant="contained" disabled={value === null} onClick={() => onSubmit({
              type: courseId === undefined ? 'sequenceCourse' : 'course',
              rating: value,
              comment: comment,
              courseId: courseId, 
              i: i
            })}>
              Hoàn thành
            </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

FinalRating.propTypes = {
  // @ts-ignore
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  courseId: PropTypes.number
};
