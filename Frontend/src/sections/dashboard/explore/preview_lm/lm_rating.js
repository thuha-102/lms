import PropTypes from 'prop-types';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Rating,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
// import { CourseLesson } from './course-lesson';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

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
  


export const LmRating = ({value, setValue, hover, setHover }) => {
//   const { chapter } = props;
//   const [valueIcon, setValue]

  return (
    <Box
      sx={{
        position: 'relative',
        pb: 6
      }}
    >
      <Card>
        <CardHeader
          title="Đánh giá"
          subheader="Để lại một vài đánh giá về tài liệu học"
        />
        <Divider />
        <CardContent sx={{ textAlign: 'center' }}>
          {/* <CourseLesson content={chapter.lesson || ''} /> */}
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
            <Rating
                name="hover-feedback"
                value={value}
                precision={1}
                getLabelText={getLabelText}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                onChangeActive={(event, newHover) => {
                    setHover(newHover);
                }}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {value !== null && (
                <Box sx={{ mt:1, mb:1}}>{labels[hover !== -1 ? hover : value]}</Box>
            )}
            <TextField 
                id="outlined-basic" 
                label="Để lại một vài góp ý giúp chúng tôi cải thiện hệ thống nhé..." 
                variant="outlined" 
                sx = {{ width: '100%', mt: 2 }}
            />
        </CardContent>
      </Card>
    </Box>
  );
};

LmRating.propTypes = {
  // @ts-ignore
//   chapter: PropTypes.object.isRequired
};
