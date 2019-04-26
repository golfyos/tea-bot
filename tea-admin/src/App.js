import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar'
import SendMsg from './components/SendMsg'
import ListOrder from './components/ListOrder'
import AddPriceScreen from './components/AddPrice'
import CommandScreen from './components/Command'

import ListHistoryScreen from './components/ListHistory'

import {Route} from 'react-router-dom'


class App extends Component {

  componentDidMount(){

  }

  render() {
    return (
      <div className="App">
        <Navbar/>
        <div className="App-content">
          <Route exact path="/" component={SendMsg} />
          <Route exact path="/list_order" component={ListOrder}/>
          <Route exact path="/addprice" component={ListHistoryScreen}/>
          <Route exact path="/addprice/order" component={AddPriceScreen}/>
          <Route exact path="/command" component={CommandScreen}/>
        </div>
      </div>
    );
  }
}

export default App;
