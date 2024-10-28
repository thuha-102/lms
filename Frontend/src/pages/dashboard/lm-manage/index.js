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
import { lm_manageApi } from '../../../api/lm-manage';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { LMManageListSearch } from '../../../sections/dashboard/lm-manage/lm-manage-list-search';
import { LMManageListTable } from '../../../sections/dashboard/lm-manage/lm-manage-list-table';
import { applyPagination } from '../../../utils/apply-pagination';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      name: undefined,
      type: [],
      used: 'all'
    },
    page: 0,
    rowsPerPage: 5
  });

  return {
    search,
    updateSearch: setSearch
  };
};
const useLMs = (search, deleteSucess) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    LMs: [],
    LMsCount: 0
  });

  const getLMs = useCallback(async () => {
    try {
      // const response = await lm_manageApi.getLMs(search);
      console.log(search)
      const response = await lm_manageApi.getLMs(search.name, search.filters.type, search.filters.used);
      let data = response.data;

      if (isMounted()) {
        setState({
          LMs: data,
          LMsCount: data.length
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [search, isMounted]);

  useEffect(() => {
      getLMs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search, deleteSucess]);

  return state;
};

const LMList = () => {
  const { search, updateSearch } = useSearch();
  const [deleteSucess, setDeleteSuccess] = useState(false)
  const { LMs, LMsCount } = useLMs(search, deleteSucess);

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

  const handleDeleteLM = useCallback((lmId) => {
    setDeleteSuccess(lmId)
  }, [])

  return (
    <>
      <Head>
        <title>
          Quản lý tài liệu học tập
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
                  Quản lý tài liệu học tập
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
                    href={paths.dashboard.lm_manage}
                    variant="subtitle2"
                  >
                    Quản lý tài liệu học tập
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
              <LMManageListSearch onFiltersChange={handleFiltersChange} onSearchChange={handleSearchChange}/>
              <LMManageListTable
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onDelete={handleDeleteLM}
                page={search.page}
                LMs={LMs}
                LMsCount={LMsCount}
                rowsPerPage={search.rowsPerPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

LMList.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default LMList;
