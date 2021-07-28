import _ from 'lodash';

export default (url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(url, 'application/xml');
  const feedTitle = doc.querySelector('title').textContent;
  const feedDescription = doc.querySelector('description').textContent;
  const id = _.uniqueId();
  return {
    feedTitle,
    feedDescription,
    id,
  };
};
