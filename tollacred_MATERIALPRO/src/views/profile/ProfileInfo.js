import React, { useEffect, useState } from 'react';
import Iframe from 'react-iframe';
import {
    Row, Col, Card, CardBody, CardTitle, CardSubtitle, Button,
    Form, FormGroup, Label, Input,
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';

import img1 from '../../assets/images/users/user1.jpg';

const ProfileInfo = ({ data = {} }) => {
    console.log(data)
    const [dataProfile, setDataProfile] = useState({
        title: '',
        first_name: 'Hanna Gover',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        specialty: ''
    })
    //if data is not empty set dataProfile
    useEffect(() => {
        if (data) {
            setDataProfile(data)
        }
    }, [])
    return (
        <>

            <Row>
                <Card>
                    <CardBody className="p-2">
                        <div className="text-center mt-4">
                            <img src={img1} className="rounded-circle" width="150" alt="" />
                            <CardTitle tag="h4" className="mt-2 mb-0">
                                {dataProfile.title + " " + dataProfile.first_name + " " + dataProfile.last_name}
                            </CardTitle>
                            <CardSubtitle className="text-muted">{dataProfile.role}</CardSubtitle>
                            <CardSubtitle className="text-muted">{dataProfile.specialty}</CardSubtitle>
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
                            <CardTitle tag="h5">{dataProfile.phone}</CardTitle>

                            <CardSubtitle className="text-muted fs-5 mt-3">Address</CardSubtitle>
                            <CardTitle tag="h5">{dataProfile.address}</CardTitle>
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
            </Row >
        </>
    );
};

export default ProfileInfo;
