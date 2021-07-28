import axios from 'axios';

export default (url) => {
  axios(url)
    .then((doc) => {
      const parser = new DOMParser();
      const resolve = parser.parseFromString(doc.data, 'application/xml');
      console.log(resolve);
    })
    .catch(() => console.log('Добавлен невалидный URL'));
};
