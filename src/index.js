import validator from './validator.js';
import watchedState from './view.js';

const rssForm = document.querySelector('form');

const app = () => {
  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.get('url-input');
    const urlData = Object.fromEntries(formData).url;
    validator(urlData, watchedState.data.feeds)
      .then((resolve) => {
        if (resolve) {
          watchedState.data.feeds.push(urlData);
          watchedState.form.isValid = true;
        }
      })
      .catch((err) => {
        watchedState.form.errors = err;
        watchedState.form.isValid = false;
      });
  });
};
export default app;
