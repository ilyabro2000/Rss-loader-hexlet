import axios from 'axios';
import onChange from 'on-change';
import state from './state.js';
import rssParser from './rssParser';

const input = document.querySelector('input');
const feedback = document.querySelector('.feedback');
const rssForm = document.querySelector('form');
const feedsContainer = document.querySelector('.feeds');

const renderFeed = (url) => {
  const getParsedData = fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Невалидный запрос');
    })
    .then((data) => rssParser(data.contents));

  if (feedsContainer.childNodes.length === 0) {
    const feedMaintitle = document.createElement('h2');
    feedMaintitle.textContent = 'Фиды';
    feedsContainer.prepend(feedMaintitle);
    const list = document.createElement('ul');
    feedsContainer.append(list);
  }
  const list = document.querySelector('ul');
  getParsedData.then((feed) => {
    const listItem = document.createElement('li');
    const feedTitle = document.createElement('h3');
    feedTitle.textContent = feed.feedTitle;

    const description = document.createElement('p');
    description.textContent = feed.feedDescription;
    list.append(listItem);
    listItem.append(feedTitle);
    listItem.append(description);
  });
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'data.feeds':
      console.log(value);
      renderFeed(value[0]);
      break;

    case 'form.errors':
      feedback.className = 'feedback m-0 position-absolute small text-danger';
      input.className = 'form-control w-100 is-invalid';
      feedback.textContent = value;
      break;

    case 'form.isValid':
      if (value) {
        feedback.className = 'feedback m-0 position-absolute small text-success';
        input.className = 'form-control w-100 is';
        feedback.textContent = 'RSS успешно загружен';
        rssForm.reset();
      }
      break;
    default:
      break;
  }
  input.focus();
});
export default watchedState;
