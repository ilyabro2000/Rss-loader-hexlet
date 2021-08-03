import * as yup from 'yup';
import rssParser from './rssParser';

export default (url, feeds) => {
  const isDuplicate = (collection, element) => {
    if (collection.length === 0) {
      return false;
    }
    const duplicateItem = collection.filter((item) => item.url === element);
    if (duplicateItem.length === 0) return false;
    return true;
  };

  const schema = yup.string().url('Ссылка должна быть валидным URL');
  const validInputUrl = schema.validate(url)
    .then((validUrl) => {
      if (isDuplicate(feeds, validUrl) === true) {
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
