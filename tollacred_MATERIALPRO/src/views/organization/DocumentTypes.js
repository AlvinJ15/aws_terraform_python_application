import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle,
    TabContent, TabPane, Nav, NavItem, NavLink,
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CrudDocumentType from './forms/crudDocumentType';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import * as data from '../tables/ReacTableData';
import { FetchData } from '../../assets/js/funcionesGenerales'
const DocumentTypes = () => {
    /**Adding new Document */
    const [dataDocument, setDataDocument] = useState({
        name: '',
        description: '',
        category: '',
        expiration: 0,
        id: '',
        organizationId: ''
    })
    const [modalDocumentType, setModalDocumentType] = useState(false);
    const toggleModalDocumentType = () => { setError(false); setModalDocumentType(!modalDocumentType) }
    const handleInput = (e) => {
        const { type, name, value, checked } = e.target
        setDataDocument({ ...dataDocument, [name]: type == 'checkbox' ? checked : value })
    }
    const [error, setError] = useState({
        status: false,
        message: ''
    })
    const validateFieldsDocument = (action = "CREATE") => {
        switch (action) {
            case "DELETE":
                if (dataDocument.organizationId == "" || dataDocument.name == "" || dataDocument.category == "") {
                    setMessageError('All fields are required to delete')
                    return false
                }
                break;
            case "EDIT":
                if (dataDocument.organizationId == "" || dataDocument.name == "" || dataDocument.category == "") {
                    setMessageError('All fields are required to edit')
                    return false
                }
                break;
            default:
                if (dataDocument.name == "" || dataDocument.description == "" || dataDocument.category == "" || dataDocument.expiration == 0) {
                    setMessageError('All fields are required by default')
                    return false
                }
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
            let endpoint = "'organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/documents'"
            switch (action) {
                case "CREATE":
                    break;
                case "EDIT":
                    break;
                case "DELETE":
                    break;
                default:
                    break;
            }
            FetchData(endpoint, "GET", dataDocument).then(response => {
                console.log("ar", response)
                setDocumentsList(response)
            })
        }
    }
    /**end new document */
    /**Manage  Document */
    const [modalManageDocument, setModalManageDocument] = useState(false)
    const toggleManageDocument = () => { setError(false); setModalManageDocument(!modalManageDocument) }
    const [activeTab, setActiveTab] = useState('DELETE');
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    /**end manage document */
    /**LIST OF DOCUMENTS */
    const [documentsList, setDocumentsList] = useState([])
    const getDocumentList = () => {
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/documents', "GET").then(response => {
            console.log("ar", response)
            setDocumentsList(response)
        })
    }
    useEffect(() => {
        getDocumentList()
    }, [])
    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="11">
                    <Card>
                        <Row>
                            <Col sm="12">
                                <div className="p-4">
                                    <Row>
                                        <Col md="9" xs="6" >
                                            <strong>Document Type</strong>
                                        </Col>
                                        <Col md="1" xs="3" >
                                            <Button color="primary" className='float-end mb-2' onClick={toggleManageDocument}>Manage</Button>
                                        </Col>
                                        <Col md="2" xs="3" >
                                            <Button color="primary" className='float-end mb-2' onClick={toggleModalDocumentType}>Add New</Button>
                                        </Col>

                                    </Row>
                                    <hr />
                                    <div>
                                        <Modal isOpen={modalDocumentType} toggle={toggleModalDocumentType} className={"primary"}>
                                            <ModalHeader toggle={toggleModalDocumentType}>
                                                Document Type Creation
                                            </ModalHeader>
                                            <ModalBody>
                                                {error.status && <Alert color="danger">
                                                    {error.message}
                                                </Alert>}
                                                <CrudDocumentType role="CREATE" data={dataDocument} handle={handleInput} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={() => mangeDocument("CREATE")}>Save</Button>{' '}
                                                <Button color="secondary" onClick={toggleModalDocumentType}>Cancel</Button>
                                            </ModalFooter>
                                        </Modal>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="p-4">
                            <Col sm="12">
                                {documentsList.length > 0 &&
                                    <center>
                                        <ReactTable style={{}}
                                            data={documentsList}
                                            columns={[
                                                {
                                                    Header: 'Name',
                                                    accessor: 'name',
                                                    id: 'id',
                                                },
                                                {
                                                    Header: 'Description',
                                                    id: 'description',
                                                    accessor: (d) => d.description,
                                                },
                                                {
                                                    Header: 'Category',
                                                    accessor: 'category',
                                                },
                                                {
                                                    Header: 'Expires',
                                                    accessor: 'expiration',
                                                }
                                            ]}
                                            defaultPageSize={10}
                                            className="-striped -highlight"
                                        />
                                    </center>
                                }
                            </Col>
                        </Row>
                    </Card>
                    <Card>

                        <Modal isOpen={modalManageDocument} toggle={toggleManageDocument} className={"primary"} size='lg'>
                            <ModalHeader toggle={toggleManageDocument}>
                                Manage Document
                            </ModalHeader>
                            <ModalBody>
                                {error.status && <Alert color="danger">
                                    {error.message}
                                </Alert>}
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={activeTab === 'DELETE' ? 'active bg-transparent' : 'cursor-pointer'}
                                            onClick={() => { toggleTab('DELETE'); }}   >
                                            Delete
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={activeTab === 'EDIT' ? 'active bg-transparent' : 'cursor-pointer'}
                                            onClick={() => { toggleTab('EDIT'); }}   >
                                            Manage
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="DELETE">
                                        <br />
                                        <Row>
                                            <CrudDocumentType role="DELETE" data={dataDocument} handle={handleInput} />
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId="EDIT">
                                        <br />
                                        <Row>
                                            <CrudDocumentType role="EDIT" data={dataDocument} handle={handleInput} />
                                        </Row>
                                    </TabPane>
                                </TabContent>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={() => mangeDocument(activeTab)}>{activeTab}</Button>{' '}
                                <Button color="secondary" onClick={toggleManageDocument}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </Card>
                    {/* <Button color="primary" className='float-end mb-2' onClick={getDocumentList}>Get List</Button> */}

                </Col>
            </Row>
        </>
    )
}
export default DocumentTypes