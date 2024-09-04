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

        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="user-info mb-4">
              <img
                src="https://via.placeholder.com/50"
                alt="User Avatar"
                className="rounded-circle"
                width="50"
                height="50"
              />
              <div>
                <h5>Nome Utente</h5>
                <p>email@esempio.com</p>
              </div>
            </div>
            
            {/* Sezione voci del menu */}
            <Nav className="flex-column">
              <Nav.Link href="#home">
                <box-icon name="home" /> Home
              </Nav.Link>
              <Nav.Link href="#profile">
                <box-icon name="user" /> Profile
              </Nav.Link>
              <Nav.Link href="#settings">
                <box-icon name="cog" /> Settings
              </Nav.Link>
              <Nav.Link href="#logout">
                <box-icon name="log-out" /> Logout
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavbarLogo;
