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
import organizationService from '../organization/services/organization.service';
import { useParams } from 'react-router-dom';
const ProfileReferences = () => {
    const params = useParams()
    const [dataReference, setDataReference] = useState({
        referee_email: '',
        referee_name: '',
        referee_phone: '',
        //status: 'Active'
    })
    const [isLoading, setIsLoading] = useState(false)
    const handleData = (e) => {
        setDataReference({
            ...dataReference,
            [e.target.name]: e.target.value
        })
    }
    const [showMandatory, setShowMandatory] = useState(true)
    /**LIST OF ProfileReferences */
    const [profilereferencesList, setProfileReferencesList] = useState([])
    const getProfileDocumentList = () => {
        organizationService.get(`${params.idOrganization}/employees/${params.idEmployee}/references`)
            .then(response => setProfileReferencesList(response))

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
    const saveReference = () => {
        setIsLoading(true)
        organizationService.create(`${params.idOrganization}/employees/${params.idEmployee}/references`, dataReference)
            .then(response => getProfileDocumentList())
            .catch(error => console.log(error))
            .finally(() => { setIsLoading(false); toggleModalDocument() })
    }
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
                                <Label >Name</Label>
                                <Input type="text" name="referee_email" placeholder="Name" value={dataReference.referee_email} onChange={handleData} />
                            </FormGroup>
                            <FormGroup>
                                <Label >Email</Label>
                                <Input type="text" name="referee_name" placeholder="email" value={dataReference.referee_name} onChange={handleData} />
                            </FormGroup>
                            <FormGroup>
                                <Label >Phone</Label>
                                <Input type="text" name="referee_phone" placeholder="Phone" value={dataReference.referee_phone} onChange={handleData} />
                            </FormGroup>
                            {/* <FormGroup>
                                <Label for="exampleEmail">Status</Label>
                                <Input type="select" name="status" placeholder="Status" value={dataReference.email} onChange={handleData}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Input>
                            </FormGroup> */}
                        </Form>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={saveReference} disabled={isLoading}>
                            {isLoading ? "Saving" : "Save"}
                        </Button>{' '}
                        <Button color="secondary" onClick={toggleModalDocument} disabled={isLoading}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
            <Row>
                <Col xs="12" md="12" lg="12">
                    <ReactTable
                        data={profilereferencesList}
                        columns={[
                            {
                                Header: 'Name',
                                accessor: 'referee_name',
                                id: 'referee_name',
                            },
                            {
                                Header: 'Email',
                                accessor: 'referee_email',
                                id: 'referee_email',
                            },
                            {
                                Header: 'Phone',
                                accessor: 'referee_phone',
                                id: 'referee_phone',
                            },
                            {
                                Header: 'Status',
                                id: 'status',
                                accessor: (d) => d.status,
                            },
                            // {
                            //     Header: 'Actions',
                            //     accessor: 'document_id',
                            //     sorteable: false,
                            //     Cell: document_id => (
                            //         (
                            //             <div className=''>
                            //                 <div className='d-flex justify-content-center'>
                            //                     Nothing</div>
                            //             </div>
                            //         )
                            //     )
                            // },
                        ]}
                        defaultPageSize={10}
                        className="-striped -highlight"
                    />
                </Col>
            </Row>
        </>
    )
}
export default ProfileReferences