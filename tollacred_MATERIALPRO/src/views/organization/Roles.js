import React, { useState } from 'react';
import {
    Row, Col, Card, Button, Alert, TabContent, TabPane, Nav, NavItem, NavLink,
    Spinner,
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CrudRole from './forms/crudRole';

import 'react-table-v6/react-table.css';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import useCreateFetch from '../../hooks/useCreateFetch';
import ReactTable from 'react-table-v6';
import useDeleteFetch from '../../hooks/useDeleteFetch';
import useUpdateFetch from '../../hooks/useUpdateFetch';
import organizationService from "@/views/organization/services/organization.service.js";

const initialRoles = {
    name: '',
    description: '',
    type: '',
}


const Roles = () => {

    const params = useParams();
    const [modalRole, setModalRole] = useState(false)
    const [modalManageRole, setModalManageRole] = useState(false)
    const [activeRole, setActiveRole] = useState('CREATE');

    /**LIST OF ROLES */
    const { data: rolesList, isLoading, error, refresh } = useFetch({ endpoint: `${params.idOrganization}/roles` })



    /**CREATE ROLES */
    const { data: dataRole, setData: setDataRole, validate, isFetching, create, error: errorCreate, setError, handleInput } = useCreateFetch({ endpoint: `${params.idOrganization}/roles`, initData: initialRoles })

    const createRole = () => {

        if (!!!validate({ dataValidate: ['name'] })) {
            create()
                .then(res => {
                    refresh()
                    toggleModalRole()
                })
        }
    }
    /* update roles */
    const [dataUpdate, setDataUpdate] = useState({
        name: '',
        description: '',
        category: '',
        expiration: 0,
    })
    const { data: dataRoleUpdate, setData: setDataRoleUpdate, validateUpdate, isFetchingUpdate, update, error: errorEdit, setErrorUpdate, handleInput: handleInputUpdate } = useUpdateFetch({ endpoint: `${params.idOrganization}/roles`, initData: dataUpdate })

    const openUpdateRole = (data) => {
        setActiveRole("EDIT") 
        //return
        setDataRoleUpdate(data)
        setDataUpdate(data)
        toggleModalRole()
    }
    const updateRole = () => {
        //update().then(res => {
        //    refresh()
        //    toggleModalRole()
        //})
        organizationService.update(`${params.idOrganization}/roles/${dataRoleUpdate.role_id}`, dataRoleUpdate)
            .then(response => {
                setDataUpdate(dataRoleUpdate);
                refresh();
                toggleModalRole();
            });
    }
    //**DELETE ROLE */
    const [modalDelete, setModalDelete] = useState({
        estate: false,
        id: '',
    })
    const toggleModalDelete = () => { setModalDelete({ ...modalDelete, estate: !modalDelete.estate }) }
    const { isFetching: isFetchingDelete, destroy, error: errorDelete } = useDeleteFetch({ endpoint: `${params.idOrganization}/roles` })

    const deleteRole = (idDocuemntType) => {
        //return
        destroy(idDocuemntType)
            .then(res => {
                refresh()
                toggleModalDelete()
                refresh()
            })
    }

    const toggleModalRole = () => {
        setError({});
        setDataRole(initialRoles);
        setModalRole(!modalRole)
    }

    const openNewRole = () => {
        setActiveRole("CREATE")
        toggleModalRole()
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
                                            <h5>Roles</h5>
                                        </div>
                                        <div className='d-flex gap-2'>
                                            <div>
                                                <Button color="primary" className='float-end mb-2' onClick={openNewRole}>Add New</Button>
                                            </div>
                                        </div>

                                    </div>
                                    <hr />
                                    <div>
                                        <Modal isOpen={modalRole} toggle={toggleModalRole} className={"primary"}>
                                            <ModalHeader toggle={toggleModalRole}>
                                               <h5> Role {activeRole == "CREATE" ? " Creation" : " Update"}</h5>
                                            </ModalHeader>
                                            <ModalBody>
                                                {!!Object.keys(errorCreate).length && <Alert color="danger">
                                                    {JSON.stringify(errorCreate)}
                                                </Alert>}
                                                <CrudRole role={activeRole} data={activeRole == "CREATE" ? dataRole : dataRoleUpdate} handle={activeRole == "CREATE" ? handleInput : handleInputUpdate} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={() => activeRole == "CREATE" ? createRole() : updateRole()} disabled={isFetching || isFetchingUpdate}>{isFetching || isFetchingUpdate ? 'Saving...' : 'Save'}</Button>{' '}
                                                <Button className='text-primary' color="light" onClick={toggleModalRole} disabled={isFetching}>Cancel</Button>
                                                {/* {JSON.stringify(initialRoles)}
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
                                                data={rolesList}
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
                                                        accessor: 'role_id',
                                                        Cell: id => (
                                                            <div className='d-flex gap-3 justify-content-center'>
                                                                <div className=''>
                                                                    <Button color="primary" onClick={() => openUpdateRole(id.original)}>
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
                        <button className='btn btn-success' style={{ width: '120px' }} onClick={() => deleteRole(modalDelete.id)}>YES</button>
                        <button className='btn btn-danger' style={{ width: '120px' }} onClick={toggleModalDelete}>NO</button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}
export default Roles