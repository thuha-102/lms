import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
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
import { useCallback, useEffect, useState } from 'react';
import { paymentApi } from '../../../api/payment';

export const CartInvoices = (props) => {
  const { invoices, ...other } = props;
  const totalPrice = invoices.reduce((sum, item) => sum + item.price*(1 - item.salePercent), 0)
  const [bankAccount, setBankAccount] = useState("")
  const [bankName, setBankName] = useState("")
  const [receiptId, setReceipt] = useState("")

  const getAccountBank = useCallback(async ()=> {
    const reponse = await paymentApi.getAccountBank()
    setBankAccount(reponse.data.bankAccount)
    setBankName(reponse.data.bankName)
  }, [])

  useEffect(() => {
    getAccountBank()
  }, [])

  return (
    <Card sx={{minHeight: 700, minWidth: 600}}>
      <CardHeader
        title="Thanh toán"
      />
      <CardContent>

        <Scrollbar>
          <Table sx={{ minWidth: 550}}>
            <TableHead>
              <TableRow>
                <TableCell>
                  Tên khóa học
                </TableCell>
                <TableCell align='center'>
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
                    <TableCell align='center'>
                      {(invoice.price*(1 - invoice.salePercent)).toLocaleString('de-DE')}
                    </TableCell>                 
                  </TableRow>
                );
              })}
              <TableRow sx={{ '& td': { borderBottom: 'none', fontWeight: 'bold' } }}>
                <TableCell align="right">Tổng cộng:</TableCell>
                <TableCell align='center'>{totalPrice.toLocaleString('de-DE')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Scrollbar>
      </CardContent>
      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      > 
        <Typography>Vui lòng quét QR ở dưới để thanh toán</Typography>
        <CardContent component="section" align='center'>
          <img src={`https://qr.sepay.vn/img?bank=${bankName}&acc=${bankAccount}&amount=${totalPrice}&des=DH00${1}`}/>
        </CardContent>
      </Stack>
    </Card>
  );
};

CartInvoices.propTypes = {
  invoices: PropTypes.array
};
