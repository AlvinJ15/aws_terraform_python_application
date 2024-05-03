import React, { useState } from 'react';
import {
    Row, Col, Card, Button, Form, FormGroup, Label, Input,Spinner
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import organizationService from '../organization/services/organization.service';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

const ProfileReferences = () => {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)

    const [dataReference, setDataReference] = useState({
        referee_email: '',
        referee_name: '',
        referee_phone: '',
        //status: 'Active'
    })

    const handleData = (e) => {
        setDataReference({
            ...dataReference,
            [e.target.name]: e.target.value
        })
    }
    
    /**LIST OF ProfileReferences */

    const {data: profilereferencesList, isLoading: isLoadingReference} = useFetch({endpoint: `${params.idOrganization}/employees/${params.idEmployee}/references`})
 
    const [modalDocument, setModalDocument] = useState(false);
    const toggleModalDocument = () => { setModalDocument(!modalDocument) }
    /*accordtion*/
    // const [openAccordion, setOpenAccordion] = useState('1');
    // const toggleAccordion = (id) => {
    //     if (openAccordion === id) {
    //         setOpenAccordion();
    //     } else {
    //         setOpenAccordion(id);
    //     }
    // }

    const saveReference = () => {
        setIsLoading(true)
        organizationService.create(`${params.idOrganization}/employees/${params.idEmployee}/references`, dataReference)
            .then(response => getProfileDocumentList())
            .catch(error => console.log(error))
            .finally(() => { setIsLoading(false); toggleModalDocument() })
    }
    return (
        <><BreadCrumbs />
            <Card className='p-4'>
                <div className='mb-4' style={{ textAlign: "right" }}>
                    <div className='d-flex justify-content-between align-item-center'>
                        <h5>Reference</h5>
                        <Button color="primary" onClick={toggleModalDocument}>
                            Add Reference
                        </Button>
                    </div>
                    <Modal isOpen={modalDocument} toggle={toggleModalDocument}>
                        <ModalHeader toggle={toggleModalDocument}>
                            <h5>
                                Add Reference
                            </h5>
                            </ModalHeader>
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
                            <Button className='text-primary' color="light" onClick={toggleModalDocument} disabled={isLoading}>Cancel</Button>
                            <Button color="primary" onClick={saveReference} disabled={isLoading}>
                                {isLoading ? "Saving" : "Save"}
                            </Button>{' '}
                        </ModalFooter>
                    </Modal>
                </div>
                <Row>
                    <Col xs="12" md="12" lg="12">
                        {
                            !!isLoadingReference 
                            ?   <center><Spinner className='mx-auto my-4'>Loading ...</Spinner></center>
                            :   <ReactTable
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
                        }
                    </Col>
                </Row>

            </Card>
            
        </>
    )
}
export default ProfileReferences