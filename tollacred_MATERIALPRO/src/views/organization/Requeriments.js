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
import CrudRequeriment from './forms/crudRequeriment'
const Requeriments = () => {
    /**Adding new Requeriment */
    const [dataRequeriment, setDataRequeriment] = useState({
        id: '',
        packageName: '',
        documentTypes: [],
        roles: [],
    })
    const [documentList, setDocumentList] = useState([])
    const [roleList, setRoleList] = useState([])
    const getDocumentList = () => {
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/documents', "GET").then(response => setDocumentList(response))
    }
    const getRoleList = () => {
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/roles', "GET").then(response => setRoleList(response))
    }
    useEffect(() => {
        getDocumentList()
        getRoleList()
        getRequerimentList()
    }, [])
    const [modalRequeriment, setModalRequeriment] = useState(false);
    const toggleModalRequeriment = () => { setError(false); setModalRequeriment(!modalRequeriment) }
    const handleInput = (e) => {
        const { type, name, value, checked } = e.target
        setDataRequeriment({ ...dataRequeriment, [name]: type == 'checkbox' ? checked : value })
    }
    const [error, setError] = useState({
        status: false,
        message: ''
    })
    const validateFieldsRequeriment = (action = "CREATE") => {
        if (dataRequeriment.packageName == "") {
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
    const mangeRequeriment = (action) => {
        if (validateFieldsRequeriment(action)) {
            alert("mandare a " + action)
            let endpoint = "'organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/save'"
            FetchData(endpoint, "GET", dataRequeriment).then(response => {
                console.log("ar", response)
                setRequerimentsList(response)
            })
        }
    }
    /**end new Requeriment */
    /**LIST OF RequerimentS */
    const [requerimentsList, setRequerimentsList] = useState([])
    const getRequerimentList = () => {
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/compliancePackages', "GET").then(response => {
            setRequerimentsList(response)
        })  
    }
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
                                            <strong>Compliance Requirements</strong>
                                            <Button className='float-end mb-2' color="primary" onClick={toggleModalRequeriment}
                                            >Add Compilance Requeriment Package</Button>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Row>
                                            <ComponentCard title=" Compilance Packages List" >

                                                <ReactTable
                                                    data={requerimentsList}
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
                                                                        <Button color="primary" onClick={toggleModalRequeriment}>
                                                                            Edit
                                                                        </Button>
                                                                    </div>
                                                                    <div className='col-6'>
                                                                        <Button color="danger" onClick={toggleModalRequeriment}>
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
                                        <Offcanvas direction="end" toggle={toggleModalRequeriment} isOpen={modalRequeriment} style={{ width: "63%" }} >
                                            <OffcanvasHeader toggle={toggleModalRequeriment}>
                                                Package Creation
                                            </OffcanvasHeader>
                                            <OffcanvasBody>
                                                <strong>
                                                    Add documents and checks necessary to fulfill compliance requirements.
                                                </strong>
                                                <CrudRequeriment role="CREATE" data={dataRequeriment} handle={handleInput} lists={{ documentList: documentList, roleList: roleList }} />
                                            </OffcanvasBody>
                                        </Offcanvas>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {requerimentsList.length > 0 &&
                        <Row>

                        </Row>
                    }
                </Col>
            </Row>
        </>
    )
}
export default Requeriments