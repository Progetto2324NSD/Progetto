import { useState } from 'react';

//Immagini
import Logo from "../utils/images/logo.png";

//Import React
import { Navbar, Container, Button, Offcanvas, Nav } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';

//Icone
import "boxicons";

// Stile
import "../pages/stile/style.css";

//Libreria
import toast from 'react-hot-toast';

// Importa la funzione di servizio
import { logout } from "../service/userService";
 
function NavbarLogo() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 
  const submitHandler = async () => {
    try {
      const response = await logout();
      toast.success("Logout effettuato con successo!", {
        duration: 1500
      });
 
      navigate('/');
 
    } catch (error) {
      toast.error("Errore durante il logout");
    }
  }
 
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
          FitLog Running
        </Navbar.Brand>
        <Button variant="primary" onClick={handleShow}>
          Menu
        </Button>
 
        <Offcanvas show={show} onHide={handleClose} className="offcanvas-fixed">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column">
            <div className="sidebar-header">
              <img
                alt="Logo"
                src={Logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              <h2>FitLog Running</h2>
            </div>
 
            <Nav className="flex-column flex-grow-1 menu-items">
              <Link to="/Dashboard" className="nav-link">
                <box-icon name="home" />
                <span>Dashboard</span>
              </Link>
              <Link to="/Workout" className="nav-link">
                <box-icon name="grid-alt" />
                <span>Workout</span>
              </Link>
              <Link to="/Statistiche" className="nav-link">
                <box-icon name="bell" />
                <span>Statistiche</span>
              </Link>
              <Link to="/Notifiche" className="nav-link">
                <box-icon name="bar-chart-alt-2" />
                <span>Notifiche</span>
              </Link>
 
              <div className="flex-grow-1"></div>
 
              <Nav.Link className="logout-link">
                <box-icon name="log-out" />
                <span onClick={submitHandler}>Logout</span>
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}
 
export default NavbarLogo;