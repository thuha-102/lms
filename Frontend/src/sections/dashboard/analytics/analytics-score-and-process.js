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
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';


export const AnalyticsScoreAndProcess = (props) => {
  const { series, dataset, title } = props;
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
        <Box sx={{ width: '100%' }}>
          <ResponsiveChartContainer
              series={series}
              xAxis={[
                  {
                  scaleType: 'band',
                  dataKey: 'name',
                  label: 'Phân loại',
                  },
              ]}
              yAxis={[
                  { id: 'leftAxis', label: 'Điểm trung bình'},
                  { id: 'rightAxis', label: 'Tiến độ'},
              ]}
              dataset={dataset}
              height={400}
          >
          <ChartsGrid horizontal />
          <BarPlot />
          <LinePlot />
          <MarkPlot />

          <ChartsXAxis />
          <ChartsYAxis axisId="leftAxis" label="Điểm trung bình (/10)" />
          <ChartsYAxis
              axisId="rightAxis"
              position="right"
              label="Tiến độ (%)"
          />
          <ChartsTooltip />
          </ResponsiveChartContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

AnalyticsScoreAndProcess.propTypes = {
  chartSeries: PropTypes.any.isRequired,
  labels: PropTypes.array.isRequired
};
