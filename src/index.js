import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import { store } from './store/store';
import { ConfigProvider } from 'antd';
import { theme } from './theme/theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
    </Provider>
);
