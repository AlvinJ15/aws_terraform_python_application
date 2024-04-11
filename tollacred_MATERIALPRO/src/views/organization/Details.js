import React, { useState } from 'react';
import { Row, Col, Card, Button, TabContent, TabPane, Nav, NavItem, NavLink, Progress, Form, FormGroup, Label, Input } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
const Details = () => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="11">
                    <Card>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={activeTab === '1' ? 'active bg-transparent' : 'cursor-pointer'}
                                    onClick={() => {
                                        toggle('1');
                                    }}
                                >
                                    Settings
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={activeTab === '2' ? 'active bg-transparent' : 'cursor-pointer'}
                                    onClick={() => {
                                        toggle('2');
                                    }}
                                >
                                    Complements
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="12">
                                        <div className="p-4">
                                            <Form>
                                                <Row>
                                                    <Col xs="12" md="12" lg="6">
                                                        <FormGroup>
                                                            <Label>Organization ID *</Label>
                                                            <Input type="text" placeholder="Shaina Agrawal" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col xs="12" md="12" lg="6">
                                                        <FormGroup>
                                                            <Label>Organization Type*</Label>
                                                            <Input type="text" placeholder="Jognsmith@cool.com" />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" md="12" lg="6">
                                                        <FormGroup>
                                                            <Label>Organization Name*</Label>
                                                            <Input type="text" placeholder="Password" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col xs="12" md="12" lg="6">
                                                        <FormGroup>
                                                            <Label>Organization Legal Name*</Label>
                                                            <Input type="text" placeholder="123 456 1020" />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" md="12" lg="6">
                                                        <FormGroup>
                                                            <Label>Country*</Label>
                                                            <Input type="select">
                                                                <option>USA</option>
                                                                <option>India</option>
                                                                <option>America</option>
                                                            </Input>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col xs="12" md="12" lg="6">
                                                        <FormGroup>
                                                            <Label>Postcode/Zip</Label>
                                                            <Input type="text" placeholder="123 456 1020" />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" md="12" lg="6">
                                                        <FormGroup>
                                                            <Label>Address Line 1</Label>
                                                            <Input type="text" placeholder="123 456 1020" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col xs="12" md="12" lg="6">
                                                        <FormGroup>
                                                            <Label>Address Line 2</Label>
                                                            <Input type="text" placeholder="123 456 1020" />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" md="12" lg="6">
                                                        <FormGroup>
                                                            <Label>City</Label>
                                                            <Input type="text" placeholder="123 456 1020" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col xs="12" md="12" lg="6">
                                                        <FormGroup>
                                                            <Label>State/Province</Label>
                                                            <Input type="text" placeholder="123 456 1020" />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Button color="primary">Update Settings</Button>
                                            </Form>
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="12">
                                        <div className="p-4">
                                            <Row>
                                                <Col md="3" xs="6" className="border-end">
                                                    <strong>Full Name</strong>
                                                    <br />
                                                    <p className="text-muted">Alvin Chunga</p>
                                                </Col>
                                            </Row>
                                            <p className="mt-4">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                Lorem Ipsum has been the industry&apos;s standard dummy text ever since the
                                                1500s, when an unknown printer took a galley of type and scrambled it to
                                                make a type specimen book. It has survived not only five centuries
                                            </p>
                                            {/* <h4 className="font-medium mt-4">Skill Set</h4>
                                            <hr />
                                            <h5 className="mt-4">
                                                Wordpress <span className="float-end">80%</span>
                                            </h5>
                                            <Progress value={2 * 5} />
                                            <h5 className="mt-4">
                                                HTML 5 <span className="float-end">90%</span>
                                            </h5>
                                            <Progress color="success" value="25" />
                                            <h5 className="mt-4">
                                                jQuery <span className="float-end">50%</span>
                                            </h5>
                                            <Progress color="info" value={50} />
                                            <h5 className="mt-4">
                                                Photoshop <span className="float-end">70%</span>
                                            </h5>
                                            <Progress color="warning" value={75} /> */}
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
export default Details