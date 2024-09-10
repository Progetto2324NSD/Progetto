import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button } from "react-bootstrap";
import Navbar from '../components/NavbarLogo';
import BnvCard from '../components/cards/BnvCard';
import notifiche from '../utils/images/notifiche.png';
import notiService from '../service/notiService';
import './stile/style.css';

function Notifiche() {
  const [Noti, setNoti] = useState([]);

  useEffect(() => {
    const fetchNotifiche = async () => {
      const data = await notiService.getNoti();
      setNoti(data);
    };

    fetchNotifiche();
  }, []);

  const handleDelete = async (id) => {
    await notiService.deleteNoti(id);
    setNoti(Noti.filter(not => not._id !== id));
  };

  return (
    <>
      <Navbar />
      <Container>
        <h2>Notifiche</h2><hr />
        <BnvCard para={'Benvenuto nel centro notifiche. In questa sezione puoi visualizzare le ultime novità !'} img={notifiche}/><br/>
        <br/>
        <ListGroup>
          {Noti.map((not, index) => (
            <ListGroup.Item key={not._id} className="notification-item">
              <div className="notification-content">
                <h5 className="notification-title">{`Notifica ${index + 1}`}</h5>
                <div>{not.message}</div>
              </div>
              <Button 
                variant="link" 
                className="notification-delete" 
                onClick={() => handleDelete(not._id)}
                style={{ textDecoration: 'none', color: 'red' }} 
              >
                &#10005;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    </>
  );
}

export default Notifiche;
