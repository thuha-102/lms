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
import { userApi } from '../../../api/user';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { AccountManageListSearch } from '../../../sections/dashboard/account-manage/account-manage-list-search';
import { AccountManageListTable } from '../../../sections/dashboard/account-manage/account-manage-list-table';
import { applyPagination } from '../../../utils/apply-pagination';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      name: undefined,
      type: [],
      topicId: [],
      inStock: undefined
    },
    page: 0,
    rowsPerPage: 5
  });

  return {
    search,
    updateSearch: setSearch
  };
};
const useAccounts = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    Accounts: [],
    AccountsCount: 0
  });

  const getAccounts = useCallback(async () => {
    try {
      // const response = await lm_manageApi.getAccounts(search);
      const response = await userApi.getAllUser();
      let data = response.data;
      if (typeof search.filters !== 'undefined') {
        data = data.filter((lm) => {
          if (typeof search.name !== 'undefined' && search.name !== '') {
            const nameMatched = lm.name.toLowerCase().includes(search.name.toLowerCase());
  
            if (!nameMatched) {
              return false;
            }
          }
  
          // It is possible to select multiple type options
          if (typeof search.filters.type !== 'undefined' && search.filters.type.length > 0) {
            const categoryMatched = search.filters.type.includes(lm.type);
  
            if (!categoryMatched) {
              return false;
            }
          }
  
          // It is possible to select multiple topicId options
          if (typeof search.filters.topicId !== 'undefined' && search.filters.topicId.length > 0) {
            const statusMatched = search.filters.topicId.includes(lm.topicId);
  
            if (!statusMatched) {
              return false;
            }
          }
  
          // Present only if filter required
          if (typeof search.filters.inStock !== 'undefined') {
            const stockMatched = lm.inStock === search.filters.inStock;
  
            if (!stockMatched) {
              return false;
            }
          }
  
          return true;
        });
      }
  
      // if (typeof search.page !== 'undefined' && typeof search.rowsPerPage !== 'undefined') {
      //   data = applyPagination(data, search.page, search.rowsPerPage);
      // }

      if (isMounted()) {
        setState({
          Accounts: data,
          AccountsCount: data.length
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [search, isMounted]);

  useEffect(() => {
      getAccounts();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]);

  return state;
};

const AccountList = () => {
  const { search, updateSearch } = useSearch();
  const { Accounts, AccountsCount } = useAccounts(search);

  usePageView();

  const handleFiltersChange = useCallback((filters) => {
    updateSearch((prevState) => ({
      ...prevState,
      filters
    }));
  }, [updateSearch]);

  const handleSearchChange = useCallback((name) => {
    updateSearch((prevState) => {
      return {
        ...prevState,
        name
      }
  });
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
          Quản lý tài khoản
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
                  Quản lý tài khoản
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
                    href={paths.dashboard.account_manage}
                    variant="subtitle2"
                  >
                    Quản lý tài khoản
                  </Link>
                </Breadcrumbs>
              </Stack>
              {/* <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <Button
                  component={NextLink}
                  // Thay đổi đường dẫn để lưu vào db
                  href={`${paths.dashboard.lm_manage}/create`}
                  startIcon={(
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Thêm tài liệu học tập
                </Button>
              </Stack> */}
            </Stack>
            <Card>
              <AccountManageListSearch onFiltersChange={handleFiltersChange} onSearchChange={handleSearchChange}/>
              <AccountManageListTable
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={search.page}
                Accounts={Accounts}
                AccountsCount={AccountsCount}
                rowsPerPage={search.rowsPerPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

AccountList.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AccountList;
