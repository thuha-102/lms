import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { useMounted } from '../../../hooks/use-mounted';
import { useAuth } from '../../../hooks/use-auth';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { ReceiptManageListSearch } from '../../../sections/dashboard/receipt-manage/receipt-manage-list-search';
import { ReceiptManageListTable } from '../../../sections/dashboard/receipt-manage/receipt-manage-list-table';
import { ReceiptLearnerListTable } from '../../../sections/dashboard/receipt-manage/receipt-learner-list-table';
import { paymentApi } from '../../../api/payment';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      learnerName: undefined,
      isPayment: undefined,
    },
    page: 0,
    rowsPerPage: 5
  });

  return {
    search,
    updateSearch: setSearch
  };
};

const useReceipts = (user, search, reload) => {
  const isMounted = useMounted();
  // const { user } = useAuth();
  const [state, setState] = useState({
    Receipts: [],
    ReceiptsCount: 0
  });

  const getReceipts = useCallback(async () => {
    try {
        const response = user?.accountType === "ADMIN" ? await paymentApi.getReceipts(search.learnerName, search.filters.isPayment?.length !== 0 ? search.filters.isPayment : undefined)
                                                        : await paymentApi.getReceiptsByUserId(user.id, search.filters.isPayment?.length !== 0 ? search.filters.isPayment : undefined);
        if (isMounted()) {
        setState({
            Receipts: response.data,
            ReceiptsCount: response.data.length
        });
        }
        } catch (err) {
            console.error(err);
        }
    }, [search, isMounted]);

    useEffect(() => {
        getReceipts();
        },
    [search, reload]);

    return state;
};

const ReceiptList = () => {
  const { search, updateSearch } = useSearch();
  const { user } = useAuth();
  const [ reload, setReload] = useState(false);
  const { Receipts, ReceiptsCount } = useReceipts(user, search, reload);

  usePageView();

  const handleFiltersChange = useCallback((filters) => {
    updateSearch((prevState) => ({
      ...prevState,
      filters
    }));
  }, [updateSearch]);

  const handleSearchChange = useCallback((learnerName) => {
    updateSearch((prevState) => ({
      ...prevState,
      ...{
        learnerName
      }
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

  return (
    <>
      <Head>
        <title>
          Quản lý đơn hàng
        </title>
      </Head>
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
                  Quản lý đơn hàng
                </Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={paths.dashboard.index}
                    variant="subtitle2"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={paths.dashboard.receipt_manage}
                    variant="subtitle2"
                  >
                    Quản lý đơn hàng
                  </Link>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <Card>
              <ReceiptManageListSearch onFiltersChange={handleFiltersChange} onSearchChange={handleSearchChange}/>
              {user?.accountType === "ADMIN" ? <ReceiptManageListTable
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onRegisterReceipt={setReload}
                page={search.page}
                Receipts={Receipts}
                ReceiptsCount={ReceiptsCount}
                rowsPerPage={search.rowsPerPage}
              />
              : <ReceiptLearnerListTable
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onRegisterReceipt={setReload}
                page={search.page}
                Receipts={Receipts}
                ReceiptsCount={ReceiptsCount}
                rowsPerPage={search.rowsPerPage}
              />
              }
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

ReceiptList.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ReceiptList;
