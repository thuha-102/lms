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
import { LineChart } from '@mui/x-charts/LineChart';
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

export const AnalyticsChatbotAccess = (props) => {
  const theme = useTheme();
  const { title, xAxis, series } = props;

  return (
    <Card>
      <CardHeader
        title={title}
        action={(
          <Tooltip title="Số liệu được thu thập trong 7 ngày gần nhất">
            <SvgIcon color="action">
              <InfoCircleIcon />
            </SvgIcon>
          </Tooltip>
        )}
      />
      <CardContent sx={{ position: 'relative', padding: 0 }}>
        <LineChart
          xAxis={xAxis}
          series={series}
          height="300"
        />
      </CardContent>
    </Card>
  );
};


AnalyticsChatbotAccess.propTypes = {
  // chartSeries: PropTypes.any.isRequired,
  // labels: PropTypes.array.isRequired
};
