import * as yup from 'yup';

export default (url, feeds) => {
  const isDuplicate = (collection, element) => {
    if (collection.length === 0) {
      return false;
    }
    const duplicateItem = collection.filter((item) => item.url === element);
    if (duplicateItem.length === 0) return false;
    return true;
  };

  const schema = yup.string().min(1, 'Не должно быть пустым').url('Ссылка должна быть валидным URL');
  const validInputUrl = schema.validate(url)
    .then((validUrl) => {
      if (isDuplicate(feeds, validUrl) === true) {
        throw new Error('RSS уже существует');
      } else {
        return validUrl;
      }
    });
  return validInputUrl;
};
