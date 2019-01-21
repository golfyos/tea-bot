import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import Store from "./store"
import 'bootstrap/dist/css/bootstrap.min.css';

const APP = (<Provider store={Store}><BrowserRouter><App/></BrowserRouter></Provider>)
document.title = "LINE BOT MANAGER"

ReactDOM.render(APP, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
