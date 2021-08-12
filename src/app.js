import axios from 'axios';
import validator from './validator.js';
import rssParser from './rssParser.js';
import getNewPosts from './utils.js';
import state from './state.js';
import watchedStateWrapper from './view.js';

/* eslint-disable no-param-reassign */
const getProxyUrl = (url) => {
  const proxyURL = new URL('https://hexlet-allorigins.herokuapp.com/get');
  proxyURL.searchParams.set('disableCache', 'true');
  proxyURL.searchParams.set('url', url);
  return proxyURL.href;
};

const updatePosts = (feed, watchedState) => {
  const proxiedUrl = getProxyUrl(feed.url);
  const promise = axios.get(proxiedUrl)
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
    validator(urlData, watchedState.data.feeds)
      .then((url) => getProxyUrl(url))
      .then((proxiedUrl) => axios.get(proxiedUrl))
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

export default (i18next) => {
  const posts = document.querySelector('.posts');
  const rssForm = document.querySelector('form');
  const exampleUrl = document.querySelectorAll('.example-url');
  const watchedState = watchedStateWrapper(state, i18next);
  rssBtnHandler(rssForm, watchedState);
  postBtnHandler(posts, watchedState);
  exampleUrl.forEach((url) => exampleUrlHandler(url, watchedState));
};
