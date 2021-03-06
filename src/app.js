import axios from 'axios';
import i18next from 'i18next';
import validator from './validator.js';
import rssParser from './rssParser.js';
import getNewPosts from './utils.js';
import render from './view.js';
import options from './locales/i18next.js';

/* eslint-disable no-param-reassign */
const getProxyUrl = (url) => {
  const proxyURL = new URL('https://hexlet-allorigins.herokuapp.com/get');
  proxyURL.searchParams.set('disableCache', 'true');
  proxyURL.searchParams.set('url', url);
  return proxyURL.href;
};

const toRequest = (url) => {
  const promise = axios.get(url)
    .then((resolve) => {
      if (resolve.data === undefined) {
        throw new Error('Ошибка сети');
      }
      return resolve;
    });
  return promise;
};

const updatePosts = (feed, watchedState) => {
  const proxiedUrl = getProxyUrl(feed.url);
  const promise = toRequest(proxiedUrl)
    .then((response) => {
      const { posts } = rssParser(response.data.contents);
      const oldPosts = watchedState.data.posts;
      const newPosts = getNewPosts(posts, oldPosts);
      watchedState.data.posts = [...newPosts, ...oldPosts];
    });
  promise.then(() => setTimeout(updatePosts, 5000, feed, watchedState));
};

const rssBtnHandler = (target, watchedState) => {
  target.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.get('url-input');
    const urlData = Object.fromEntries(formData).url;
    watchedState.form.process = 'waiting';
    validator(urlData, watchedState.data.feeds)
      .then((url) => getProxyUrl(url))
      .then((proxiedUrl) => toRequest(proxiedUrl))
      .then((response) => {
        const parsedXml = rssParser(response.data.contents);
        const { feedTitle, feedDescription, posts } = parsedXml;
        watchedState.data.feeds.push({ feedTitle, feedDescription, url: urlData });
        watchedState.data.posts = [...watchedState.data.posts, ...posts];
        watchedState.form.process = 'success';
        watchedState.data.feeds
          .forEach((feed) => setTimeout(updatePosts, 5000, feed, watchedState));
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          err.message = 'Ошибка сети';
        }
        watchedState.form.errors = err;
        watchedState.form.process = 'error';
      });
  });
};

const readPost = (posts, id) => {
  posts.map((item) => {
    if (item.id === id) {
      const editItem = item;
      editItem.status = 'read';
      return editItem;
    }
    return item;
  });
};

const exampleUrlHandler = (item, watchedState) => {
  item.addEventListener('click', (e) => {
    watchedState.form.value = e.target.textContent;
  });
};

const postBtnHandler = (target, watchedState) => {
  target.addEventListener('click', (e) => {
    if (e.target.className.includes('btn-to-modal')) {
      const id = e.target.getAttribute('data-id');
      const postProxy = watchedState.data.posts.filter((item) => (item.id === id));
      const [post] = postProxy;
      const title = post.postTitle;
      const description = post.postDescription;
      const linkPost = post.link;
      watchedState.modalContent = { title, description, linkPost };
      readPost(watchedState.data.posts, id);
    } else if (e.target.className.includes('item-title-link')) {
      const id = e.target.getAttribute('data-id');
      readPost(watchedState.data.posts, id);
    }
  });
};

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init(options)
    .then((translate) => {
      const state = {
        userLanguage: 'ru',
        modalContent: {},
        form: {
          process: null,
          errors: null,
          value: null,
        },
        data: {
          feeds: [],
          posts: [],
        },
      };
      const posts = document.querySelector('.posts');
      const rssForm = document.querySelector('form');
      const exampleUrl = document.querySelectorAll('.example-url');
      const view = render(state, translate);
      rssBtnHandler(rssForm, view);
      postBtnHandler(posts, view);
      exampleUrl.forEach((url) => exampleUrlHandler(url, view));
    });
};
