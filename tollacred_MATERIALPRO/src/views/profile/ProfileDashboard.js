import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle,
    TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody,
    Spinner
} from 'reactstrap';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import ProfileOff from './ProfileOff';
import organizationService from '../organization/services/organization.service';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import useDeleteFetch from '../../hooks/useDeleteFetch';
import useOptionsFetch from '../../hooks/useOptionsFetch';
import useUpdateFetch from '../../hooks/useUpdateFetch';
//import CrudRequeriment from './forms/crudRequeriment'


const ProfileDashboard = () => {
    /**Adding new Requeriment */
    const [compliance, setCompliance] = useState({
        id: '',
        package_id: 0,
    })

    const params = useParams()

    const handleInput = (e) => {
        const { type, name, value, checked } = e.target
        setCompliance({ ...compliance, [name]: type == 'checkbox' ? checked : value })
    }
    const [error, setError] = useState({
        status: false,
        message: ''
    })
    const validateFieldsRequeriment = (action = "CREATE") => {
        if (compliance.package_id == 0) {
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
    const { data: packagesEmployee, refresh: refresList, isFetching } = useFetch({ endpoint: `${params.idOrganization}/employees/${params.idEmployee}` })
    /**end new Requeriment */
    /**LIST OF RequerimentS */
    // const [compliancePackagesList, setCompliancePackagesList] = useState([])

    const { data: compliancePackagesList, refresh, isLoading } = useFetch({ endpoint: `${params.idOrganization}/compliancePackages` })


    const addNewCompilance = () => {
        let compliance_packages = [...packagesEmployee.compliance_packages]
        compliance_packages.push(compliance)
        compliance_packages = compliance_packages.map(item => item.package_id)
        update({ compliance_packages }).then(res => {
            refresList()
        })
    }
    //**DELETE DOCUMENT */
    const [modalDelete, setModalDelete] = useState({
        state: false,
        id: '',
    })
    const toggleModalDelete = () => { setModalDelete({ ...modalDelete, state: !modalDelete.state }) }
    const { isFetching: isFetchingDelete, update, error: errorDelete } = useUpdateFetch({ endpoint: `${params.idOrganization}/employees/${params.idEmployee}` })

    const deleteDocumentType = (id) => {
        let compliance_packages = [...packagesEmployee.compliance_packages]
        //delete the id item in  actives array
        compliance_packages = compliance_packages.filter(item => item.package_id != id)
        //making a array only with the package_id in compliance_packages
        compliance_packages = compliance_packages.map(item => item.package_id)
        update({ compliance_packages }).then(res => {
            refresList()
            toggleModalDelete()
            refresList()
        })
    }

    return (
        <>
            {/* <BreadCrumbs /> */}
            <ProfileOff>
                <Row>
                    <Col xs="12" md="12" lg="12">
                        <Card>
                            <Row>
                                <Col sm="12">
                                    <div className="p-4">
                                        <Row>
                                            <Col md="9" xs="12" >
                                                <strong>Compliance Requirements Packages</strong>
                                            </Col>
                                            <Col md="3" xs="12" >
                                                {
                                                    isLoading
                                                        ? <center><Spinner>Is Loading ...</Spinner></center>
                                                        : <Row className='gap-2'>
                                                            <select className='form-select' onChange={handleInput} name="package_id" value={compliance.package_id}>
                                                                <option>Select</option>
                                                                {compliancePackagesList.map((item, index) => (
                                                                    <option key={index} value={item.package_id}>{item.name}</option>
                                                                ))}
                                                            </select>
                                                            <Button className='' color="primary" onClick={addNewCompilance}
                                                            >Add Compilance Package</Button>
                                                        </Row>
                                                }
                                            </Col>
                                        </Row>
                                        <div>
                                            <Row>
                                                <ComponentCard title=" Compilance Packages List" >
                                                    {isFetching ? <Spinner className='mx-auto my-4'>Loading...</Spinner> :
                                                        <ReactTable

                                                            data={packagesEmployee.compliance_packages}
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
                                                                    Header: 'Actions',
                                                                    accessor: 'package_id',
                                                                    sorteable: false,
                                                                    Cell: row => (
                                                                        <div className='row'>
                                                                            {/* <div className='col-6'>
                                                                            <Button color="primary" onClick={() => { }}>
                                                                                Edit
                                                                            </Button>
                                                                        </div> */}
                                                                            <div className='col-6'>
                                                                                <Button disabled={isFetchingDelete} color="danger" onClick={() => setModalDelete({ state: true, id: row.value })}>
                                                                                    {isFetchingDelete ? "Wait" : "Delete"}
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                },
                                                            ]}
                                                            defaultPageSize={10}
                                                            className="-striped -highlight"
                                                        />
                                                    }
                                                </ComponentCard>
                                            </Row>
                                            <Modal isOpen={modalDelete.state} toggle={toggleModalDelete}>
                                                <ModalHeader toggle={toggleModalDelete}>Confirme Delete Item </ModalHeader>
                                                <ModalBody className='p-4'>
                                                    <h5 className='text-center text-muted fw-light mb-3'>It can not be undone</h5>
                                                    <div className='d-flex justify-content-center gap-3'>
                                                        <button className='btn btn-success' style={{ width: '120px' }} onClick={() => deleteDocumentType(modalDelete.id)} disabled={isFetchingDelete}>
                                                            {isFetchingDelete ? "Deleting" : "YES"}
                                                        </button>
                                                        <button className='btn btn-danger' style={{ width: '120px' }} onClick={toggleModalDelete} disabled={isFetchingDelete}>
                                                            {isFetchingDelete ? "..." : "NO"}
                                                        </button>
                                                    </div>
                                                </ModalBody>
                                            </Modal>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>


                    </Col>
                </Row>
            </ProfileOff>
        </>
    )
}
export default ProfileDashboard