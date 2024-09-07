import Logo from "../utils/images/logo.png";
import { Navbar, Container, Button, Offcanvas, Nav } from "react-bootstrap";
import { useState } from 'react';
import "boxicons";
import "../pages/stile/style.css";
 
function NavbarLogo() {
 
  const [show, setShow] = useState(false);
 
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          React Bootstrap
        </Navbar.Brand>
        <Button variant="primary" onClick={handleShow}>
          Menu
        </Button>
 
        <Offcanvas show={show} onHide={handleClose} className="offcanvas-fixed">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column">
            {/* Header del Menu con Logo */}
            <div className="sidebar-header">
              <img
                alt="Logo"
                src={Logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              <h2>FitLog</h2>
            </div>
 
            {/* Sezione voci del menu */}
            <Nav className="flex-column flex-grow-1 menu-items">
              <Nav.Link href="#dashboard">
                <box-icon name="home" />
                <span>Dashboard</span>
              </Nav.Link>
              <Nav.Link href="#projects">
                <box-icon name="grid-alt" />
                <span>Projects</span>
              </Nav.Link>
              <Nav.Link href="#notifications">
                <box-icon name="bell" />
                <span>Notifications</span>
              </Nav.Link>
              <Nav.Link href="#analytics">
                <box-icon name="bar-chart-alt-2" />
                <span>Analytics</span>
              </Nav.Link>
 
              {/* Spacer per spingere Logout in fondo */}
              <div className="flex-grow-1"></div>
 
              <Nav.Link href="#logout" className="logout-link">
                <box-icon name="log-out" />
                <span>Logout</span>
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}
 
export default NavbarLogo;