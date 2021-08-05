import _ from 'lodash';
import validator from './validator.js';
import rssParser from './rssParser.js';
import { watchedState } from './view.js';
import { i18next, initObj } from './locales/i18next.js';

const app = () => {
  document.addEventListener('DOMContentLoaded', () => {
    i18next.init(initObj);
    const [detectedLanguage] = i18next.languages;
    watchedState.userLanguage = detectedLanguage;
  });

  const getNewPosts = (oldPosts, newPosts) => _.differenceBy(newPosts, oldPosts, 'title');

  const getProxyUrl = (url) => {
    const promise = fetch(`https://hexlet-allorigins.herokuapp.com/disableCache=true&get?url=${url}`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Ошибка сети');
      });
    return promise;
  };

  const updatePosts = (feeds) => {
    feeds.forEach((feed) => {
      getProxyUrl(feed.url)
        .then((xml) => {
          const parsedRss = rssParser(xml.contents);
          console.log(parsedRss.posts);
          const newPost = getNewPosts(watchedState.data.posts, parsedRss.posts);
          console.log(newPost);
          if (newPost.length > 0) watchedState.data.posts.push(newPost);
          setTimeout(() => updatePosts(feeds), 5000);
        });
    });
  };

  const rssForm = document.querySelector('form');
  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.form.process = 'waiting';
    formData.get('url-input');
    const urlData = Object.fromEntries(formData).url;
    validator(urlData, watchedState.data.feeds)
      .then((url) => getProxyUrl(url))
      .then((rssData) => {
        const parsedXml = rssParser(rssData.contents);
        const { feedTitle, feedDescription } = parsedXml;
        watchedState.data.feeds.push({ feedTitle, feedDescription, url: urlData });
        watchedState.data.posts = parsedXml.posts;
        watchedState.form.process = 'success';
        updatePosts(watchedState.data.feeds);
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
