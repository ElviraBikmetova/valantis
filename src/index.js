import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import { store } from './store/store'
import { theme } from './theme/theme'
import App from './App'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </Provider>
)
