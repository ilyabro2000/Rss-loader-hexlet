import validator from './validator.js';
import rssParser from './rssParser.js';
import { watchedState } from './view.js';

const app = () => {
  const rssForm = document.querySelector('form');
  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.form.process = 'waiting';
    formData.get('url-input');
    const urlData = Object.fromEntries(formData).url;
    validator(urlData, watchedState.data.feeds)
      .then((resolve) => fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(resolve)}`))
      .then((response) => {
        if (response.ok) return response.json();
        watchedState.form.errors = 'Невалидный запрос';
        throw new Error('Невалидный запрос');
      })
      .then((data) => rssParser(data.contents))
      .then((data) => {
        const { feedTitle, feedDescription } = data;
        watchedState.data.feeds.push({ feedTitle, feedDescription, url: urlData });
        watchedState.data.posts = data.posts;
        watchedState.form.process = 'success';
      })
      .catch((err) => {
        watchedState.form.errors = err;
        watchedState.form.process = 'error';
      });
  });

  const posts = document.querySelector('.posts');
  posts.addEventListener('click', (e) => {
    if (e.target.className.includes('btn-to-modal')) {
      const id = e.target.getAttribute('data-id');
      const postProxy = watchedState.data.posts.filter((item) => (item.id === id));
      const [post] = postProxy;
      const title = post.postTitle;
      const description = post.postDescription;
      const linkPost = post.link;
      watchedState.modalContent = { title, description, linkPost };

      const readPost = watchedState.data.posts.map((item) => {
        if (item.id === id) {
          const tmpItem = item;
          tmpItem.status = 'read';
          return tmpItem;
        }
        return item;
      });
      watchedState.data.posts = readPost;
    }
  });
};
export default app;
