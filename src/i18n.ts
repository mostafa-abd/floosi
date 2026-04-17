import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

// Initialize with I18nManager as default, will be overridden once persisted language loads
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    lng: I18nManager.isRTL ? 'ar' : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    react: {
      useSuspense: false,
    }
  });

// Load persisted language and sync i18n + I18nManager
AsyncStorage.getItem('app-storage').then((data) => {
  if (data) {
    try {
      const parsed = JSON.parse(data);
      const storedLang = parsed?.state?.language;
      if (storedLang && storedLang !== i18n.language) {
        const isAr = storedLang === 'ar';
        i18n.changeLanguage(storedLang);
        if (I18nManager.isRTL !== isAr) {
          I18nManager.allowRTL(isAr);
          I18nManager.forceRTL(isAr);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
}).catch(() => {});

export default i18n;
