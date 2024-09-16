import PropTypes from 'prop-types';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../../components/chart';

const useChartOptions = (timeLeft) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      redrawOnParentResize: false,
      redrawOnWindowResize: false
    },
    colors: [theme.palette.primary.main],
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      padding: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      }
    },
    labels: ['Time left'],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            offsetY: -20,
            show: true
          },
          value: {
            fontSize: '14px',
            fontWeight: 500,
            formatter() {
              return timeLeft + 'min';
            },
            offsetY: -16
          }
        },
        endAngle: 90,
        hollow: {
          size: '60%'
        },
        startAngle: -90,
        track: {
          background: theme.palette.mode === 'dark'
            ? theme.palette.primary.dark
            : theme.palette.primary.light,
          strokeWidth: '100%'
        }
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      lineCap: 'round'
    },
    theme: {
      mode: theme.palette.mode
    }
  };
};

export const AcademyDailyProgress = (props) => {
  const { timeCurrent, timeGoal, lessonName, courseName } = props;
  const currentProgress = timeGoal - timeCurrent;
  const chartOptions = useChartOptions(currentProgress);
  const chartSeries = [currentProgress];

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            mx: -4,
            my: -6
          }}
        >
          <Chart
            width={260}
            height={260}
            options={chartOptions}
            series={chartSeries}
            type="radialBar"
          />
        </Box>
        <Typography variant="h6">
          
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
          marginTop={2}
        >
          {lessonName ? `Tiếp tục học bài ${lessonName}` : `Bạn vừa bắt đầu học ${courseName}`}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained">
            {lessonName ? lessonName : courseName}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

AcademyDailyProgress.propTypes = {
  timeCurrent: PropTypes.number.isRequired,
  timeGoal: PropTypes.number.isRequired
};
