import Head from 'next/head';
import { addDays, subDays, subHours, subMinutes } from 'date-fns';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Avatar
} from '@mui/material';
import { usePageView } from '../../../hooks/use-page-view';
import { useSettings } from '../../../hooks/use-settings';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { userApi } from '../../../api/user';
import { useAuth } from '../../../hooks/use-auth';
import { useMounted } from '../../../hooks/use-mounted';
import { useCallback, useEffect, useState } from 'react';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import { blueGrey } from '@mui/material/colors';

const useProfile = () => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [profile, setProfile] = useState(null);

  const getProfile = useCallback(async () => {
    try {
      const response = await userApi.getUser(user.id);

      if (isMounted()) {
        setProfile(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getProfile();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  return profile;
};

const Page = () => {
  const profile = useProfile();
  console.log(profile)
  const settings = useSettings();

  usePageView();

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
        <Stack>
          <Container maxWidth="lg">
            <Box
              
              style={{ backgroundImage: `url(${profile?.cover ? profile.cover : '/assets/covers/abstract-1-4x3-large.png' })` }}
              sx={{
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                borderRadius: 1,
                height: 348,
                position: 'relative',
                '&:hover': {
                  '& button': {
                    visibility: 'visible'
                  }
                }
              }}
            />
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ mt: 5 }}
            >
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
              >
                <Avatar
                  src={profile?.avatar ? profile.avatar : '/assets/avatars/avatar-anika-visser.png'}
                  sx={{
                    height: 64,
                    width: 64
                  }}
                />
                <div>
                  <Typography
                    color="text.secondary"
                    variant="overline"
                  >
                    {/* {profile.bio} */}
                  </Typography>
                  <Typography variant="h6">
                    {profile?.name}
                  </Typography>
                </div>
              </Stack>
            </Stack>
          </Container>

        </Stack>
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
