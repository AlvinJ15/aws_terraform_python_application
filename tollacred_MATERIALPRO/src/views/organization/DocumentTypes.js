import React, { useState } from 'react';
import {
    Row, Col, Card, Button, Alert, TabContent, TabPane, Nav, NavItem, NavLink,
    Spinner,
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CrudDocumentType from './forms/crudDocumentType';

import 'react-table-v6/react-table.css';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import useCreateFetch from '../../hooks/useCreateFetch';
import ReactTable from 'react-table-v6';
import useDeleteFetch from '../../hooks/useDeleteFetch';
import useUpdateFetch from '../../hooks/useUpdateFetch';
import organizationService from "@/views/organization/services/organization.service.js";

const initialDocumentTypes = {
    name: '',
    description: '',
    category: '',
    expiration: 0,
}


const DocumentTypes = () => {

    const params = useParams();
    const [modalDocumentType, setModalDocumentType] = useState(false)
    const [modalManageDocument, setModalManageDocument] = useState(false)
    const [activeFacility, setActiveFacility] = useState('CREATE');

    /**LIST OF DOCUMENTS */
    const { data: documentsList, isLoading, error, refresh } = useFetch({ endpoint: `${params.idOrganization}/documents` })



    /**CREATE DOCUMENTS */
    const { data: dataDocument, setData: setDataDocument, validate, isFetching, create, error: errorCreate, setError, handleInput } = useCreateFetch({ endpoint: `${params.idOrganization}/documents`, initData: initialDocumentTypes })

    const createDocumentType = () => {

        if (!!!validate({ dataValidate: ['name'] })) {
            create()
                .then(res => {
                    refresh()
                    toggleModalDocumentType()
                })
        }
    }
    /* update documents */
    const [dataUpdate, setDataUpdate] = useState({
        name: '',
        description: '',
        category: '',
        expiration: 0,
    })
    const { data: dataDocumentUpdate, setData: setDataDocumentUpdate, validateUpdate, isFetchingUpdate, update, error: errorEdit, setErrorUpdate, handleInput: handleInputUpdate } = useUpdateFetch({ endpoint: `${params.idOrganization}/documents/`, initData: dataUpdate })

    const openUpdateDocumentType = (data) => {
        setActiveFacility("EDIT") 
        //return
        setDataDocumentUpdate(data);

        //setDataUpdate(data)
        toggleModalDocumentType()
    }
    const updateDocumentType = () => {
        //update().then(res => {
        //    refresh()
        //    toggleModalDocumentType()
        //})

        organizationService.update(`${params.idOrganization}/documents/${dataDocumentUpdate.id}`, dataDocumentUpdate)
            .then(response => {
                setDataUpdate(dataDocumentUpdate);
                refresh();
                toggleModalDocumentType();
            });
    }
    //**DELETE DOCUMENT */
    const [modalDelete, setModalDelete] = useState({
        state: false,
        id: '',
    })
    const toggleModalDelete = () => { setModalDelete({ ...modalDelete, state: !modalDelete.state }) }
    const { isFetching: isFetchingDelete, destroy, error: errorDelete } = useDeleteFetch({ endpoint: `${params.idOrganization}/documents` })

    const deleteDocumentType = (idDocuemntType) => {
        //return
        destroy(idDocuemntType)
            .then(res => {
                refresh()
                toggleModalDelete()
                refresh()
            })
    }

    const toggleModalDocumentType = () => {
        setError({});
        setDataDocument(initialDocumentTypes);
        setModalDocumentType(!modalDocumentType)
    }

    const openNewDocumentType = () => {
        setActiveFacility("CREATE")
        toggleModalDocumentType()
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
                                            <h5>Document Type</h5>
                                        </div>
                                        <div className='d-flex gap-2'>
                                            <div>
                                                <Button color="primary" className='float-end mb-2' onClick={openNewDocumentType}>Add New</Button>
                                            </div>
                                        </div>

                                    </div>
                                    <hr />
                                    <div>
                                        <Modal isOpen={modalDocumentType} toggle={toggleModalDocumentType} className={"primary"}>
                                            <ModalHeader toggle={toggleModalDocumentType}>
                                                <h5>Document Type {activeFacility == "CREATE" ? " Creation" : " Update"}</h5>
                                            </ModalHeader>
                                            <ModalBody>
                                                {!!Object.keys(errorCreate).length && <Alert color="danger">
                                                    {JSON.stringify(errorCreate)}
                                                </Alert>}
                                                <CrudDocumentType facility={activeFacility} data={activeFacility == "CREATE" ? dataDocument : dataDocumentUpdate} handle={activeFacility == "CREATE" ? handleInput : handleInputUpdate} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button className='text-primary bg-white' color="light" onClick={toggleModalDocumentType} disabled={isFetching}>Cancel</Button>
                                                <Button color="primary" onClick={() => activeFacility == "CREATE" ? createDocumentType() : updateDocumentType()} disabled={isFetching}>{isFetching || isFetchingUpdate ? 'Saving...' : 'Save'}</Button>{' '}
                                                {/* {JSON.stringify(initialDocumentTypes)}
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
                                                data={documentsList}
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
                                                        Header: 'Category',
                                                        accessor: 'category',
                                                    },
                                                    {
                                                        Header: 'Expires',
                                                        accessor: 'expiration',
                                                    },
                                                    {
                                                        id: 'id',
                                                        Header: 'Actions',
                                                        sorteable: false,
                                                        accessor: 'id',
                                                        Cell: id => (
                                                            <div className='d-flex gap-3 justify-content-center'>
                                                                <div className=''>
                                                                    <Button color="primary" onClick={() => openUpdateDocumentType(id.original)}>
                                                                        Edit
                                                                    </Button>
                                                                </div>
                                                                <div className=''>
                                                                    <Button outline color="danger" onClick={() => setModalDelete({ state: true, id: id.value })}>
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
            <Modal isOpen={modalDelete.state} toggle={toggleModalDelete}>
                <ModalHeader toggle={toggleModalDelete}>Confirme Delete Item </ModalHeader>
                <ModalBody className='p-4'>
                    <h5 className='text-center text-muted fw-light mb-3'>It can not be undone</h5>
                    <div className='d-flex justify-content-center gap-3'>
                        <button className='btn btn-success' style={{ width: '120px' }} onClick={() => deleteDocumentType(modalDelete.id)}>YES</button>
                        <button className='btn btn-danger' style={{ width: '120px' }} onClick={toggleModalDelete}>NO</button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}
export default DocumentTypes