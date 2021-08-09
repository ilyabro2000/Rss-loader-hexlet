import onChange from 'on-change';
import state from './state.js';
import getNewPosts from './utils.js';
import { i18next } from './locales/i18next.js';

const renderSection = () => {
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');
  const feedMaintitle = document.createElement('h2');
  feedMaintitle.textContent = i18next.t('Фиды');
  feedsContainer.prepend(feedMaintitle);
  const listFeeds = document.createElement('ul');
  feedsContainer.append(listFeeds);

  const postsMainTitle = document.createElement('h2');
  postsMainTitle.textContent = i18next.t('Посты');
  postsContainer.prepend(postsMainTitle);
  const listPosts = document.createElement('ul');
  postsContainer.append(listPosts);
};

const renderFeeds = (data) => {
  const feedsContainer = document.querySelector('.feeds');
  const list = feedsContainer.querySelector('ul');
  const listItem = document.createElement('li');
  listItem.className = 'm-0, border-bottom';
  const feedTitle = document.createElement('h3');
  feedTitle.textContent = data.feedTitle;

  const description = document.createElement('p');
  description.textContent = data.feedDescription;
  list.append(listItem);
  listItem.append(feedTitle);
  listItem.append(description);
};

const renderPosts = (posts, oldPosts) => {
  const newPosts = getNewPosts(posts, oldPosts);
  const postsContainer = document.querySelector('.posts');
  newPosts.reverse()
    .forEach((newPost) => {
      const listPosts = postsContainer.querySelector('ul');
      const itemTitle = document.createElement('a');
      itemTitle.classList.add('item-title-link');
      itemTitle.textContent = newPost.postTitle;
      itemTitle.href = newPost.link;
      itemTitle.target = '_blanc';
      itemTitle.dataset.id = newPost.id;

      const listItem = document.createElement('li');
      listItem.append(itemTitle);
      listItem.className = 'list-group-item d-flex justify-content-between align-items-middle border-1 border-end-1 fw-bold ';

      listPosts.prepend(listItem);
      listPosts.classList.add('p-0');

      const btnToModal = document.createElement('button');
      btnToModal.textContent = i18next.t('Просмотр');
      btnToModal.type = 'button';
      btnToModal.dataset.bsToggle = 'modal';
      btnToModal.dataset.bsTarget = '#modal';
      btnToModal.className = 'btn btn-outline-primary btn-sm btn-to-modal btn-to-modal';
      btnToModal.dataset.id = newPost.id;
      listItem.append(btnToModal);
    });
};

const editReadPost = (post) => {
  if (post.status === 'read') {
    const readPost = document.querySelector(`[data-id='${post.id}']`);
    readPost.classList.remove('fw-bold');
    readPost.classList.add('fw-normal', 'read');
  }
};

const changeInputvalue = (value) => {
  const input = document.querySelector('input');
  input.value = value;
};

const fillModal = (title, description, link) => {
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = title;

  const modalDescription = document.querySelector('.modal-body');
  modalDescription.textContent = description;

  const btnToLink = document.querySelector('.btn-to-link');
  btnToLink.href = link;
};

const renderForm = (value, errors) => {
  const feedback = document.querySelector('.feedback');
  const input = document.querySelector('input');
  const rssForm = document.querySelector('form');
  if (value === 'success') {
    feedback.className = 'feedback mt-1 position-absolute small text-success-custom';
    input.className = 'form-control w-100 is';
    feedback.textContent = i18next.t('RSS успешно загружен');
    rssForm.reset();
    input.disabled = false;
  } else if (value === 'waiting') {
    feedback.textContent = i18next.t('Ожидание ответа...');
    feedback.className = 'feedback mt-1 position-absolute small text-warning-custom';
    input.disabled = true;
    input.className = 'form-control w-100 border-warning';
  } else if (value === 'error') {
    feedback.className = 'feedback mt-1 position-absolute small text-danger-custom';
    input.className = 'form-control w-100 is-invalid';
    feedback.textContent = i18next.t(errors.message);
    input.disabled = false;
    input.focus();
  }
};

const watchedState = onChange(state, (path, value, prevValue) => {
  switch (path) {
    case 'data.feeds':
      if (watchedState.data.feeds.length === 1) {
        renderSection();
      }
      renderFeeds(value[value.length - 1]);
      break;

    case 'data.posts':
      renderPosts(value, prevValue);
      value.forEach((post) => editReadPost(post));
      break;

    case 'form.process':
      renderForm(value, watchedState.form.errors);
      break;
    case 'modalContent':
      fillModal(watchedState.modalContent.title,
        watchedState.modalContent.description,
        watchedState.modalContent.linkPost);
      break;
    case 'form.value':
      changeInputvalue(value);
      break;
    default:
      break;
  }
});
export { watchedState, fillModal };
