import _ from 'lodash';

export default (newPosts, oldPosts) => _.differenceBy(newPosts, oldPosts, 'postTitle');
