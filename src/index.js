import axios from 'axios';
import validator from './validator.js';
import rssParser from './rssParser.js';
import getNewPosts from './utils.js';
import { watchedState } from './view.js';
import { i18next, initObj } from './locales/i18next.js';
import state from './state.js';

const getProxyUrl = (url) => {
  const proxyURL = new URL('https://hexlet-allorigins.herokuapp.com/get');
  proxyURL.searchParams.set('disableCache', 'true');
  proxyURL.searchParams.set('url', url);
  return proxyURL;
};

const updatePosts = (feeds) => {
  feeds.forEach((feed) => {
    const proxiedUrl = getProxyUrl(feed.url);
    const promise = axios.get(proxiedUrl)
      .then((response) => {
        console.log(new Date());
        const { posts } = rssParser(response.data.contents);
        const oldPosts = state.data.posts;
        const newPosts = getNewPosts(posts, oldPosts);
        watchedState.data.posts = [...newPosts, ...oldPosts];
      });
    promise.then(() => setTimeout(updatePosts, 5000, feeds));
  });
};

const rssForm = document.querySelector('form');
const rssBtnHandler = () => {
  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.form.process = 'waiting';
    formData.get('url-input');
    const urlData = Object.fromEntries(formData).url;
    validator(urlData, watchedState.data.feeds)
      .then((url) => getProxyUrl(url))
      .then((proxiedUrl) => axios.get(proxiedUrl))
      .then((response) => {
        const parsedXml = rssParser(response.data.contents);
        const { feedTitle, feedDescription, posts } = parsedXml;
        watchedState.data.feeds.push({ feedTitle, feedDescription, url: urlData });
        watchedState.data.posts = [...watchedState.data.posts, ...posts];
        watchedState.form.process = 'success';
        setTimeout(updatePosts, 5000, watchedState.data.feeds);
      })
      .catch((err) => {
        watchedState.form.errors = err;
        watchedState.form.process = 'error';
      });
  });
};

const posts = document.querySelector('.posts');
const postBtnHandler = () => {
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
          const editItem = item;
          editItem.status = 'read';
          return editItem;
        }
        return item;
      });
      watchedState.data.posts = readPost;
    }
  });
};

const app = () => {
  document.addEventListener('DOMContentLoaded', () => {
    i18next.init(initObj);
    const [detectedLanguage] = i18next.languages;
    watchedState.userLanguage = detectedLanguage;
  });

  rssBtnHandler();
  postBtnHandler();
};
export default app;
