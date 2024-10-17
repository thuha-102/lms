import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import {
  Card,
  CardHeader,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { MoreMenu } from '../../../components/more-menu';
import { Scrollbar } from '../../../components/scrollbar';
import { SeverityPill } from '../../../components/severity-pill';
import { paths } from '../../../paths';

export const CartInvoices = (props) => {
  const { invoices, ...other } = props;

  return (
    <Card sx={{minHeight: 700, minWidth: 600}}>
      <CardHeader
        title="Thanh toán"
      />
      <Scrollbar>
        <Table sx={{ minWidth: 600}}>
          <TableHead>
            <TableRow>
              <TableCell>
                Tên khóa học
              </TableCell>
              <TableCell>
                Giá tiền
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => {
              return (
                <TableRow key={invoice.courseId}>
                  <TableCell>
                    {invoice.courseName}
                  </TableCell>
                  <TableCell>
                    {invoice.salePercent !== 0? invoice.salePercent*invoice.price : invoice.price}
                  </TableCell>                 
                </TableRow>
              );
            })}
            <TableRow sx={{ '& td': { borderBottom: 'none' } }}>
              <TableCell align="right">Tổng cộng</TableCell>
              <TableCell>1000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
};

CartInvoices.propTypes = {
  invoices: PropTypes.array
};
