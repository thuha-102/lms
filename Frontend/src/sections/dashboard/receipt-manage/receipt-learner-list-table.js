import { Fragment, useCallback, useEffect, useState } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';
import {
  Box,
  Button,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from '../../../components/scrollbar';
import { CartInvoices } from '../cart/cart-invoices';

export const ReceiptLearnerListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    onRegisterReceipt,
    page,
    Receipts,
    ReceiptsCount,
    rowsPerPage,
    ...other
  } = props;
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const socket = io(`${process.env.NEXT_PUBLIC_SERVER_API}`);
  const [loading, setLoading] = useState(true);

  const handleClose = () => setCurrentReceipt(null);

  const paymentConfirm = useCallback(() => {
        socket.on('payment', (receipt) => {
            if (currentReceipt.id && receipt.id === currentReceipt.id) {
                setLoading(false)
            }
        });

        return () => {
            socket.off('payment');
        };
    }, [currentReceipt])

    useEffect(() => {
        paymentConfirm()
    }, [currentReceipt !== null]);

  useEffect(() => {console.log(currentReceipt)}, [currentReceipt]);

  return (
    <div {...other}>
      {
          currentReceipt && 
              <Dialog
                  open={currentReceipt !== null}
                  onClose={handleClose}
              >
                  <Box>
                      <CartInvoices
                          invoices={currentReceipt.courses.map(course => ({courseName: course.name, price: course.price, salePercent: course.salePercent}))}                          
                          loading={loading}
                          receiptId={`${currentReceipt.id}`.padStart(3, '0')}
                          paymentConfirm={paymentConfirm}
                      />
                  </Box>
              </Dialog>
      }
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>
                ID
              </TableCell>
              <TableCell width="40%" align='center'>
                Thông tin các khóa học
              </TableCell>
              <TableCell align='center'>
                Ngày tạo
              </TableCell>
              <TableCell align='center'>
                Trạng thái thanh toán
              </TableCell>
              <TableCell align='center'>
                Đăng kí thủ công
              </TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {Receipts.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage)
            .map((Receipt) => {
              return (
                <Fragment key={Receipt.id}>
                  <TableRow
                    hover
                    key={Receipt.id}
                  >
                    <TableCell width="5%" align='center'>
                      {Receipt.id}
                    </TableCell>
                    <TableCell>
                      <Box border={'1px solid'} borderRadius={2}>
                        <Table>
                          <TableBody>
                          {
                            Receipt.courses.map(course => (
                              <TableRow key={course.id}>
                                <TableCell width="40%" align='center'>{course.id}</TableCell>
                                <TableCell width="40%" align='center'>
                                  {course.name}
                                </TableCell>
                              </TableRow>
                            ))
                          }
                          </TableBody>
                        </Table>
                      </Box>
                    </TableCell>
                    <TableCell align='center'>
                      {Receipt.createdAt}
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        textAlign={"center"}
                      >
                        {Receipt.isPayment === false ? "Đang chờ thanh toán" : ( Receipt.note === "" ? "Đã thanh toán" : "Không thể thực thiện")}
                      </Typography>
                    </TableCell>

                    <TableCell align='center'>
                      <Button variant='contained' onClick={() => setCurrentReceipt(Receipt)} disabled={Receipt.isPayment === true}>
                        Thanh toán lại
                      </Button>
                    </TableCell>

                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={ReceiptsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

ReceiptLearnerListTable.propTypes = {
  Receipts: PropTypes.array.isRequired,
  ReceiptsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
