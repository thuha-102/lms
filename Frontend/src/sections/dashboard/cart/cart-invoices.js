import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LoopIcon from '@mui/icons-material/Loop';
import EastIcon from '@mui/icons-material/East';
import {
  Box,
  Button,
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
import Link from 'next/link';

export const CartInvoices = (props) => {
  const { invoices, loading, paymentConfirm, ...other } = props;
  const totalPrice = invoices.reduce((sum, item) => sum + item.price*(1 - item.salePercent), 0)
  const [bankAccount, setBankAccount] = useState("")
  const [bankName, setBankName] = useState("")

  const getAccountBank = useCallback(async ()=> {
    const reponse = await paymentApi.getAccountBank()
    setBankAccount(reponse.data.bankAccount)
    setBankName(reponse.data.bankName)
  }, [])

  useEffect(() => {
    getAccountBank()
  }, [])

  useEffect(() => {console.log("invoice", invoices)}, [invoices])

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
        <Stack
          direction = 'row'
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>Vui lòng quét QR ở dưới để thanh toán</Typography>
          {
            loading ? 
              <SvgIcon 
                sx={{
                  animation: "spin 2s linear infinite",
                  "@keyframes spin": {
                    "0%": {
                      transform: "rotate(360deg)",
                    },
                    "100%": {
                      transform: "rotate(0deg)",
                    },
                  },
                  height: 40,
                  width: 40
                }}
              >
                <LoopIcon />
              </SvgIcon>
            :
              <SvgIcon
                sx={{
                  color: 'green',
                  height: 40,
                  width: 40
                }}
              >
                <CheckCircleOutlineIcon/>
              </SvgIcon>
          }
        </Stack>
        {
          loading ?
            <CardContent component="section" align='center'>
              <img src={`https://qr.sepay.vn/img?bank=${bankName}&acc=${bankAccount}&amount=${totalPrice}&des=DH00${1}`}/>
              {/* <img src={`https://qr.sepay.vn/img?bank=${bankName}&acc=${bankAccount}&amount=${totalPrice}&des=TKPSEP`}/> */}
            </CardContent>
          :
            <Link
                component={NextLink}
                href={paths.dashboard.academy.index}
                underline="none"
            >
              <Button 
                variant="contained"
                sx={{
                  marginTop: 5
                }}
                endIcon={(
                <SvgIcon>
                    <EastIcon/>
                </SvgIcon>
                )}
              >
                    Trải nghiệm các khóa học của bạn
              </Button>
            </Link>
        }
      </Stack>
    </Card>
  );
};

CartInvoices.propTypes = {
  invoices: PropTypes.array
};
