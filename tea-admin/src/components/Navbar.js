import React , {Component,Fragment} from 'react'

import "../styles/Navbar.css"

import {Link} from 'react-router-dom'

class Navbar extends Component {
  render(){
    return(
      <div className="navbar">
        <ul className="navbar-list">
          <li><Link className="nav-link" to="/">HOME</Link></li>
          <li><Link className="nav-link" to="/list_order">LIST</Link></li>
          <li><Link className="nav-link" to="/addprice">ADD PRICE</Link></li>
        </ul>
        <ul className="navbar-authen"> 
          <li><Link className="nav-link" to="/">Login</Link></li>
        </ul>
      </div>
    )
  }
}

export default Navbar