import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Container, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { AccountGeneralSettings } from '../../sections/dashboard/account/account-general-settings';
import { useAuth } from '../../hooks/use-auth';
import { userApi } from '../../api/user';
import { BankSettings } from '../../sections/dashboard/account/account-bank-settings';
import { paymentApi } from '../../api/payment';
import { useMounted } from '../../hooks/use-mounted';

const now = new Date();

const Page = () => {
  const { user } = useAuth()
  const isMounted = useMounted();
  const [currentTab, setCurrentTab] = useState('general');
  const [userInfor, setUserInfor] = useState(null)
  const [bankInfor, setBankInfor] = useState(true)

  const getUser = useCallback(async () => {
    const response = await userApi.getUser(user?.id)
    setUserInfor(response.data)
  }, [])

  const getBankInfor = useCallback(async () => {
    const response = await paymentApi.getAccountBank()
    setBankInfor(response.data)
  }, [])

  useEffect(()=> {
    getUser()
    getBankInfor()
  }, [])

  const handleUserChangeInfor = useCallback(async (request) => {
    await userApi.updateUser(user.id, request)
  }, [])

  const handleBankChangeInfor = useCallback(async (request) => {
    await paymentApi.updateAccountbank(request)
  }, [])

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
        <Container maxWidth="xl" >
          <Stack spacing={3}>
            <Stack
              spacing={3}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Thông tin cá nhân
              </Typography>
              
            </Stack>
            {
              userInfor && <AccountGeneralSettings
                avatar={'/assets/avatars/avatar-anika-visser.png'}
                user = {userInfor}
                updateInfor = {handleUserChangeInfor}
            />
            }
            {
              <BankSettings
                bank = {bankInfor}
                setBankInfor = {setBankInfor}
                updateInfor = {handleBankChangeInfor}
              />
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
