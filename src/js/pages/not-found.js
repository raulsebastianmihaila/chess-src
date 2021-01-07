import {link, div} from '../dom';

const NotFound = () => div(
  {className: 'message'},
  'Are you lost? Play a ',
  link({to: '/'}, 'chess game'),
  '.');

export default NotFound;
