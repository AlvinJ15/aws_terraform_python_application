import React, {useEffect, useState} from 'react';
import {
    Row, Col, Card, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, Input,
    DropdownItem, Modal, ModalHeader, ModalBody, Spinner,
    ModalFooter
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {downloadDocumentService, updateDocumentService, updateStateDocumentService} from './services/profile.service';
import useFetch from '../../hooks/useFetch';
import useCreateFetch from '../../hooks/useCreateFetch';
import organizationService from '../organization/services/organization.service';
import useDeleteFetch from '../../hooks/useDeleteFetch';
import https from "https";
import useUpdateFetch from '../../hooks/useUpdateFetch';


const ProfileDocuments = () => {
    const params = useParams()
    const navigate = useNavigate()

    const [showMandatory, setShowMandatory] = useState(true);
    const [processingDocuments, setProcessingDocuments] = useState(2);

    // GET document

    const {
        data: profiledocumentsList,
        isLoading,
        refresh: refreshProfiledocumentsList
    } = useFetch({endpoint: `${params.idOrganization}/employees/${params.idEmployee}/documents`})
    const {
        data: fullPerfilData,
        isLoading: loadingMandatory
    } = useFetch({endpoint: `${params.idOrganization}/employees/${params.idEmployee}`})

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

    const updateStateDocument = async (review) => {
        updateStateDocumentService(
            `${params.idOrganization}/employees/${params.idEmployee}/documents/${profileDocument.document_id}`,
            review,
        )
            .then(response => {
                setModalAbierto(false)
                alert(review)
                setProfileDocument({})
                //document.getElementsByClassName("state_" + profileDocument.document_id)[0].innerHTML = Review
                location.reload()


            })
    }

    // GO DASHBOARD

    const goDashboard = () => {
        navigate(`/organization/${params.idOrganization}/employee/${params.idEmployee}/compliancePackages`)
    }
    //getting all organization document types
    const {
        data: documentsList,
        isLoading: isLoadingAllDocuments,
        error,
        refresh
    } = useFetch({endpoint: `${params.idOrganization}/documents`})

    const [mandatoryDocumentsMerged, setMandatoryDocumentsMerged] = useState([])
    const [nonMandatoryDocumentsMerged, setNonMandatoryDocumentsMerged] = useState([])

    useEffect(() => {
        if (!!documentsList) {
            let newListnonMandatory = documentsList.map((item) => {
                // Crea una copia de item
                let newItem = {...item};

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
                        if (compliance_package.document_types) {
                            const document_type = compliance_package.document_types.find(documentType => documentType === item.id);
                            containsValue |= !!document_type;
                        }
                    })
                }
                return !containsValue;
            });
            setNonMandatoryDocumentsMerged(newListnonMandatory);
        }
        setProcessingDocuments(processingDocuments - 1);
    }, [documentsList, profiledocumentsList, fullPerfilData])

    useEffect(() => {
        if (!!documentsList) {
            let newListMandatory = documentsList.map((item) => {
                let newItem = {...item};
                const documentInProfile = profiledocumentsList.find(document => document.document_type_id === newItem.id)
                if (documentInProfile) {
                    newItem.exits = true
                    newItem.status = documentInProfile.status
                    newItem.upload_date = documentInProfile.upload_date
                    newItem.document_id = documentInProfile.document_id
                    newItem.expiry_date = documentInProfile.expiry_date
                } else {
                    newItem.exits = false
                }
                return newItem;
            });
            newListMandatory = newListMandatory.filter((item) => {
                let containsValue = false;
                if (fullPerfilData.compliance_packages) {
                    fullPerfilData.compliance_packages.forEach((compliance_package) => {
                        if (compliance_package.document_types) {
                            const document_type = compliance_package.document_types.find(documentType => documentType === item.id);
                            containsValue |= !!document_type;
                        }
                    })
                }
                ;
                return containsValue;
            });
            setMandatoryDocumentsMerged(newListMandatory);
        }
        setProcessingDocuments(processingDocuments - 1);
    }, [documentsList, fullPerfilData])

    function put(url, data) {
        return fetch(url, {
          method: "PUT",
          body: data,
        });
    }

    //sending file
    const [file, setFile] = useState(new FormData())
    const [sendingFile, setSendingFile] = useState(false)
    const uploadFile = (e, row) => {
        //sending a form data with the file in binary}
        setSendingFile(true)
        const formData = new FormData();
        formData.append('file', '');
        formData.append('document_type_id', row.original.id);
        formData.append('status', "Awaiting Approval");
        formData.append('file_name', e.target.files[0].name);
        formData.append('file_type', e.target.files[0].type);
        organizationService.createNoJson(`${params.idOrganization}/employees/${params.idEmployee}/documents`, formData)
            .then(response => {
                console.log("Upload file to S3");
                put(response.upload_url, e.target.files[0]);
                refreshProfiledocumentsList();
            })
            .catch(error => console.log(error))
            .finally(() => {
                setSendingFile(false);
            })
    }
    const [modalDelete, setModalDelete] = useState({
        state: false,
        id: '',
    })
    const toggleModalDelete = () => {
        setModalDelete({...modalDelete, state: !modalDelete.state})
    }
    const {
        isFetching: isFetchingDelete,
        destroy,
        error: errorDelete
    } = useDeleteFetch({endpoint: `${params.idOrganization}/employees/${params.idEmployee}/documents`})
    const deleteDocumentFile = (idDocuemntType) => {
        //return
        destroy(idDocuemntType)
            .then(res => {
                refresh()
                toggleModalDelete()
                refresh()
            })
    }

    // EDIT DOCUMENT 

    const initialDocument = {
        document_number: '',
        expiry_date: '',
        document_type_id: '',
        file: null,
    }

    const [modalDocument, setModalDocument] = useState(false)
    const [rowSelect, setRowSelect] = useState({})
    const [isUpdateDocument, setIsUpdateDocument] = useState(false)

    const {data,setData, handleInput} = useUpdateFetch({initData : initialDocument })

    const updateDocument = () => {
        const formData = new FormData();
        formData.append('file', '');
        if (data.file){
            formData.append('status', "Awaiting Approval");
            formData.append('file_name', data.file.name);
            formData.append('file_type', data.file.type);
        }
        formData.append('document_number', data.document_number)
        if (data.expiry_date && !data.expiry_date.includes('00:00:00'))
            data.expiry_date = `${data.expiry_date} 00:00:00`;
        formData.append('expiry_date', data.expiry_date)
        setData({...data ,  document_type_id: rowSelect.original.id }) 
        updateDocumentService(`${params.idOrganization}/employees/${params.idEmployee}/documents/${rowSelect.original.document_id}`, formData)
        .then(response => {
            if (data.file){
                console.log("Upload file to S3");
                put(response.upload_url, data.file);
            }
            refreshProfiledocumentsList();
            toggleModalDocument();
        })
    }

    const createDocument = () => {
        const formData = new FormData();
        formData.append('file', '');
        if (data.file){
            formData.append('status', "Awaiting Approval");
            formData.append('file_name', data.file.name);
            formData.append('file_type', data.file.type);
        }
        formData.append('document_type_id', rowSelect.original.id);
        formData.append('document_number', data.document_number)
        if (data.expiry_date && !data.expiry_date.includes('00:00:00'))
            data.expiry_date = `${data.expiry_date} 00:00:00`;
        formData.append('expiry_date', data.expiry_date)
        setSendingFile(true);
        organizationService.createNoJson(`${params.idOrganization}/employees/${params.idEmployee}/documents`, formData)
            .then(response => {
                console.log("Upload file to S3");
                put(response.upload_url, data.file).then( response => {
                    refreshProfiledocumentsList();
                    toggleModalDocument();
                })
            })
            .catch(error => console.log(error))
            .finally(() => {
                setSendingFile(false);
            })
    }

    const toggleModalDocument = (row, isUpdate=true) => {
        setIsUpdateDocument(isUpdate)
        setModalDocument(!modalDocument)
        setRowSelect(row)
    }


    return (
        <>
            <BreadCrumbs/>
            <Row>
                <Col xs="12" md="12">
                    <Card>
                        <Row>
                            <Col sm="12">
                                <div className="p-4">
                                    <Row>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <h5>Profile Documents</h5>
                                            {/* {JSON.stringify(fullPerfilData)} */}
                                            <button onClick={() => goDashboard()}
                                                    className='btn btn-light text-primary'> Go to Dashboard
                                            </button>
                                        </div>
                                    </Row>
                                    <div>
                                        <div className="btn-group my-4" role="group"
                                             aria-label="Basic radio toggle button group">
                                            <label
                                                className={showMandatory ? `btn btn-primary` : `btn btn-outline-primary`}
                                                onClick={() => setShowMandatory(true)}>Mandatory Documents</label>
                                            <label
                                                className={!showMandatory ? `btn btn-primary` : `btn btn-outline-primary`}
                                                onClick={() => setShowMandatory(false)}>Non Mandatory Documents</label>
                                        </div>

                                        {/* Modal EDIT */}

                                        <Modal isOpen={modalDocument} className={"primary"}>
                                            <ModalHeader>
                                                {
                                                    isUpdateDocument ?
                                                        <h5>Document Edit </h5> : <h5>Document Create </h5>
                                                }

                                            </ModalHeader>
                                            <ModalBody>
                                                <div className='mb-3'>
                                                    <label>Numero de Documento</label>
                                                    <input type='text' className='form-control' name='document_number' value={data.document_number} onChange={handleInput} /> 
                                                </div>
                                                <div  className='mb-3'>
                                                <label>Fecha de expiración</label>
                                                    <input type='date' className='form-control' name='expiry_date' value={data.expiry_date} onChange={handleInput} /> 
                                                </div>
                                                <div  className='mb-3'>
                                                    <input type='file' className='form-control' name='file' onChange={handleInput} /> 
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button className='text-primary bg-white' color="light" onClick={toggleModalDocument} >Cancel</Button>
                                                {
                                                    isUpdateDocument ? <Button color="primary" onClick={() => updateDocument()} >Update</Button>
                                                        : <Button color="primary" onClick={() => createDocument()} >Create</Button>
                                                }

                                            </ModalFooter>
                                        </Modal>

                                        {/* End Modal Edit */}
                                        
                                        <Row>
                                            {
                                                isLoading || loadingMandatory || isLoadingAllDocuments || (processingDocuments > 0)
                                                    ? <Spinner>Is Loading ...</Spinner>
                                                    :
                                                    <ComponentCard>

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
                                                                    Cell: row => (
                                                                        (
                                                                            <div className=''>
                                                                                <span
                                                                                    className={'state_' + row.original.document_id}>{row.value}</span>
                                                                            </div>
                                                                        ))
                                                                },
                                                                {
                                                                    Header: 'Expiry',
                                                                    id: 'expiry_date',
                                                                    accessor: (d) => d.expiry_date ? d.expiry_date.replace(' 00:00:00', '') : '',
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
                                                                                <div
                                                                                    className='d-flex justify-content-center'>
                                                                                    {!row.original.exits ?
                                                                                        <>
                                                                                            {/* <Button>Upload</Button> */}
                                                                                            {!sendingFile ?
                                                                                                <>
                                                                                                    <Button className='text-primary bg-white' color="light" onClick={()=>toggleModalDocument(row, false)} >Upload</Button>

                                                                                                    {/*<Input type="file"
                                                                                                            onChange={(e) => {
                                                                                                                uploadFile(e, row)
                                                                                                            }}
                                                                                                            title="Choose a file please"/>*/}
                                                                                                    {/* <label for="file">Select file</label> */}
                                                                                                </>
                                                                                                : "Waiting"}

                                                                                        </> :
                                                                                        <UncontrolledDropdown
                                                                                            className="me-4"
                                                                                            direction="down"
                                                                                            style={{position: 'inherit'}}
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
                                                                                                <DropdownItem
                                                                                                    onClick={() => toggleModalDocument(row)}
                                                                                                >
                                                                                                    Edit
                                                                                                </DropdownItem>
                                                                                                <DropdownItem
                                                                                                    onClick={() => downloadDocumentSelect(row.original.document_id)}
                                                                                                >
                                                                                                    Download
                                                                                                </DropdownItem>
                                                                                                <DropdownItem
                                                                                                    onClick={() => setModalDelete({
                                                                                                        state: true,
                                                                                                        id: row.original.document_id
                                                                                                    })}>
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
                            {{
                                    "Approved":
                                        <button className='btn btn-danger' disabled={isFetchingDelete}
                                                style={{width: '120px'}}
                                                onClick={() => updateStateDocument('Rejected')}>REJECT</button>
                                    ,
                                    "Rejected":
                                        <button className='btn btn-success' disabled={isFetchingDelete}
                                                style={{width: '120px'}}
                                                onClick={() => updateStateDocument('Approved')}>APPROVE</button>
                                }[profileDocument.status] ||
                                <>
                                    <button className='btn btn-danger' disabled={isFetchingDelete}
                                            style={{width: '120px'}} onClick={() => updateStateDocument('Rejected')}>REJECT
                                    </button>
                                    :
                                    <button className='btn btn-success' disabled={isFetchingDelete}
                                            style={{width: '120px'}}
                                            onClick={() => updateStateDocument('Approved')}>APPROVE</button></>
                            }
                        </div>
                    </ModalBody>
                </Modal>
            }

            <Modal isOpen={modalDelete.state} toggle={toggleModalDelete}>
                <ModalHeader toggle={toggleModalDelete}>Confirme Delete Item </ModalHeader>
                <ModalBody className='p-4'>
                    <h5 className='text-center text-muted fw-light mb-3'>It can not be undone</h5>
                    <div className='d-flex justify-content-center gap-3'>
                        <button className='btn btn-success' style={{width: '120px'}}
                                onClick={() => deleteDocumentFile(modalDelete.id)}>YES
                        </button>
                        <button className='btn btn-danger' style={{width: '120px'}} onClick={toggleModalDelete}>NO
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}
export default ProfileDocuments