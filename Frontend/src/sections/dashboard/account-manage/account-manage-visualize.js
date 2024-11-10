import {
  CardContent,
  CardHeader,
  TableCell,
  TableRow,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';

const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: 'Jannnnn nnnnnn',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: 'Febbbbbb bbbbbb',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: 'Marrrrrr rrrrrrr',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: 'Aprrrrrrr rrrrrrr',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: 'Mayyyyyy yyyyyy',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: 'Juneeee eeeeeeee',
  },
];

const valueFormatter = (value) => {
  return `${value}mm`;
}

const chartSetting = {
  xAxis: [
    {
      label: 'Điểm (mm)',
    },
  ],
  width: 800,  
  height: 400,
};


export const AccountManageVisualize = (props) => {
  const theme = useTheme();
  const { Account, handleAccountClose, handleAccountUpdate, handleAccountDelete } = props;

  return (
     <TableRow>
     <TableCell
       colSpan={7}
       sx={{
         p: 0,
         position: 'relative',
         '&:after': {
           position: 'absolute',
           content: '" "',
           top: 0,
           left: 0,
           backgroundColor: 'primary.main',
           width: 3,
           height: 'calc(100% + 1px)'
         }
     }}
    > 
      <CardHeader
        title={"Điểm trung bình của học viên"}
      >
      </CardHeader>
      {/* <Divider sx={{ my: 2 }} /> */}
      <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
        <BarChart
          dataset={dataset}
          yAxis={[{ scaleType: 'band', 
                    dataKey: 'month',
                    tickLabelStyle: {
                        angle: -25,
                        textAnchor: 'end',
                        fontSize: 12,
                    } 
                  }]}
          series={[
            { dataKey: 'seoul', label: 'Điểm cá nhân', valueFormatter },
            { dataKey: 'london', label: 'Điểm trung bình của nhóm học viên', valueFormatter }
          ]}
          layout="horizontal"
          grid={{ vertical: true }}
          {...chartSetting}
        />
      </CardContent>
   </TableCell>
  </TableRow>
  );
};


AccountManageVisualize.propTypes = {
  // chartSeries: PropTypes.any.isRequired,
  // labels: PropTypes.array.isRequired
};
