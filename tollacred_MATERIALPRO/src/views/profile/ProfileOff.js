import React, { useState } from 'react';
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

const ProfileOff = ({ defaultOpen = false, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const toogleOpen = () => setIsOpen(!isOpen);
    const [dataProfile, setDataProfile] = useState({
        name: 'Hanna Gover',
        email: '',
    })
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
                            <Card>
                                <CardBody className="p-2">
                                    <div className="text-center mt-4">
                                        <img src={img1} className="rounded-circle" width="150" alt="" />
                                        <CardTitle tag="h4" className="mt-2 mb-0">
                                            {dataProfile.name}
                                        </CardTitle>
                                        <CardSubtitle className="text-muted">Accounts Manager</CardSubtitle>
                                        <Row className="text-center justify-content-md-center mt-3">
                                            <Col xs="4">
                                                <a href="/" className="text-dark fw-bold text-decoration-none">
                                                    <i className="bi bi-person text-muted"></i>
                                                    <span className="font-medium ms-2">254</span>
                                                </a>
                                            </Col>
                                            <Col xs="4">
                                                <a href="/" className="text-dark fw-bold text-decoration-none">
                                                    <i className="bi bi-columns text-muted"></i>
                                                    <span className="font-medium ms-2">54</span>
                                                </a>
                                            </Col>
                                        </Row>
                                    </div>
                                </CardBody>
                                <CardBody className="border-top p-4">
                                    <div>
                                        <CardSubtitle className="text-muted fs-5">Email address</CardSubtitle>
                                        <CardTitle tag="h5">{dataProfile.email}</CardTitle>

                                        <CardSubtitle className="text-muted fs-5 mt-3">Phone</CardSubtitle>
                                        <CardTitle tag="h5">+91 654 784 547</CardTitle>

                                        <CardSubtitle className="text-muted fs-5 mt-3">Address</CardSubtitle>
                                        <CardTitle tag="h5">71 Pilgrim Avenue Chevy Chase, MD 20815</CardTitle>
                                        <CardSubtitle className="text-muted fs-5 mt-3 mb-2">Social Profile</CardSubtitle>
                                        <div className="d-flex align-items-center gap-2">
                                            <Button className="btn-circle" color="info">
                                                <i className="bi bi-facebook"></i>
                                            </Button>
                                            <Button className="btn-circle" color="success">
                                                <i className="bi bi-twitter"></i>
                                            </Button>
                                            <Button className="btn-circle" color="danger">
                                                <i className="bi bi-youtube"></i>
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </OffcanvasBody>
                </Offcanvas>

            </Row >
            {children}
        </>
    );
};

export default ProfileOff;
