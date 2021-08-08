import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ru from './ru.json';

const initObj = {
  lng: 'ru',
  debug: false,
  resources: {
    ru,
  },
};

i18next.use(LanguageDetector);

export { i18next, initObj };
