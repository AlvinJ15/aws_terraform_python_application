import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle,
    TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody,
    Spinner
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import CrudDocument from './forms/crudDocument'
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import useCreateFetch from '../../hooks/useCreateFetch';
import useDeleteFetch from '../../hooks/useDeleteFetch';

const initialDocument = {
    id: '',
    title: '',
    description: '',
    purpose: '',
    notifiacionCheckBox: false,
    facilities: [],
}

const Documents = () => {

    const params = useParams()
    const navigate = useNavigate()

    const [modalDocument, setModalDocument] = useState(false);


    /**CREATE OF Documents */

    const { data: dataDocument, isFetching, handleInput, error, setError, create } = useCreateFetch({ endpoint: `${params.idOrganization}/documents`, initData: initialDocument })

    const toggleModalDocument = () => {
        setError({});
        setModalDocument(!modalDocument)
    }

    const createDocument = () => {
        create()
            .then(response => {
                setModalDocument(false)
            })
    }

    /** GET LIST OF Document */
    const { data: documentsList, isLoading, refresh } = useFetch({ endpoint: `${params.idOrganization}/documents` })
    /** GET LIST OF Facilities */
    const { data: facilityList, isLoading: isLoadingFacility } = useFetch({ endpoint: `${params.idOrganization}/facilities` })
    /** DELETE OF Document */
    const { isLoading: isLoadingDelete, destroy } = useDeleteFetch({ endpoint: `${params.idOrganization}/documents` })

    const deleteDocument = (id) => {
        destroy(id)
            .then(response => { refresh })
    }


    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="12">
                    <Card>
                        <Row>
                            <Col sm="12">
                                <div className="p-4">
                                    <div  className='d-flex justify-content-between align-items-center'>
                                        <h5>Documents</h5>
                                        {
                                            !isLoadingFacility && <Button className='float-end mb-2' color="primary" onClick={toggleModalDocument}>
                                                Add Organization Documents
                                            </Button>
                                        }
                                    </div>
                                    <div>
                                        <Row>
                                            <ComponentCard >
                                                {
                                                    isLoading
                                                        ? <Spinner className='mx-auto'>Loading...</Spinner>
                                                        : <ReactTable
                                                            data={documentsList}
                                                            columns={[
                                                                {
                                                                    Header: 'Package ID',
                                                                    accessor: 'id',
                                                                    id: 'id',
                                                                    show: false
                                                                },

                                                                {
                                                                    Header: 'Name',
                                                                    id: 'name',
                                                                    accessor: (d) => d.name,
                                                                },
                                                                {
                                                                    Header: 'Description',
                                                                    accessor: 'description',
                                                                },
                                                                // {
                                                                //     Header: 'Actions',
                                                                //     accessor: 'package_id',
                                                                //     sorteable: false,
                                                                //     Cell: row => (
                                                                //         <div className='d-flex gap-3 justify-content-center'>
                                                                //             <div className=''>
                                                                //                 <Button color="primary" onClick={toggleModalDocument}>
                                                                //                     Edit
                                                                //                 </Button>
                                                                //             </div>
                                                                //             <div className=''>
                                                                //                 <Button color="danger" onClick={toggleModalDocument}>
                                                                //                     Delete
                                                                //                 </Button>
                                                                //             </div>
                                                                //         </div>
                                                                //     )
                                                                // },
                                                            ]}
                                                            defaultPageSize={10}
                                                            className="-striped -highlight"
                                                        // SubComponent={row => {
                                                        //     return (
                                                        //         <div>
                                                        //             XD
                                                        //         </div>
                                                        //     );
                                                        // }}
                                                        />
                                                }
                                            </ComponentCard>
                                        </Row>
                                        {/* <Modal isOpen={modalDocument} toggle={toggleModalDocument} className={"primary"}>
                                            <ModalHeader toggle={toggleModalDocument}>
                                                Document Type Creation
                                            </ModalHeader>
                                            <ModalBody>
                                                {error.status && <Alert color="danger">
                                                    {error.message}
                                                </Alert>}
                                                <CrudDocument facility="CREATE" data={dataDocument} handle={handleInput} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={() => mangeDocument("CREATE")}>Save</Button>{' '}
                                                <Button color="secondary" onClick={toggleModalDocument}>Cancel</Button>
                                            </ModalFooter>
                                        </Modal> */}
                                        <Offcanvas direction="end" toggle={toggleModalDocument} isOpen={modalDocument} style={{ width: "51%" }} >
                                            <OffcanvasHeader toggle={toggleModalDocument}>
                                                <h5>Package Creation</h5>
                                            </OffcanvasHeader>
                                            <OffcanvasBody>
                                                <div className='mb-3'>
                                                    <small>
                                                        Add documents and checks necessary to fulfill compliance requirements.
                                                    </small>
                                                </div>
                                                <CrudDocument facility="CREATE" data={dataDocument} handle={handleInput} lists={{ facilityList: facilityList }} />
                                                <hr></hr>
                                                <div className='d-flex justify-content-end gap-3'>
                                                    <button className='btn btn-light text-primary' onClick={() => setModalDocument(false)} isabled={isFetching}> Cancel</button>
                                                    <button className='btn btn-primary' onClick={() => createDocument()} disabled={isFetching}>{isFetching ? 'Saving' : 'Save'}</button>
                                                </div>
                                            </OffcanvasBody>
                                        </Offcanvas>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {documentsList.length > 0 &&
                        <Row>

                        </Row>
                    }
                </Col>
            </Row>
        </>
    )
}
export default Documents