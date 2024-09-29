// src/index.tsx hoặc src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider từ react-redux
import store from './store/store'; // Import store của bạn
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}> {/* Bọc ứng dụng của bạn trong Provider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
