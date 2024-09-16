import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './translations/en';
import { de } from './translations/de';
import { es } from './translations/es';
import { vn } from './translations/vn';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      vn: { translation: vn }
    },
    lng: 'vn',
    fallbackLng: 'vn',
    interpolation: {
      escapeValue: false
    }
  });
