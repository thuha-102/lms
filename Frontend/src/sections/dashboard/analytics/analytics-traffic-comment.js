import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, CardHeader, Typography, Grid } from '@mui/material';
import RecommendRoundedIcon from '@mui/icons-material/RecommendRounded';

const sliderSettings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

export const AnalyticsTrafficComment = (props) => {
  const { sx, comments } = props;

  return (
    <Card sx={sx}>
      <CardHeader 
        sx={{ pb: 0 }}
        title={`Nhận xét của học viên`}
      />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '300px'
        }}
      >
        {/* <Box sx={{ mb: 6 }}>
          <img src="/assets/next-tip.svg" />
        </Box> */}
        <Box
          sx={{
            flexGrow: 1,
            '& .slick-slider': {
              cursor: 'grab'
            },
            '& .slick-slider, & .slick-list, & .slick-track': {
              height: '100%'
            },
            '& .slick-dots': {
              top: 'unset',
              bottom: 0,
              left: 0,
              textAlign: 'center'
            }
          }}
        >
          <Slider {...sliderSettings}>
            {comments?.map((comment) => (
              // <div key={comment.title}>
              <div key={comment}>
                <Grid
                  xs={12}
                  lg={12}
                  container
                  spacing={{
                    xs: 0,
                    lg: 0
                  }}
                >
                  <Grid
                    xs={2}
                  >
                    <RecommendRoundedIcon 
                      color="primary" 
                      fontSize="large"
                    />
                  </Grid>
                  <Grid
                    xs={10}
                  >
                    <Typography variant="h6">
                      {/* {comment.title} */}
                      {comment.comment}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                      variant="body1"
                    >
                      {/* {comment.content} */}
                      {comment.createdAt}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            ))}
          </Slider>
        </Box>
      </CardContent>
    </Card>
  );
};

AnalyticsTrafficComment.propTypes = {
  // @ts-ignore
  sx: PropTypes.object,
  comments: PropTypes.array.isRequired
};
