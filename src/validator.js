import * as yup from 'yup';
import _ from 'lodash';
import rssParser from './rssParser';

export default (url, feeds) => {
  const schema = yup.string().url();
  const validInputUrl = schema.validate(url)
    .then((validUrl) => {
      if (_.includes(feeds, url)) {
        throw new Error('RSS уже добавлен');
      } else {
        return validUrl;
      }
    })
    .then((validUrl) => fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(validUrl)}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Невалидный запрос');
    })
    .then((data) => rssParser(data.contents))
    .then(() => url)
    .catch(() => {
      throw new Error('Ссылка должна быть валидным URL');
    });
  return validInputUrl;
};
