//import React from 'react'
//import ReactDOM from 'react-dom'
//import App from './App.jsx'
//import './index.css'
//import 'bootstrap/dist/css/bootstrap.min.css'
//import { AuthProvider } from '../src/components/auth/AuthContext';
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthProvider } from '../src/components/auth/AuthContext';
import { UserProvider } from '../src/components/auth/UserContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <UserProvider>
    <App />
    </UserProvider>
  </AuthProvider>,
  document.getElementById('root')
);