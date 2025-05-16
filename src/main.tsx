import React from 'react'
import ReactDOM from 'react-dom'
import './common/styles/index.scss'
import App from './common/App'
import { BrowserRouter } from 'react-router-dom'
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey(
    `${import.meta.env.VITE_MUI_KEY}`
);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
