import { Fragment, useCallback, useState } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from '../../../components/scrollbar';
import ReceiptRegisterDialog from './receipt-register-dialog';

export const ReceiptManageListTable = (props) => {
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

  return (
    <div {...other}>
      {
        currentReceipt !== null && <ReceiptRegisterDialog open={currentReceipt !== null} setRegisterDialog={setCurrentReceipt} setReload={onRegisterReceipt} receipt={currentReceipt}/>
      }
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>
                ID
              </TableCell>
              <TableCell width="10%" align='center'>
                ID người học
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
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        textAlign={"center"}
                      >
                      {Receipt.learnerId}
                      </Typography>
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
                        {Receipt.isPayment === false ? "Đang chờ thanh toán" : "Đã thanh toán"}
                      </Typography>
                    </TableCell>

                    <TableCell align='center'>
                      <Button variant='contained' onClick={() => setCurrentReceipt(Receipt)} disabled={Receipt.isPayment === true}>
                        Đăng kí tất cả
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

ReceiptManageListTable.propTypes = {
  Receipts: PropTypes.array.isRequired,
  ReceiptsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
