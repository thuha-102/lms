import { useEffect } from 'react';
import Head from 'next/head';
import { Provider as ReduxProvider } from 'react-redux';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { RTL } from '../components/rtl';
import { SplashScreen } from '../components/splash-screen';
import { Toaster } from '../components/toaster';
import { SettingsConsumer, SettingsProvider } from '../contexts/settings-context';
import { ChatbotConsumer, ChatbotProvider } from '../contexts/chatbot-context';
import { AuthConsumer, AuthProvider } from '../contexts/used-auth/jwt-context';
import { gtmConfig } from '../config';
import { gtm } from '../libs/gtm';
import { store } from '../store';
import { createTheme } from '../theme';
import { createEmotionCache } from '../utils/create-emotion-cache';
// Remove if nprogress is not used
import '../libs/nprogress';
// Remove if mapbox is not used
import '../libs/mapbox';
// Remove if locales are not used
import '../locales/i18n';
import { SettingsButton } from '../components/settings-button';  
import { SettingsDrawer } from '../components/settings-drawer';
import { ChatbotButton } from '../components/chatbot-button';
import { ChatbotDrawer } from '../components/chatbot-drawer';

const clientSideEmotionCache = createEmotionCache();

const useAnalytics = () => {
  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);
};

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useAnalytics();

  const getLayout = Component.getLayout ?? ((page) => page);
  // console.log('-------------------')
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        {/* <title>
          Devias Kit PRO
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        /> */}
      </Head>
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <AuthConsumer>
              {(auth) => (
                <ChatbotProvider>
                  <ChatbotConsumer>
                    {(chatbot) => {
                      if (!chatbot.isInitialized) {
                      }
                      return (
                        <SettingsProvider>
                          <SettingsConsumer>
                            {(settings) => {
                              // Prevent theme flicker when restoring custom settings from browser storage
                              if (!settings.isInitialized) {
                                // return null;
                              }

                              const theme = createTheme({
                                colorPreset: settings.colorPreset,
                                contrast: settings.contrast,
                                direction: settings.direction,
                                paletteMode: settings.paletteMode,
                                responsiveFontSizes: settings.responsiveFontSizes
                              });

                              // Prevent guards from redirecting
                              const showSlashScreen = !auth.isInitialized;

                              return (
                                <ThemeProvider theme={theme}>
                                  <Head>
                                    <meta
                                      name="color-scheme"
                                      content={settings.paletteMode}
                                    />
                                    <meta
                                      name="theme-color"
                                      content={theme.palette.neutral[900]}
                                    />
                                  </Head>
                                  <RTL direction={settings.direction}>
                                    <CssBaseline />
                                    {showSlashScreen
                                      ? <SplashScreen />
                                      : (
                                        <>
                                          {getLayout(
                                            <Component {...pageProps} />
                                          )}     
                                          <ChatbotButton onClick={chatbot.handleDrawerOpen} />
                                          <SettingsButton onClick={settings.handleDrawerOpen} />
                                          <ChatbotDrawer
                                            onClose={chatbot.handleDrawerClose}
                                            onOpen={chatbot.handleDrawerOpen}
                                            onUpdate={chatbot.handleUpdate}
                                            open={chatbot.openDrawer}
                                            values={{
                                              chatContent: chatbot.chatContent,
                                              recommendQues: chatbot.recommendQues,
                                              conversationId: chatbot.conversationId
                                            }}
                                          />
                                          <SettingsDrawer
                                            canReset={settings.isCustom}
                                            onClose={settings.handleDrawerClose}
                                            onReset={settings.handleReset}
                                            onUpdate={settings.handleUpdate}
                                            open={settings.openDrawer}
                                            values={{
                                              colorPreset: settings.colorPreset,
                                              contrast: settings.contrast,
                                              direction: settings.direction,
                                              paletteMode: settings.paletteMode,
                                              responsiveFontSizes: settings.responsiveFontSizes,
                                              stretch: settings.stretch,
                                              layout: settings.layout,
                                              navColor: settings.navColor
                                            }}
                                          />
                                        </>
                                      )}
                                    <Toaster />
                                  </RTL>
                                </ThemeProvider>
                              );
                            }}
                          </SettingsConsumer>
                        </SettingsProvider>
                      )
                    }}
                  </ChatbotConsumer>
                </ChatbotProvider>
              )}
            </AuthConsumer>
          </AuthProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};

export default App;
