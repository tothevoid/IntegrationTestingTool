import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {I18nextProvider} from "react-i18next";
import i18n from "./i18n";

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
      <I18nextProvider i18n={i18n}>
          <App />
      </I18nextProvider>
  </BrowserRouter>,
  rootElement);

registerServiceWorker();

