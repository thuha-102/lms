import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useSettings } from '../../hooks/use-settings';
import { HorizontalLayout } from './horizontal-layout';
import { VerticalLayout } from './vertical-layout';
import { getSections } from './config';
import { withAuthGuard } from '../../hocs/with-auth-guard';
import { useAuth } from '../../hooks/use-auth';

const useTranslatedSections = () => {
  const { t } = useTranslation();
  const { user } = useAuth()
  return useMemo(() => getSections(t, user.accountType), [t]);  
};

export const Layout = withAuthGuard((props) => {
  const settings = useSettings();
  const sections = useTranslatedSections();
  
  if (settings.layout === 'horizontal') {
    return (
      <HorizontalLayout
        sections={sections}
        navColor={settings.navColor}
        {...props} />
    );
  }

  return (
    <VerticalLayout
      sections={sections}
      navColor={settings.navColor}
      {...props} />
  );
});

Layout.propTypes = {
  children: PropTypes.node
};
