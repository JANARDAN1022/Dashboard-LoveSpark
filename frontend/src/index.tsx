import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MainPageContextProvider from './Context/MainPageContext';
import { Provider } from 'react-redux';
import {store} from './Store';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <MainPageContextProvider>
      <App />
      </MainPageContextProvider>
  </Provider>
);

