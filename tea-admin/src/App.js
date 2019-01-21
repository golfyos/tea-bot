import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar'
import SendMsg from './components/SendMsg'
import ListOrder from './components/ListOrder'
import AddPriceScreen from './components/AddPrice'

import {Route} from 'react-router-dom'


class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar/>
        <header className="App-header">
          <Route exact path="/" component={SendMsg} />
          <Route exact path="/list_order" component={ListOrder}/>
          <Route exact path="/addprice" component={AddPriceScreen}/>
        </header>
      </div>
    );
  }
}

export default App;
