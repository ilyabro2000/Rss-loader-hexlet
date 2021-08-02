import validator from './validator.js';
import rssParser from './rssParser.js';
import { fillModal, watchedState } from './view.js';

const app = () => {
  const rssForm = document.querySelector('form');
  const posts = document.querySelector('.posts');

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.get('url-input');
    const urlData = Object.fromEntries(formData).url;
    validator(urlData, watchedState.data.feeds)
      .then((resolve) => {
        if (resolve) {
          fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(resolve)}`)
            .then((response) => {
              if (response.ok) return response.json();
              throw new Error('Невалидный запрос');
            })
            .then((data) => rssParser(data.contents))
            .then((data) => {
              const { feedTitle, feedDescription } = data;
              watchedState.data.feeds.push({ feedTitle, feedDescription, url: resolve });
              watchedState.form.isValid = true;
              watchedState.data.posts = data.posts;
            });
        }
      })
      .catch((err) => {
        watchedState.form.errors = err;
        watchedState.form.isValid = false;
      });
  });
  posts.addEventListener('click', (e) => {
    if (e.target.className.includes('btn-to-modal')) {
      const id = e.target.getAttribute('data-id');
      const postProxy = watchedState.data.posts.filter((item) => item.id === id);
      const [post] = postProxy;
      fillModal(post.postTitle, post.postDescription, post.id);
    }
  });
};
export default app;
