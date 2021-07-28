import * as yup from 'yup';
import _ from 'lodash';

export default (url, feeds) => {
  const schema = yup.string().url('Ссылка должна быть валидным URL');
  const promise = schema.validate(url)
    .then((urlValid) => {
      if (_.includes(feeds, url)) {
        throw new Error('RSS уже добавлен');
      }
      return urlValid;
    });
  return promise;
};
