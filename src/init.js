import i18next from 'i18next';
import options from './locales/i18next.js';
import app from './app.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init(options);
  app(i18nextInstance);
};
