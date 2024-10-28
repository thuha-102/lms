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
import { PieChart } from '@mui/x-charts/PieChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
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

export const AnalyticsGroupRate = (props) => {
  const { data, valueFormatter, title } = props;
//   const chartOptions = useChartOptions(labels);

  return (
    <Card>
      <CardHeader
        title={title}
        action={(
          <Tooltip title="Refresh rate is 24h">
            <SvgIcon color="action">
              <InfoCircleIcon />
            </SvgIcon>
          </Tooltip>
        )}
      />
      <CardContent>
        <PieChart
          title="Tỷ lệ học viên của mỗi nhóm"
          series={[
              {
              data: data,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 80, additionalRadius: -80, color: 'gray' },
              innerRadius: 80,
              valueFormatter,
              },
          ]}
          height={400}
          width={600} // Thêm chiều rộng
          sx={{margin:2}}
      />
      </CardContent>
    </Card>
  );
};

AnalyticsGroupRate.propTypes = {
  chartSeries: PropTypes.any.isRequired,
  labels: PropTypes.array.isRequired
};
