import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  // NavLink,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";

import { MdPermIdentity, MdLock } from "react-icons/md";
import { connect } from "react-redux";
import { authen } from "../actions/authen";
import "../styles/Navbar.css";

class NavbarComponent extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: true,
      isLogin: false,
      isModalLogin: false,
      user_info: {
        username: "",
        password: "",
        isValid: false
      }
    };
  }

  toggleModal = () => {
    this.setState({ isModalLogin: !this.state.isModalLogin });
  };

  _onUsernameChange = () => {
    this.setState({ username: !this.state.username });
  };

  _onPasswordChange = () => {
    this.setState({ password: !this.state.password });
  };

  render() {
    return (
      <div className="navbar">
        <Navbar fixed="top" color="light" light expand="md">
          <NavbarBrand>
            <Link className="nav-link" to="/">
              <img
                alt="cat"
                width="100"
                height="50"
                src={require("../logo.png")}
              />
            </Link>
          </NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav>
              <NavItem>
                <Link className="nav-link" to="/list_order">
                  LIST
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/addprice">
                  ADD PRICE
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/command">
                  COMMAND
                </Link>
              </NavItem>
            </Nav>
          </Collapse>

          <Collapse isOpen={this.state.isLogin}>
            <Nav>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  NAME
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>Your Profile</DropdownItem>
                  <DropdownItem>Setting</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Logout</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>

          <Collapse isOpen={!this.state.isLogin}>
            <Nav>
              <NavItem>
                <Button onClick={this.toggleModal} outline color="primary">
                  Login
                </Button>
              </NavItem>
            </Nav>
          </Collapse>

          <Modal
            toggle={this.toggleModal}
            isOpen={this.state.isModalLogin}
            backdrop={true}
          >
            <ModalHeader toggle={this.toggleModal}>LOGIN FORM</ModalHeader>
            <ModalBody>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <MdPermIdentity />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  valid={this.state.user_info.isValid}
                  onChange={this._onUsernameChange}
                  type="text"
                  placeholder="Username"
                />
              </InputGroup>
              <br />

              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <MdLock />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  valid={this.state.user_info.isValid}
                  onChange={this._onPasswordChange}
                  type="password"
                  placeholder="Password"
                />
              </InputGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary">Login</Button>
              <Button color="warning" onClick={this.toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLogin: state.auth.isLogin
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSubmitLogin: data => {
      dispatch(authen(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavbarComponent);
