import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../../components/chart';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { paths } from '../../../paths';
export const AnalyticsTrafficSources = (props) => {
  const { data, type } = props;
  const [chartSeries, setChartSeries] = useState(null)
  const [options, setOptions] = useState(null)
  const [forumPath, setForumPath] = useState(null)
  const router = useRouter()
  const theme = useTheme();

  const chartOptions = (data) => {
    return {
      chart: {
        background: 'transparent',
        stacked: true,
        toolbar: {
          show: false
        },
        events:{
          click: function(event, chartContext, config) {
          // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian chartsc
            const path = type === "forum" ? `${paths.dashboard.forum.index}/${data[config.dataPointIndex]?.x}` : `${paths.dashboard.explore}/${data[config.dataPointIndex]?.id}`
            setForumPath(path);
          }
        }
      },
      colors: [
        theme.palette.primary.main,
        theme.palette.mode === 'dark'
          ? theme.palette.primary.darkest
          : theme.palette.primary.light
      ],
      dataLabels: {
        enabled: true
      },
      legend: {
        show: false
      },
      grid: {
        borderColor: theme.palette.divider,
        padding: {
          bottom: 0,
          left: 0,
          right: 0,
          top: 0
        },
        strokeDashArray: 2
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '32px',
          horizontal: true
        }
      },
      theme: {
        mode: theme.palette.mode
      },
      xaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false
        }
      }
    };
  };

  useEffect(() =>{
    setChartSeries( [{
        name: "",
        data: data
      }])
    setOptions(chartOptions(data));
  },[data])

  useEffect(() => {
    if (forumPath) router?.push(forumPath)
  }, [forumPath])

  return (
    <Card>
      <CardHeader
        sx={{ pb: 0 }}
        title={`Top ${type === "forum" ? "forum" : "khóa học"} được ${type === "forum" ? "truy cập" : "đăng kí"} trong tháng`}
      />
      <CardContent sx={{ pt: 0 }}>
        {chartSeries && <Chart
          height={350}
          options={options}
          series={chartSeries}
          type="bar"
        />}
      </CardContent>
    </Card>
  );
};

AnalyticsTrafficSources.propTypes = {
  data: PropTypes.any.isRequired
};
