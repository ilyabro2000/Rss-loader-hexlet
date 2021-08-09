// @ts-check
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';
import i18next from 'i18next';
import { initObj } from './locales/i18next.js';
import app from './app.js';

i18next.init(initObj).then(() => app());
