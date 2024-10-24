import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import vi from './locales/vi.json';
import jp from './locales/jp.json';

i18n
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
      jp: { translation: jp },
    },
    fallbackLng: 'vi',
    debug: true,
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
