// @ts-check
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';
import app from './app.js';
import { i18next, initObj } from './locales/i18next.js';

i18next.init(initObj).then(() => app());
