import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import PaymentIcon from '@mui/icons-material/Payment';
import EastIcon from '@mui/icons-material/East';
import { Box, Button, Card, Container, Dialog, Link, Stack, SvgIcon, Typography } from '@mui/material';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { CartListTable } from '../../../sections/dashboard/cart/cart-list-table';
import { userApi } from '../../../api/user';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';
import { CartInvoices } from '../../../sections/dashboard/cart/cart-invoices';

const useSearch = () => {
    const [search, setSearch] = useState({
        filters: {
            name: ""
        },
        page: 0,
        rowsPerPage: 5,
        sortBy: 'updatedAt',
        sortDir: 'desc'
    });

    return {
        search,
        updateSearch: setSearch
    };
};

const useCart = (userId, search, deleted) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        cart: [],
        cartCount: 0
    });

    const getCart = useCallback(async () => {
        try {
        const response = await userApi.getCart(userId);

        if (isMounted()) {
            setState({
            cart: response.data,
            cartCount: response.data.length
            });
        }
        } catch (err) {
        console.error(err);
        }
    }, [userId, search, isMounted]);

    useEffect(() => {
        getCart();
        },
    [userId, search, deleted]);

    return state;
};

const Page = () => {
    const { user } = useAuth()
    const { search, updateSearch } = useSearch();
    const { cart, cartCount } = useCart(user.id, search);

    const [open, setOpen] = useState(false)
    const [paymentCourse, setPaymentCourse] = useState([])

    usePageView();

    const handleFiltersChange = useCallback((filters) => {
        updateSearch((prevState) => ({
        ...prevState,
        filters
        }));
    }, [updateSearch]);

    const handleSortChange = useCallback((sort) => {
        updateSearch((prevState) => ({
        ...prevState,
        sortBy: sort.sortBy,
        sortDir: sort.sortDir
        }));
    }, [updateSearch]);

    const handlePageChange = useCallback((event, page) => {
        updateSearch((prevState) => ({
        ...prevState,
        page
        }));
    }, [updateSearch]);

    const handleRowsPerPageChange = useCallback((event) => {
        updateSearch((prevState) => ({
        ...prevState,
        rowsPerPage: parseInt(event.target.value, 10)
        }));
    }, [updateSearch]);

    const handleDeleteCourse = useCallback(async (courseIds) => {
        await userApi.deleteCart(user.id, courseIds)
        updateSearch((prevState) => ({
        ...prevState
        }));
    }, [user])

    const handlePayment = useCallback(async () => {
        if (paymentCourse.length !== 0) setOpen(true)
    }, [paymentCourse])

    const handleClose = () => setOpen(false)

    return (
        <>
        <Head>
            <title>
            Trang giỏ hàng
            </title>
        </Head>
        {
            open && 
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <Box>
                        <CartInvoices invoices={cart.filter(_c => paymentCourse.includes(_c.courseId))}/>
                    </Box>
                </Dialog>
        }
        <Box
            component="main"
            sx={{
            flexGrow: 1,
            py: 8
            }}
        >   
            <Container maxWidth="xl">
            <Stack spacing={4}>
                <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
                >
                <Stack spacing={1}>
                    <Typography variant="h4">
                        Giỏ hàng
                    </Typography>
                </Stack>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={3}
                >
                    <Button
                        onClick={handlePayment}
                        startIcon={(
                            <SvgIcon>
                            <PaymentIcon />
                            </SvgIcon>
                        )}
                        variant="contained"
                    >
                        Thanh toán
                    </Button>
                </Stack>
                </Stack>
                {
                    cartCount === 0 ?
                    <Stack spacing={3} sx={{justifyContent: 'flex-start', alignItems: 'center'}} direction='row'>
                        <Typography>Bạn chưa có khóa học nào trong giỏ hàng. </Typography>
                        <Button 
                            endIcon={(
                            <SvgIcon>
                                <EastIcon/>
                            </SvgIcon>
                            )}
                        >
                            <Link
                                component={NextLink}
                                href={paths.dashboard.explore}
                                underline="none"
                                variant="contained"
                            >
                                Khám phá thêm
                            </Link>
                        </Button>
                    </Stack>
                    :
                    <Card>
                        
                        {/* <CartListSearch
                            onFiltersChange={handleFiltersChange}
                            onSortChange={handleSortChange}
                            sortBy={search.sortBy}
                            sortDir={search.sortDir}
                        /> */}
                        <CartListTable
                            cart={cart}
                            cartCount={cartCount}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPage={search.rowsPerPage}
                            deleteCourse={handleDeleteCourse}
                            setPaymentCourse={setPaymentCourse}
                            page={search.page}
                        />
                    </Card>
                }
            </Stack>
            </Container>
        </Box>
        </>
    );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
