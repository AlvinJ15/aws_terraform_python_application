import React, { useEffect, useState } from 'react';
import Iframe from 'react-iframe';
import {
    Row, Col, Card, CardBody, CardTitle, CardSubtitle, Button, TabContent, TabPane, Nav, NavItem,
    NavLink, Progress, Form, FormGroup, Label, Input, Offcanvas, OffcanvasHeader, CloseButton, OffcanvasBody
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';

import img1 from '../../assets/images/users/user1.jpg';
import img2 from '../../assets/images/users/user2.jpg';
import img3 from '../../assets/images/users/user3.jpg';
import img4 from '../../assets/images/users/user4.jpg';

import time1 from '../../assets/images/bg/bg1.jpg';
import time2 from '../../assets/images/bg/bg2.jpg';
import time3 from '../../assets/images/bg/bg3.jpg';
import time4 from '../../assets/images/bg/bg4.jpg';
import ProfileInfo from './ProfileInfo';

const ProfileOff = ({ defaultOpen = false, data = {}, children }) => {
    console.log(defaultOpen)
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const toogleOpen = () => setIsOpen(!isOpen);
    return (
        <>

            <Row>
                {/* <Card style={{ width: "90%" }}> */}
                <div className='d-flex justify-content-end mb-4'>
                    <button className="btn bg-white" onClick={toogleOpen}>Toggle Profile</button>
                </div>
                {/* </Card> */}

                <Offcanvas direction="end" toggle={toogleOpen} isOpen={isOpen} style={{ width: "27%" }} >
                    <OffcanvasBody>
                        <Col xs="12" md="12" lg="12">
                            <CloseButton onClick={toogleOpen} />
                            <ProfileInfo data={data} />
                        </Col>
                    </OffcanvasBody>
                </Offcanvas>

            </Row >
            {children}
        </>
    );
};

export default ProfileOff;
