import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle,
    TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import CrudRequeriment from './forms/crudRequeriment'
import OrganizationService from './services/organization.service.js';
import { useNavigate, useParams } from 'react-router-dom';
import useActionRequeriments from './hooks/useActionRequiments';
import useDeleteFetch from '../../hooks/useDeleteFetch';


const Requeriments = () => {

    const navigate = useNavigate()
    const params = useParams()
    const [activeRol, setActiveRol] = useState("CREATE")
    /**Adding new Requeriment */
    const { getDocumentList, dataRequeriment, setDataRequeriment, getFacilityList, documentList, facilityList, handleInput, error, modalRequeriment, toggleModalRequeriment, mangeRequerimentAction, isFetching } = useActionRequeriments(params.idOrganization)
    /**end new Requeriment */

    /**LIST OF RequerimentS */
    const [requerimentsList, setRequerimentsList] = useState([])
    const [loadingList, setLoadingList] = useState(true)
    const getRequerimentList = () => {
        setLoadingList(true)
        OrganizationService.get(`${params.idOrganization}/compliancePackages`)
            .then(response => { setRequerimentsList(response); setLoadingList(false) })
            .catch(error => navigate('*'))
    }

    useEffect(() => {
        getDocumentList()
        getFacilityList()
        getRequerimentList()
    }, [])
    const addRequeriment = () => {
        mangeRequerimentAction(`${params.idOrganization}/compliancePackages`).then(res => {
            getRequerimentList()
            toggleModalRequeriment()
        })
    }
    /*EDIT */
    /**Updaing new Requeriment */
    const [dataUpdate, setDataUpdate] = useState({
        package_id: '',
        name: '',
        document_types: [],
        facilities: [],
    })
    const { dataRequeriment: dataRequerimentUpdate, setDataRequeriment: setDataUpt, handleInput: handleInputUpdate, error: errorUpdate, updateRequerimentAction: update, isFetching: isFetchingUpdate } = useActionRequeriments(params.idOrganization, dataUpdate)
    const openEdit = (data) => {
        setActiveRol("EDIT")
        setDataUpt({
            package_id: data.package_id,
            name: data.name,
            document_types: data.document_types,
            facilities: data.facilities,
        })
        toggleModalRequeriment()
    }
    const updateRequeriment = () => {
        update(`${params.idOrganization}/compliancePackages/${dataRequerimentUpdate.package_id}`).then(res => {
            getRequerimentList()
            toggleModalRequeriment()
        })
    }
    /**end u´date Requeriment */
    const openAddModal = () => {
        setActiveRol("CREATE")
        toggleModalRequeriment()
    }
    //**DELETE Requeriment */
    const [modalDelete, setModalDelete] = useState({
        estate: false,
        id: '',
    })
    const toggleModalDelete = () => { setModalDelete({ ...modalDelete, estate: !modalDelete.estate }) }
    const { isFetching: isFetchingDelete, destroy, error: errorDelete } = useDeleteFetch({ endpoint: `${params.idOrganization}/compliancePackages` })

    const deleteDocumentType = (id) => { 
        //return
        destroy(id)
            .then(res => {
                getRequerimentList()
                toggleModalDelete()
                getRequerimentList()
            })
    }
    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="12">
                    <Card>
                        <Row>
                            <Col sm="12">
                                <div className="p-4">
                                    <Row>
                                        <Col md="12" xs="12" >
                                            <h5>Compliance Requirements</h5>
                                            <Button className='float-end mb-2' color="primary" onClick={openAddModal}
                                            >Add Compliance Requeriment Package</Button>
                                        </Col>
                                    </Row>
                                    <div>
                                        <ComponentCard >
                                            {loadingList ? <Spinner className='mx-auto my-4'>Loading...</Spinner> :
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
                                                                <div className='d-flex gap-3 justify-content-center'>
                                                                    <div className=''>
                                                                        <Button color="primary" onClick={() => openEdit(row.original)}>
                                                                            Edit
                                                                        </Button>
                                                                    </div>
                                                                    <div className=''>
                                                                        <Button outline color="danger"
                                                                            onClick={() => setModalDelete({ estate: true, id: row.original.package_id })}
                                                                        >
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
                                                />}
                                        </ComponentCard>
                                        <Offcanvas direction="end" toggle={toggleModalRequeriment} isOpen={modalRequeriment} style={{ width: "63%" }} >
                                            <OffcanvasHeader toggle={toggleModalRequeriment}>
                                                <h5>Requirement Package Creation</h5>
                                            </OffcanvasHeader>
                                            <OffcanvasBody>
                                                <div className='mb-2'>
                                                    <small>Add documents and checks necessary to fulfill compliance requirements.</small>
                                                </div>
                                                <CrudRequeriment facility="CREATE" data={activeRol == "CREATE" ? dataRequeriment : dataRequerimentUpdate} handle={activeRol == "CREATE" ? handleInput : handleInputUpdate}
                                                    lists={{ documentList: documentList, facilityList: facilityList }} />
                                            </OffcanvasBody>
                                            <div className='d-flex justify-content-end p-3'>
                                                <Button color="primary" onClick={() => { activeRol == "CREATE" ? addRequeriment() : updateRequeriment() }} disabled={isFetching}>
                                                    {isFetching || isFetchingUpdate ? "Saving" : "Save"}
                                                </Button>

                                            </div>
                                        </Offcanvas>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                    <Modal isOpen={modalDelete.estate} toggle={toggleModalDelete}>
                        <ModalHeader toggle={toggleModalDelete}>Confirme Delete Item </ModalHeader>
                        <ModalBody className='p-4'>
                            <h5 className='text-center text-muted fw-light mb-3'>It can not be undone</h5>
                            <div className='d-flex justify-content-center gap-3'>
                                <button className='btn btn-success' style={{ width: '120px' }} onClick={() => deleteDocumentType(modalDelete.id)}>YES</button>
                                <button className='btn btn-danger' style={{ width: '120px' }} onClick={toggleModalDelete}>NO</button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Col>
            </Row>
        </>
    )
}
export default Requeriments