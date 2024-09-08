import React from 'react';
import { Container } from "react-bootstrap";
import Navbar from '../components/NavbarLogo';
import BnvCard from '../components/cards/BnvCard';
import notifiche from '../utils/images/notifiche.png';

function Notifiche() {
    return (
        <>
            <Navbar />
            <Container>
                <BnvCard para={'Benvenuto nel centro notifiche. In questa sezione puoi visualizzare le ultime novità !'} img={notifiche}/><br/>

            </Container>
        </>
    );
}

export default Notifiche;