import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle,
    TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import { FetchData } from '../../assets/js/funcionesGenerales'
import CrudDocument from './forms/crudDocument'
const Documents = () => {
    /**Adding new Document */
    const [dataDocument, setDataDocument] = useState({
        id: '',
        title: '',
        description: '',
        purpose: '',
        notifiacionCheckBox: false,
        roles: [],
    })
    const [roleList, setRoleList] = useState([])
    const getRoleList = () => {
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/roles', "GET").then(response => setRoleList(response))
    }
    useEffect(() => {
        getRoleList()
    }, [])
    const [modalDocument, setModalDocument] = useState(false);
    const toggleModalDocument = () => { setError(false); setModalDocument(!modalDocument) }
    const handleInput = (e) => {
        const { type, name, value, checked } = e.target
        setDataDocument({ ...dataDocument, [name]: type == 'checkbox' ? checked : value })
    }
    const [error, setError] = useState({
        status: false,
        message: ''
    })
    const validateFieldsDocument = (action = "CREATE") => {
        if (dataDocument.packageName == "") {
            setMessageError('All fields are required by default')
            return false
        }
        return true
    }
    const setMessageError = (message) => {
        setError({
            status: message != "",
            message: message
        })
    }
    const mangeDocument = (action) => {
        if (validateFieldsDocument(action)) {
            alert("mandare a " + action)
            let endpoint = "'organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/save'"
            FetchData(endpoint, "GET", dataDocument).then(response => {
                console.log("ar", response)
                setDocumentsList(response)
            })
        }
    }
    /**end new Document */
    /**LIST OF Documents */
    const [documentsList, setDocumentsList] = useState([])
    /*const getDocumentList = () => {
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/compliancePackages', "GET").then(response => {
            setDocumentsList(response)
        })
    }*/
    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="11">
                    <Card>
                        <Row>
                            <Col sm="12">
                                <div className="p-4">
                                    <Row>
                                        <Col md="12" xs="12" >
                                            <strong>Documents</strong>
                                            <Button className='float-end mb-2' color="primary" onClick={toggleModalDocument}
                                            >Add Organization Documents</Button>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Row>
                                            <ComponentCard title="Documents List" >

                                                <ReactTable
                                                    data={documentsList}
                                                    columns={[
                                                        {
                                                            Header: 'Package ID',
                                                            accessor: 'package_id',
                                                            id: 'id',
                                                        },
                                                        {
                                                            Header: 'Name',
                                                            id: 'name',
                                                            accessor: (d) => d.name,
                                                        },
                                                        {
                                                            Header: 'Creation Date',
                                                            accessor: 'creation_date',
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
                                                // SubComponent={row => {
                                                //     return (
                                                //         <div>
                                                //             XD
                                                //         </div>
                                                //     );
                                                // }}
                                                />
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
                                                <CrudDocument role="CREATE" data={dataDocument} handle={handleInput} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={() => mangeDocument("CREATE")}>Save</Button>{' '}
                                                <Button color="secondary" onClick={toggleModalDocument}>Cancel</Button>
                                            </ModalFooter>
                                        </Modal> */}
                                        <Offcanvas direction="end" toggle={toggleModalDocument} isOpen={modalDocument} style={{ width: "51%" }} >
                                            <OffcanvasHeader toggle={toggleModalDocument}>
                                                Package Creation
                                            </OffcanvasHeader>
                                            <OffcanvasBody>
                                                <strong>
                                                    Add documents and checks necessary to fulfill compliance requirements.
                                                </strong>
                                                <CrudDocument role="CREATE" data={dataDocument} handle={handleInput} lists={{roleList: roleList }} />
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