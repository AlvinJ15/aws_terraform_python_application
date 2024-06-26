import React, { useState } from 'react';
import {
    Row, Col, Card, Button, Alert, TabContent, TabPane, Nav, NavItem, NavLink,
    Spinner,
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CrudFacility from './forms/crudFacility';

import 'react-table-v6/react-table.css';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import useCreateFetch from '../../hooks/useCreateFetch';
import ReactTable from 'react-table-v6';
import useDeleteFetch from '../../hooks/useDeleteFetch';
import useUpdateFetch from '../../hooks/useUpdateFetch';
import OrganizationService from "@/views/organization/services/organization.service.js";

const initialFacilities = {
    name: '',
    description: '',
    type: '',
}


const Facilities = () => {

    const params = useParams();
    const [modalFacility, setModalFacility] = useState(false)
    const [modalManageFacility, setModalManageFacility] = useState(false)
    const [activeFacility, setActiveFacility] = useState('CREATE');

    /**LIST OF FACILITIES */
    const { data: facilitiesList, isLoading, error, refresh } = useFetch({ endpoint: `${params.idOrganization}/facilities` })



    /**CREATE FACILITIES */
    const { data: dataFacility, setData: setDataFacility, validate, isFetching, create, error: errorCreate, setError, handleInput } = useCreateFetch({ endpoint: `${params.idOrganization}/facilities`, initData: initialFacilities })

    const createFacility = () => {

        if (!!!validate({ dataValidate: ['name'] })) {
            create()
                .then(res => {
                    refresh()
                    toggleModalFacility()
                })
        }
    }
    /* update facilities */
    const [dataUpdate, setDataUpdate] = useState({
        name: '',
        description: '',
        category: '',
        expiration: 0,
    })
    const { data: dataFacilityUpdate, setData: setDataFacilityUpdate, validateUpdate, isFetchingUpdate, update, error: errorEdit, setErrorUpdate, handleInput: handleInputUpdate } = useUpdateFetch({ endpoint: `${params.idOrganization}/facilities`, initData: dataUpdate })

    const openUpdateFacility = (data) => {
        setActiveFacility("EDIT") 
        //return
        setDataFacilityUpdate(data)
        setDataUpdate(data)
        toggleModalFacility()
    }
    const updateFacility = () => {
        //update().then(res => {
        //    refresh()
        //    toggleModalFacility()
        //})
        OrganizationService.update(`${params.idOrganization}/facilities/${dataFacilityUpdate.facility_id}`, dataFacilityUpdate)
            .then(response => {
                setDataUpdate(dataFacilityUpdate);
                refresh();
                toggleModalFacility();
            });
    }
    //**DELETE FACILITY */
    const [modalDelete, setModalDelete] = useState({
        estate: false,
        id: '',
    })
    const toggleModalDelete = () => { setModalDelete({ ...modalDelete, estate: !modalDelete.estate }) }
    const { isFetching: isFetchingDelete, destroy, error: errorDelete } = useDeleteFetch({ endpoint: `${params.idOrganization}/facilities` })

    const deleteFacility = (idDocuemntType) => {
        //return
        destroy(idDocuemntType)
            .then(res => {
                refresh()
                toggleModalDelete()
                refresh()
            })
    }

    const toggleModalFacility = () => {
        setError({});
        setDataFacility(initialFacilities);
        setModalFacility(!modalFacility)
    }

    const openNewFacility = () => {
        setActiveFacility("CREATE")
        toggleModalFacility()
    }
    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="12">
                    <Card>
                        <Row>
                            <Col sm="12" >
                                <div className="p-4">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div>
                                            <h5>Facilities</h5>
                                        </div>
                                        <div className='d-flex gap-2'>
                                            <div>
                                                <Button color="primary" className='float-end mb-2' onClick={openNewFacility}>Add New</Button>
                                            </div>
                                        </div>

                                    </div>
                                    <hr />
                                    <div>
                                        <Modal isOpen={modalFacility} toggle={toggleModalFacility} className={"primary"}>
                                            <ModalHeader toggle={toggleModalFacility}>
                                               <h5> Facility {activeFacility == "CREATE" ? " Creation" : " Update"}</h5>
                                            </ModalHeader>
                                            <ModalBody>
                                                {!!Object.keys(errorCreate).length && <Alert color="danger">
                                                    {JSON.stringify(errorCreate)}
                                                </Alert>}
                                                <CrudFacility facility={activeFacility} data={activeFacility == "CREATE" ? dataFacility : dataFacilityUpdate} handle={activeFacility == "CREATE" ? handleInput : handleInputUpdate} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={() => activeFacility == "CREATE" ? createFacility() : updateFacility()} disabled={isFetching || isFetchingUpdate}>{isFetching || isFetchingUpdate ? 'Saving...' : 'Save'}</Button>{' '}
                                                <Button className='text-primary' color="light" onClick={toggleModalFacility} disabled={isFetching}>Cancel</Button>
                                                {/* {JSON.stringify(initialFacilities)}
                                                {JSON.stringify(dataUpdate)} */}
                                            </ModalFooter>
                                        </Modal>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="p-4">
                            {
                                isLoading
                                    ? <Spinner className='mx-auto my-4'>Loading...</Spinner>
                                    : <Col sm="12">
                                        <center>
                                            <ReactTable style={{}}
                                                data={facilitiesList}
                                                columns={[
                                                    {
                                                        Header: 'Name',
                                                        accessor: 'name',
                                                        id: 'name',
                                                    },
                                                    {
                                                        Header: 'Description',
                                                        id: 'description',
                                                        accessor: (d) => d.description,
                                                    },
                                                    {
                                                        Header: 'Type',
                                                        accessor: 'type',
                                                    },
                                                    {
                                                        id: 'id',
                                                        Header: 'Actions',
                                                        sorteable: false,
                                                        accessor: 'facility_id',
                                                        Cell: id => (
                                                            <div className='d-flex gap-3 justify-content-center'>
                                                                <div className=''>
                                                                    <Button color="primary" onClick={() => openUpdateFacility(id.original)}>
                                                                        Edit
                                                                    </Button>
                                                                </div>
                                                                <div className=''>
                                                                    <Button outline color="danger" onClick={() => setModalDelete({ estate: true, id: id.value })}>
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
                                        </center>
                                    </Col>
                            }
                        </Row>
                    </Card>

                </Col>
            </Row >
            <Modal isOpen={modalDelete.estate} toggle={toggleModalDelete}>
                <ModalHeader toggle={toggleModalDelete}>Confirme Delete Item </ModalHeader>
                <ModalBody className='p-4'>
                    <h5 className='text-center text-muted fw-light mb-3'>It can not be undone</h5>
                    <div className='d-flex justify-content-center gap-3'>
                        <button className='btn btn-success' style={{ width: '120px' }} onClick={() => deleteFacility(modalDelete.id)}>YES</button>
                        <button className='btn btn-danger' style={{ width: '120px' }} onClick={toggleModalDelete}>NO</button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}
export default Facilities