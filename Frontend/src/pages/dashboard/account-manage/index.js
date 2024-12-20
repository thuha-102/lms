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

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      name: undefined,
      // type: [],
      // topicId: [],
      // inStock: undefined
    },
    page: 0,
    rowsPerPage: 5
  });

  return {
    search,
    updateSearch: setSearch
  };
};
const useAccounts = (search, deleteAccount) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    Accounts: [],
    AccountsCount: 0
  });

  const getAccounts = useCallback(async () => {
    try {
      // const response = await lm_manageApi.getAccounts(search);
      const response = await userApi.getAllUser(search.name);
      console.log("hejhejhejh")
      let data = response.data;

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
    [search, deleteAccount]);

  return state;
};

const AccountList = () => {
  const { search, updateSearch } = useSearch();
  const [deleteAccount, setDeleteAccount] = useState(null)
  const { Accounts, AccountsCount } = useAccounts(search, deleteAccount);

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

  const handleDeleteAccount = useCallback((accountId) => {
    if (accountId) setDeleteAccount(accountId)
  }, [])

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
            </Stack>
            <Card>
              <AccountManageListSearch onFiltersChange={handleFiltersChange} onSearchChange={handleSearchChange}/>
              <AccountManageListTable
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onDeleteAccount={handleDeleteAccount}
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
