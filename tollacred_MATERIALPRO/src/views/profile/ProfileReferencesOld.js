import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle, Accordion,
    TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, AccordionItem, AccordionBody, AccordionHeader
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import OrganizationService from '../organization/services/organization.service.js';
const ProfileReferences = () => {
    const [showMandatory, setShowMandatory] = useState(true)

    /**LIST OF ProfileReferences */
    const [profilereferencesList, setProfileReferencesList] = useState([])
    const getProfileDocumentList = () => {
        OrganizationService.get('9cf728c0-288a-4d92-9524-04d58b2ab32d/compliancePackages')
            .then(response => setProfileReferencesList(response))

        /*FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/compliancePackages', "GET").then(response => {
            setProfileReferencesList(response)
        })*/
    }
    const [modalDocument, setModalDocument] = useState(false);
    const toggleModalDocument = () => { setModalDocument(!modalDocument) }
    /*accordtion*/
    const [openAccordion, setOpenAccordion] = useState('1');
    const toggleAccordion = (id) => {
        if (openAccordion === id) {
            setOpenAccordion();
        } else {
            setOpenAccordion(id);
        }
    }

    useEffect(() => {
        getProfileDocumentList()
    }, [])

    return (
        <><BreadCrumbs />
            <div className='mb-4' style={{ textAlign: "right" }}>
                <Button color="primary" onClick={toggleModalDocument}>
                    Add Reference
                </Button>
                <Modal isOpen={modalDocument} toggle={toggleModalDocument}>
                    <ModalHeader toggle={toggleModalDocument}>Add Reference</ModalHeader>
                    <ModalBody>
                        {/* Need a form */}
                        <Form>
                            <FormGroup>
                                <Label for="exampleEmail">Name</Label>
                                <Input type="text" name="name" id="exampleEmail" placeholder="Name" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleEmail">Status</Label>
                                <Input type="select" name="status" id="exampleEmail" placeholder="Status">
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleEmail">Approval</Label>
                                <Input type="select" name="approval" id="exampleEmail" placeholder="Approval">
                                    <option>Yes</option>
                                    <option>No</option>
                                </Input>
                            </FormGroup>
                        </Form>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={toggleModalDocument}>Save</Button>{' '}
                        <Button color="secondary" onClick={toggleModalDocument}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
            <Row>
                <Col xs="12" md="12" lg="12">
                    <Accordion open={openAccordion} toggle={toggleAccordion}>
                        <AccordionItem>
                            <AccordionHeader targetId="1">Other</AccordionHeader>
                            <AccordionBody accordionId="1">
                                <p>
                                    References in this group are missing essential details.
                                </p>
                            </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionHeader targetId="2">University of Chicago Medical Center</AccordionHeader>
                            <AccordionBody accordionId="2">
                                <Row>
                                    <Col sm="12">
                                        <div className="p-4">
                                            <Row>
                                                <ComponentCard title="Details" >

                                                    <ReactTable
                                                        data={profilereferencesList}
                                                        columns={[
                                                            {
                                                                Header: 'Referee',
                                                                accessor: 'name',
                                                                id: 'name',
                                                            },
                                                            {
                                                                Header: 'Status',
                                                                id: 'status',
                                                                accessor: (d) => d.status,
                                                            },
                                                            {
                                                                Header: 'Approval',
                                                                accessor: 'approval',
                                                            },
                                                            {
                                                                Header: 'Actions',
                                                                accessor: 'package_id',
                                                                sorteable: false,
                                                                Cell: row => (
                                                                    <div className='row'>
                                                                        <div className='col-6'>
                                                                            <Button color="primary" onClick={toggleModalDocument}>
                                                                                Edit
                                                                            </Button>
                                                                        </div>
                                                                        <div className='col-6'>
                                                                            <Button color="danger" onClick={toggleModalDocument}>
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            },
                                                        ]}
                                                        defaultPageSize={10}
                                                        className="-striped -highlight"
                                                    />
                                                </ComponentCard>
                                            </Row>

                                        </div>
                                    </Col>
                                </Row>
                            </AccordionBody>
                        </AccordionItem>
                    </Accordion>
                    <Card>

                    </Card>


                </Col>
            </Row>
        </>
    )
}
export default ProfileReferences