import PropTypes from 'prop-types';
import InfoCircleIcon from '@untitled-ui/icons-react/build/esm/InfoCircle';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../../components/chart';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const useChartOptions = (labels) => {
  const theme = useTheme();

  return {
    // chart: {
    //   background: 'transparent',
    //   stacked: false,
    //   toolbar: {
    //     show: false
    //   }
    // },
    // colors: [
    //   theme.palette.primary.main,
    //   theme.palette.warning.main,
    //   theme.palette.info.main
    // ],
    // dataLabels: {
    //   enabled: false
    // },
    // fill: {
    //   opacity: 1,
    //   type: 'solid'
    // },
    // labels,
    // legend: {
    //   show: false
    // },
    // plotOptions: {
    //   pie: {
    //     expandOnClick: false
    //   }
    // },
    // states: {
    //   active: {
    //     filter: {
    //       type: 'none'
    //     }
    //   },
    //   hover: {
    //     filter: {
    //       type: 'none'
    //     }
    //   }
    // },
    // stroke: {
    //   width: 0
    // },
    // theme: {
    //   mode: theme.palette.mode
    // },
    // tooltip: {
    //   fillSeriesColor: false
    // }
  };
};

export const AnalyticsSatisfaction = (props) => {
  const { value, valueMax, title } = props;
//   const chartOptions = useChartOptions(labels);

  return (
    <Card>
      <CardHeader
        title={title}
        action={(
          <Tooltip title="Dữ liệu được lấy trong ngày">
            <SvgIcon color="action">
              <InfoCircleIcon />
            </SvgIcon>
          </Tooltip>
        )}
      />
      <CardContent
        // sx={{height:'300px'}}
      >
        <Gauge
            value={value}
            valueMax={valueMax}
            startAngle={-110}
            endAngle={110}
            sx={{
                [`& .${gaugeClasses.valueText}`]: {
                fontSize: 40,
                transform: 'translate(0px, 0px)',
                },
            }}
            height={200}
            text={
                ({ value, valueMax }) => `${value} / ${valueMax}`
            }
        />
        {/* <Grid
          container
          spacing={1}
        >
          {chartSeries.map((item, index) => (
            <Grid
              key={index}
              xs={12}
              sm={6}
            >
              <Stack
                alignItems="center"
                direction="row"
                spacing={1}
              >
                <Box
                  sx={{
                    backgroundColor: chartOptions.colors[index],
                    borderRadius: '50%',
                    height: 8,
                    width: 8
                  }}
                />
                <Typography variant="subtitle2">
                  {labels[index]}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid> */}
      </CardContent>
    </Card>
  );
};

AnalyticsSatisfaction.propTypes = {
  chartSeries: PropTypes.any.isRequired,
  labels: PropTypes.array.isRequired
};
