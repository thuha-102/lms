import { useCallback, useState } from 'react';
import Head from 'next/head';
import { Box, Container, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { AccountGeneralSettings } from '../../sections/dashboard/account/account-general-settings';
import { useAuth } from '../../hooks/use-auth';

const now = new Date();

const Page = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('general');

  usePageView();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Head>
        <title>
          Thông tin cá nhân
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
          <Stack
            spacing={3}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4">
              Thông tin cá nhân
            </Typography>
            
          </Stack>
          <AccountGeneralSettings
              avatar={'/assets/avatars/avatar-anika-visser.png'}
              user = {user}
              email=''
              name=''
            />
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
