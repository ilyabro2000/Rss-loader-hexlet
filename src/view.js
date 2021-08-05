import onChange from 'on-change';
import state from './state.js';

const input = document.querySelector('input');
const feedback = document.querySelector('.feedback');
const rssForm = document.querySelector('form');
const feedsContainer = document.querySelector('.feeds');
const postsContainer = document.querySelector('.posts');

const renderFeeds = (value) => {
  if (feedsContainer.childNodes.length === 0) {
    const feedMaintitle = document.createElement('h2');
    feedMaintitle.textContent = 'Фиды';
    feedsContainer.prepend(feedMaintitle);
    const list = document.createElement('ul');
    feedsContainer.append(list);
    list.classList.add('feeds-List');
  }
  const list = document.querySelector('.feeds-List');
  const listItem = document.createElement('li');
  const feedTitle = document.createElement('h3');
  feedTitle.textContent = value.feedTitle;

  const description = document.createElement('p');
  description.textContent = value.feedDescription;
  list.append(listItem);
  listItem.append(feedTitle);
  listItem.append(description);
};

const renderPosts = (value) => {
  if (postsContainer.childNodes.length === 0) {
    const postsMainTitle = document.createElement('h2');
    postsMainTitle.textContent = 'Посты';
    postsContainer.prepend(postsMainTitle);

    const list = document.createElement('ul');
    postsContainer.append(list);
    list.classList.add('posts-List');
  }
  const list = document.querySelector('.posts-List');
  value.forEach((item) => {
    const itemTitle = document.createElement('a');
    itemTitle.textContent = item.postTitle;
    itemTitle.href = item.link;
    itemTitle.target = '_blanc';
    itemTitle.dataset.id = item.id;

    const listItem = document.createElement('li');
    listItem.append(itemTitle);
    listItem.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0 fw-bold';

    list.append(listItem);

    const btnToModal = document.createElement('button');
    btnToModal.textContent = 'Просмотр';
    btnToModal.type = 'button';
    btnToModal.dataset.bsToggle = 'modal';
    btnToModal.dataset.bsTarget = '#modal';
    btnToModal.className = 'btn btn-outline-primary btn-sm btn-to-modal';
    btnToModal.dataset.id = item.id;
    listItem.append(btnToModal);
  });
};

const editReadPost = (post) => {
  if (post.status === 'read') {
    const readPost = document.querySelector(`[data-id='${post.id}']`);
    readPost.classList.remove('fw-bold');
    readPost.classList.add('fw-normal');
  }
};

const fillModal = (title, description, link) => {
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = title;

  const modalDescription = document.querySelector('.modal-body');
  modalDescription.textContent = description;

  const btnToLink = document.querySelector('.btn-to-link');
  btnToLink.href = link;
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'data.feeds':
      renderFeeds(value[value.length - 1]);
      break;

    case 'data.posts':
      renderPosts(value);
      value.map((item) => editReadPost(item));
      break;

    case 'form.process':
      if (value === 'success') {
        feedback.className = 'feedback m-0 position-absolute small text-success';
        input.className = 'form-control w-100 is';
        feedback.textContent = 'RSS успешно загружен';
        rssForm.reset();
        input.disabled = false;
        watchedState.form.process = null;
      } else if (value === 'waiting') {
        feedback.textContent = 'Ожидание ответа...';
        feedback.className = 'feedback m-0 position-absolute small text-warning';
        input.disabled = true;
        watchedState.form.process = null;
        input.className = 'form-control w-100 border-warning';
      } else if (value === 'error') {
        feedback.className = 'feedback m-0 position-absolute small text-danger';
        input.className = 'form-control w-100 is-invalid';
        feedback.textContent = watchedState.form.errors.message;
        input.disabled = false;
        watchedState.form.process = null;
      }
      break;
    case 'modalContent':
      fillModal(watchedState.modalContent.title,
        watchedState.modalContent.description,
        watchedState.modalContent.linkPost);
      break;
    default:
      break;
  }
  input.focus();
});
export { watchedState, fillModal };
