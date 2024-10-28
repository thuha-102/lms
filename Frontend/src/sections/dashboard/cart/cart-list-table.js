import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Link,
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
import { Scrollbar } from '../../../components/scrollbar';
import { paths } from '../../../paths';
import { getInitials } from '../../../utils/get-initials';
import { userApi } from '../../../api/user';
import { useAuth } from '../../../hooks/use-auth';

const useSelectionModel = (cart, setSelectCourse) => {
  const cartIds = useMemo(() => {
    return cart.map((cart) => cart.courseId);
  }, [cart]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [cartIds]);

  const selectOne = useCallback((cartId) => {
    setSelected((prevState) => [...prevState, cartId]);
  }, []);

  const deselectOne = useCallback((cartId) => {
    setSelected((prevState) => {
      return prevState.filter((id) => id !== cartId);
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected([...cartIds]);
  }, [cartIds]);

  const deselectAll = useCallback(() => {
    setSelected([]);
  }, []);

  return {
    deselectAll,
    deselectOne,
    selectAll,
    selectOne,
    selected
  };
};

export const CartListTable = (props) => {
  const {
    open,
    cart,
    cartCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    deleteCourse,
    setPaymentCourse,
    ...other
  } = props;
  const { deselectAll, selectAll, deselectOne, selectOne, selected } = useSelectionModel(cart);

  const handleToggleAll = useCallback((event) => {
    const { checked } = event.target;

    if (checked) {
      selectAll();
      setPaymentCourse(cart.map(c => c.courseId))
    } else {
      deselectAll();
      setPaymentCourse([])
    }
    
  }, [selectAll, deselectAll]);

  const handleDeleteCourse = useCallback(async () => {
    deleteCourse(selected)
  }, [selected])

  const selectedAll = selected.length === cart.length;
  const selectedSome = selected.length > 0 && selected.length < cart.length;
  const enableBulkActions = selected.length > 0;

  return (
    <Box
      sx={{ position: 'relative' }}
      {...other}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? 'neutral.800'
              : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={handleToggleAll}
          />
          <Button
            onClick={handleDeleteCourse}
            color="error"
            variant='outlined'
            size="small"
          >
            Xóa khỏi giỏ hàng
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>
                ID
              </TableCell>
              <TableCell>
                Khóa học
              </TableCell>
              <TableCell>
                Ngày thêm vào
              </TableCell>
              <TableCell>
                Giá tiền
              </TableCell>
              <TableCell>
                Giảm giá
              </TableCell>
              <TableCell>
                Thanh toán
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((cart) => {
              const isSelected = selected.includes(cart.courseId);
              const location = `${cart.city}, ${cart.state}, ${cart.country}`;
              const totalSpent = numeral(cart.totalSpent).format(`${cart.currency}0,0.00`);

              return (
                <TableRow
                  hover
                  key={cart.courseId}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        const { checked } = event.target;

                        if (checked) {
                          selectOne(cart.courseId);
                          setPaymentCourse(pre => [...pre, cart.courseId])
                        } else {
                          deselectOne(cart.courseId);
                          setPaymentCourse((prevState) => {
                            return prevState.filter((id) => id !== cart.courseId);
                          });
                        }
                      }}
                      value={isSelected}
                    />
                  </TableCell>
                  <TableCell>
                    {cart.courseId}
                  </TableCell>
                  <TableCell>
                    {cart.courseName}
                  </TableCell>
                  <TableCell>
                    {new Date(cart.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {`${cart.price.toLocaleString('de-DE')}`}
                  </TableCell>
                  <TableCell>
                      {cart.salePercent !== 0 ? `${cart.salePercent*100}%` : "Không"}
                  </TableCell>
                  <TableCell>
                      {(cart.price*(1 - cart.salePercent)).toLocaleString('de-DE')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={cartCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

CartListTable.propTypes = {
  cart: PropTypes.array.isRequired,
  cartCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
