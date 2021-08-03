import _ from 'lodash';

export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');

  const feedTitle = doc.querySelector('title').textContent;
  const feedDescription = doc.querySelector('description').textContent;

  const items = doc.querySelectorAll('item');
  const data = {
    feedTitle,
    feedDescription,
    posts: [],
  };
  items.forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const id = _.uniqueId();
    data.posts.push({
      postTitle,
      postDescription,
      link,
      id,
      status: 'unread',
    });
  });
  return data;
};
