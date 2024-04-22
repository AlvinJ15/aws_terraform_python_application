import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, Input,
    DropdownItem, Modal, ModalHeader, ModalBody, Spinner
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { downloadDocumentService, updateStateDocument } from './services/profile.service';
import useFetch from '../../hooks/useFetch';
import useCreateFetch from '../../hooks/useCreateFetch';
import organizationService from '../organization/services/organization.service';
import useDeleteFetch from '../../hooks/useDeleteFetch';


const ProfileDocuments = () => {
    const params = useParams()
    const navigate = useNavigate()

    const [showMandatory, setShowMandatory] = useState(true)

    // GET document 

    const { data: profiledocumentsList, isLoading, refresh: refreshProfiledocumentsList } = useFetch({ endpoint: `${params.idOrganization}/employees/${params.idEmployee}/documents` })
    const { data: fullPerfilData, isLoading: loadingMandatory } = useFetch({ endpoint: `${params.idOrganization}/employees/${params.idEmployee}` })

    // DELETE document

    // const {isFetching: isFechingDestroy, destroy} = useDeleteFetch({endpoint: `${params.idOrganization}/employees/${params.idEmployee}/documents`} )

    // const deleteDocument = (id) => {
    //     destroy(id)
    //     .then(response => {
    //         refreshProfiledocumentsList()
    //     })
    // }

    // Download

    const downloadDocumentSelect = async (idDocument) => {
        console.log("qq", idDocument)
        //return
        await downloadDocumentService(`${params.idOrganization}/employees/${params.idEmployee}/documents/${idDocument}`)
    }

    // MODAL 

    const [modalAbierto, setModalAbierto] = useState(false);

    const toggleModal = () => {
        setModalAbierto(!modalAbierto)
    };
    // SELECT REWIEW

    const [profileDocument, setProfileDocument] = useState({})

    const updateModal = (id) => {
        setModalAbierto(true)
        const temp = profiledocumentsList.find(document => document.document_id == id)
        setProfileDocument(temp)
    }

    // UPDATE STATUS

    const updateDocument = async (review) => {
        updateStateDocument(
            `${params.idOrganization}/employees/${params.idEmployee}/documents/${profileDocument.document_id}`,
            review,
        )
            .then(response => {
                setModalAbierto(false)
                alert(review)
                setProfileDocument({})
            })
    }

    // GO DASHBOARD

    const goDashboard = () => {
        navigate(`/organization/${params.idOrganization}/employee/${params.idEmployee}/compliancePackages`)
    }
    //getting all organization document types
    const { data: documentsList, isLoading: isLoadingAllDocuments, error, refresh } = useFetch({ endpoint: `${params.idOrganization}/documents` })

    const [mandatoryDocumentsMerged, setMandatoryDocumentsMerged] = useState([])
    const [nonMandatoryDocumentsMerged, setNonMandatoryDocumentsMerged] = useState([])
    // useEffect(() => {
    //     if (!!documentsList) {
    //         //non mandatory
    //         let newListnonMandatory = documentsList.map((item) => {
    //             //searching if item is in profiledocumentsList
    //             const documentInProfile = profiledocumentsList.find(document => document.document_type_id == item.id)
    //             //console.log("hay o no", documentInProfile)
    //             if (documentInProfile) {
    //                 item.exits = true
    //                 item.status = documentInProfile.status
    //                 item.upload_date = documentInProfile.upload_date
    //                 item.document_id = documentInProfile.document_id
    //             } else {
    //                 item.exits = false
    //             }
    //             //item.exits = documentInProfile ? documentInProfile.document_type_id :
    //             return item
    //         })
    //         //console.log("nonMandatoryDocumentsMerged", newList)
    //         setNonMandatoryDocumentsMerged(newListnonMandatory)
    //     }
    // }, [documentsList, profiledocumentsList])

    // useEffect(() => {
    //     if (!!documentsList) {
    //         //mandatory documents
    //         let temp = [...documentsList]
    //         let newListMandatory = []
    //         temp.forEach((item) => {
    //             let newItem = item
    //             console.log("miperfil", fullPerfilData)
    //             if (typeof fullPerfilData.compliance_packages != "undefined") {
    //                 let arrtemp = fullPerfilData.compliance_packages
    //                 arrtemp.forEach(element => {
    //                     const documentInProfile2 = element.document_types.find(document => document == item.id)
    //                     console.log("qqqqq", fullPerfilData.compliance_packages, documentInProfile2)
    //                     if (documentInProfile2) {
    //                         newItem.exits = true
    //                         newItem.status = documentInProfile2.status
    //                         newItem.upload_date = documentInProfile2.upload_date
    //                         newItem.document_id = documentInProfile2.document_id
    //                     } else {
    //                         newItem.exits = false
    //                     }
    //                 })

    //                 //return newItem
    //                 console.log("new armando", newItem)
    //                 newListMandatory.push(newItem)
    //             }
    //         })
    //         //console.log("nonMandatoryDocumentsMerged", newList)
    //         setMandatoryDocumentsMerged(newListMandatory)
    //     }
    // }, [documentsList, fullPerfilData])

    useEffect(() => {
        if (!!documentsList) {
            let newListnonMandatory = documentsList.map((item) => {
                // Crea una copia de item
                let newItem = { ...item };

                const documentInProfile = profiledocumentsList.find(document => document.document_type_id === newItem.id)
                if (documentInProfile) {
                    newItem.exits = true
                    newItem.status = documentInProfile.status
                    newItem.upload_date = documentInProfile.upload_date
                    newItem.document_id = documentInProfile.document_id
                } else {
                    newItem.exits = false
                }
                return newItem;
            });
            newListnonMandatory = newListnonMandatory.filter((item) => {
                let containsValue = false;
                if (fullPerfilData.compliance_packages) {
                    fullPerfilData.compliance_packages.forEach((compliance_package) => {
                        if (compliance_package.document_types){
                            const document_type = compliance_package.document_types.find(documentType => documentType === item.id);
                            containsValue |= !!document_type;
                        }
                    })
                }
                return !containsValue;
            });
            setNonMandatoryDocumentsMerged(newListnonMandatory)
        }
    }, [documentsList, profiledocumentsList, fullPerfilData])

    useEffect(() => {
        if (!!documentsList) {
            let newListMandatory = documentsList.map((item) => {
                let newItem = { ...item };
                const documentInProfile = profiledocumentsList.find(document => document.document_type_id === newItem.id)
                if (documentInProfile) {
                    newItem.exits = true
                    newItem.status = documentInProfile.status
                    newItem.upload_date = documentInProfile.upload_date
                    newItem.document_id = documentInProfile.document_id
                } else {
                    newItem.exits = false
                }
                return newItem;
            });
            newListMandatory = newListMandatory.filter((item) => {
                let containsValue = false;
                if (fullPerfilData.compliance_packages) {
                    fullPerfilData.compliance_packages.forEach((compliance_package) => {
                        if (compliance_package.document_types){
                            const document_type = compliance_package.document_types.find(documentType => documentType === item.id);
                            containsValue |= !!document_type;
                        }
                    })
                };
                return containsValue;
            });
            setMandatoryDocumentsMerged(newListMandatory);
        }
    }, [documentsList, fullPerfilData])


    //sending file
    const [file, setFile] = useState(new FormData())
    const [sendingFile, setSendingFile] = useState(false)
    const uploadFile = (e, row) => {
        //sending a form data with the file in binary}
        //console.log("qq", row.original.id)
        setSendingFile(true)
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('document_type_id', row.original.id);
        formData.append('status', "Awaiting Approval");
        organizationService.createNoJson(`${params.idOrganization}/employees/${params.idEmployee}/documents`, formData)
            .then(response => { refreshProfiledocumentsList() })
            .catch(error => console.log(error))
            .finally(() => { setSendingFile(false); })
    }
    const [modalDelete, setModalDelete] = useState({
        state: false,
        id: '',
    })
    const toggleModalDelete = () => { setModalDelete({ ...modalDelete, state: !modalDelete.state }) }
    const { isFetching: isFetchingDelete, destroy, error: errorDelete } = useDeleteFetch({ endpoint: `${params.idOrganization}/employees/${params.idEmployee}/documents` })
    const deleteDocumentFile = (idDocuemntType) => {
        //return
        destroy(idDocuemntType)
            .then(res => {
                refresh()
                toggleModalDelete()
                refresh()
            })
    }
    return (
        <>
            <BreadCrumbs />
            <Row>
                <Col xs="12" md="12" >
                    <Card>
                        <Row>
                            <Col sm="12">
                                <div className="p-4">
                                    <Row>
                                        <Col md="12" xs="12" >
                                            <strong>ProfileDocuments</strong>
                                            {/* {JSON.stringify(fullPerfilData)} */}
                                            <button onClick={() => goDashboard()} className='btn btn-light float-end mb-2 '> Go to Dashboard</button>
                                        </Col>
                                    </Row>
                                    <div>
                                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <label className={showMandatory ? `btn btn-primary` : `btn btn-outline-primary`} onClick={() => setShowMandatory(true)} >Mandatory Documents</label>
                                            <label className={!showMandatory ? `btn btn-primary` : `btn btn-outline-primary`} onClick={() => setShowMandatory(false)}>Non Mandatory Documents</label>
                                        </div>
                                        <Row>
                                            {
                                                isLoading || loadingMandatory || isLoadingAllDocuments
                                                    ? <Spinner>Is Loading ...</Spinner>
                                                    :
                                                    <ComponentCard title="ProfileDocuments List" >

                                                        <ReactTable
                                                            data={showMandatory ? mandatoryDocumentsMerged : nonMandatoryDocumentsMerged}
                                                            columns={[
                                                                {
                                                                    Header: 'Name',
                                                                    accessor: 'name',
                                                                    id: 'name',
                                                                },
                                                                {
                                                                    Header: 'Status',
                                                                    id: 'status',
                                                                    accessor: (d) => d.status,
                                                                },
                                                                {
                                                                    Header: 'Expiry',
                                                                    accessor: 'expiration',
                                                                    show: showMandatory
                                                                },
                                                                {
                                                                    Header: 'Approval',
                                                                    accessor: 'approval',
                                                                },
                                                                {
                                                                    Header: 'state',
                                                                    accessor: 'state',
                                                                    id: 'state',
                                                                },
                                                                {
                                                                    Header: 'Actions',
                                                                    //accessor: 'document_id',
                                                                    accessor: 'exits',
                                                                    sorteable: false,
                                                                    Cell: row => (
                                                                        (
                                                                            <div className=''>
                                                                                <div className='d-flex justify-content-center'>
                                                                                    {!row.original.exits ?
                                                                                        <>
                                                                                            {/* <Button>Upload</Button> */}
                                                                                            {!sendingFile ?
                                                                                                <>
                                                                                                    <Input type="file" onChange={(e) => { uploadFile(e, row) }} title="Choose a file please" />
                                                                                                    {/* <label for="file">Select file</label> */}
                                                                                                </>
                                                                                                : "Waiting"}

                                                                                        </> :
                                                                                        <UncontrolledDropdown
                                                                                            className="me-4"
                                                                                            direction="down"
                                                                                            style={{ position: 'inherit' }}
                                                                                        >
                                                                                            <DropdownToggle
                                                                                                caret
                                                                                                color="primary"
                                                                                            >
                                                                                                Actions
                                                                                            </DropdownToggle>
                                                                                            <DropdownMenu>
                                                                                                <DropdownItem
                                                                                                    onClick={() => updateModal(row.original.document_id)}
                                                                                                >
                                                                                                    Review
                                                                                                </DropdownItem>
                                                                                                <DropdownItem disabled={true}
                                                                                                    onClick={() => { }}
                                                                                                >
                                                                                                    Edit
                                                                                                </DropdownItem>
                                                                                                <DropdownItem
                                                                                                    onClick={() => downloadDocumentSelect(row.original.document_id)}
                                                                                                >
                                                                                                    Download
                                                                                                </DropdownItem>
                                                                                                <DropdownItem onClick={() => setModalDelete({ state: true, id: row.original.document_id })}>
                                                                                                    Delete
                                                                                                </DropdownItem>
                                                                                            </DropdownMenu>
                                                                                        </UncontrolledDropdown>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        )
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
                                            }
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>


                </Col>
            </Row>
            {
                modalAbierto &&
                <Modal isOpen={modalAbierto} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Review : {profileDocument.document_id} </ModalHeader>
                    <ModalBody className='p-4'>
                        <h5 className='text-center text-muted fw-light mb-3'>Select an option:</h5>
                        <div className='d-flex justify-content-center gap-3'>
                            <button className='btn btn-success' style={{ width: '120px' }} onClick={() => updateDocument('Approved')}>APPROVE</button>
                            <button className='btn btn-danger' style={{ width: '120px' }} onClick={() => updateDocument('Rejected')}>REJECT</button>
                        </div>
                    </ModalBody>
                </Modal>
            }

            <Modal isOpen={modalDelete.state} toggle={toggleModalDelete}>
                <ModalHeader toggle={toggleModalDelete}>Confirme Delete Item </ModalHeader>
                <ModalBody className='p-4'>
                    <h5 className='text-center text-muted fw-light mb-3'>It can not be undone</h5>
                    <div className='d-flex justify-content-center gap-3'>
                        <button className='btn btn-success' style={{ width: '120px' }} onClick={() => deleteDocumentFile(modalDelete.id)}>YES</button>
                        <button className='btn btn-danger' style={{ width: '120px' }} onClick={toggleModalDelete}>NO</button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}
export default ProfileDocuments