import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container } from "react-bootstrap";
import Logo from "../utils/images/logo.png"

function NavbarLogo (){
    return (
        <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt="Logo"
              src={Logo}
              width="35"
              height="35"
              className="d-inline-block align-top"
            />{' '}
            Run Tracker
          </Navbar.Brand>
        </Container>
      </Navbar>
    );
}

export default NavbarLogo;