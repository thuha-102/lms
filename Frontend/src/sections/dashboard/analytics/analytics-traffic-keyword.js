import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Typography, Stack} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../../components/chart';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { paths } from '../../../paths';

const initial_stack = [
  {
    description: "a",
    score: 10
  },
  {
    description: "b",
    score: 30
  },
  {
    description: "a",
    score: 10
  },
  {
    description: "b",
    score: 30
  },
  {
    description: "a",
    score: 10
  },
  {
    description: "b",
    score: 30
  }
];

export const AnalyticsTrafficKeyword = (props) => {
  const { data, type, score } = props;
  const [stackSeries, setStackSeries] = useState(initial_stack)
  const [options, setOptions] = useState(null)
  const [forumPath, setForumPath] = useState(null)
  const router = useRouter()
  const theme = useTheme();

  // const chartOptions = (data) => {
  //   return {
  //     chart: {
  //       background: 'transparent',
  //       stacked: true,
  //       toolbar: {
  //         show: false
  //       },
  //       events:{
  //         click: function(event, chartContext, config) {
  //         // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian chartsc
  //           const path = type === "forum" ? `${paths.dashboard.forum.index}/${data[config.dataPointIndex]?.x}` : `${paths.dashboard.explore}/${data[config.dataPointIndex]?.id}`
  //           setForumPath(path);
  //         }
  //       }
  //     },
  //     colors: [
  //       theme.palette.primary.main,
  //       theme.palette.mode === 'dark'
  //         ? theme.palette.primary.darkest
  //         : theme.palette.primary.light
  //     ],
  //     dataLabels: {
  //       enabled: true
  //     },
  //     legend: {
  //       show: false
  //     },
  //     grid: {
  //       borderColor: theme.palette.divider,
  //       padding: {
  //         bottom: 0,
  //         left: 0,
  //         right: 0,
  //         top: 0
  //       },
  //       strokeDashArray: 2
  //     },
  //     plotOptions: {
  //       bar: {
  //         borderRadius: 8,
  //         columnWidth: '32px',
  //         horizontal: true
  //       }
  //     },
  //     theme: {
  //       mode: theme.palette.mode
  //     },
  //     xaxis: {
  //       axisBorder: {
  //         show: false
  //       },
  //       axisTicks: {
  //         show: false
  //       },
  //       labels: {
  //         style: {
  //           colors: theme.palette.text.secondary
  //         }
  //       }
  //     },
  //     yaxis: {
  //       axisBorder: {
  //         show: false
  //       },
  //       axisTicks: {
  //         show: false
  //       },
  //       labels: {
  //         show: false
  //       }
  //     }
  //   };
  // };

  // useEffect(() =>{
  //   setStackSeries( [{
  //       name: "",
  //       data: data,
  //       score: score,
  //     }])
  //   setOptions(chartOptions(data));
  // },[data])

  // useEffect(() => {
  //   if (forumPath) router?.push(forumPath)
  // }, [forumPath])

  return (
    <Card>
      <CardHeader
        sx={{ pb: 0 }}
        title={`Top từ khoá quan tâm trong tuần`}
      />
      <CardContent 
        sx={{ pt: 0 }}
      >
        {stackSeries?.map((i) =>  <>
          <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            position: 'relative',
            // minHeight: '3em',  // Đảm bảo chiều cao đủ cho 2 dòng (nếu line-height là 1.5em)
            // lineHeight: '1.5em',
            '& p': { // Loại bỏ margin của các thẻ <p>
              margin: 0,
            },
            '&::after': {
              content: '""',
              display: 'block',
              height: '100%',
              visibility: 'hidden',
            },
          }}
          variant="subtitle2"
          dangerouslySetInnerHTML={{ __html: i.description || ' ' }}
        >
          {/* {description} */}
        </Typography>
        <Stack sx={{backgroundColor: "action.disabledBackground", borderRadius: 10}} width="100%" height={8} mt={0.5}>
          <Stack width={`${i.score}%`} height={8} sx={{backgroundColor: "primary.main", borderRadius: 10}}></Stack>
        </Stack>
        </>)}
      </CardContent>
    </Card>
  );
};

AnalyticsTrafficKeyword.propTypes = {
  data: PropTypes.any.isRequired
};
