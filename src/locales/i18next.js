import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const initObj = {
  fallbackLng: 'ru',
  load: 'languageOnly',
  whitelist: ['en', 'ru'],
  debug: false,
  resources: {
    ru: {
      buttons: {
        preview: 'Просмотр',
        modalWindow: {
          close: 'Закрыть',
          readMore: 'Читать Полностью',
        },
      },
      feeds: 'Фиды',
      posts: 'Посты',
      waiting: 'Ожидание ответа...',
      errors: {
        url: 'Ссылка должна быть валидным URL',
        doubleUrl: 'RSS уже существует',
        network: 'Ошибка сети',
        unknown: 'Неизвестная ошибка',
        parser: 'Ресурс не содержит валидный RSS',
      },
      loadSuccess: 'RSS успешно загружен',
    },
    en: {
      translation: {
        buttons: {
          preview: 'View',
          modalWindow: {
            close: 'Close',
            readMore: 'Read',
          },
        },
        feeds: 'Feeds',
        posts: 'Posts',
        waiting: 'Wait for response...',
        errors: {
          url: 'Must be valid url',
          doubleUrl: 'Rss already exists',
          network: 'Network Error',
          unknown: 'Unknown error',
          parser: 'This source does not contain valid rss',
        },
        loadSuccess: 'Rss has been loaded',
      },
    },
  },
};

i18next.use(LanguageDetector);

export { i18next, initObj };
