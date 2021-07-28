import onChange from 'on-change';
import state from './state.js';

const input = document.querySelector('input');
const feedback = document.querySelector('.feedback');
const rssForm = document.querySelector('form');

const watchedState = onChange(state, (path, value) => {
  if (value === true) {
    feedback.className = 'feedback m-0 position-absolute small text-success';
    input.className = 'form-control w-100 is';
    feedback.textContent = 'RSS успешно загружен';
  } else if (path === 'form.errors') {
    feedback.className = 'feedback m-0 position-absolute small text-danger';
    input.className = 'form-control w-100 is-invalid';
    feedback.textContent = value;
  }
  rssForm.reset();
  input.focus();
});
export default watchedState;
