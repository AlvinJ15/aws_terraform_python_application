import React, {useEffect, useState} from 'react';
import {
  Row, Col, Card, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, Input,
  DropdownItem, Modal, ModalHeader, ModalBody, Spinner,
  ModalFooter, Progress
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {downloadDocumentService, updateDocumentService, updateStateDocumentService} from './services/profile.service';
import useDeleteFetch from '../../hooks/useDeleteFetch';
import useUpdateFetch from '../../hooks/useUpdateFetch';
import EmployeeService from "@/views/profile/services/employee.service.js";
import OrganizationService from "../organization/services/organization.service.js";
import AwsHelper from "@/utilities/awsHelper.js";


const ProfileDocuments = () => {
  const params = useParams()
  const navigate = useNavigate()

  const [showMandatory, setShowMandatory] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [newUpdated, setNewUpdated] = useState(0);


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

  const updateModal = (document) => {
    setModalAbierto(true)
    setProfileDocument(document)
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

  const [mandatoryDocumentsMerged, setMandatoryDocumentsMerged] = useState([])
  const [nonMandatoryDocumentsMerged, setNonMandatoryDocumentsMerged] = useState([])

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      EmployeeService.getEmployee(params.idOrganization, params.idEmployee),
      EmployeeService.getEmployeeDocuments(params.idOrganization, params.idEmployee),
      OrganizationService.getDocuments(params.idOrganization)
    ]).then(async (responses) => {
      let fullPerfilData = responses[0];
      let profiledocumentsList = responses[1];
      let documentsList = responses[2];

      if (documentsList) {
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
          return containsValue;
        });
        setMandatoryDocumentsMerged(newListMandatory);
      }
      setIsLoading(false);
      console.log(newUpdated);
    });
  }, [newUpdated]);

  //sending file
  const [file, setFile] = useState(new FormData())
  const [sendingFile, setSendingFile] = useState(false)
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
    setIsLoading(true);
    EmployeeService.deleteEmployeedocument(params.idOrganization, params.idEmployee, idDocuemntType)
      .then(res => {
        setIsLoading(false);
        toggleModalDelete();
        setNewUpdated(newUpdated + 1);
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

  const {data, setData, handleInput} = useUpdateFetch({initData: initialDocument})

  const documentTags = {
    file_visibility: 'all'
  }

  const updateDocument = () => {
    setIsLoading(true);
    setLoadingPercentage(10);
    const formData = new FormData();
    formData.append('file', '');
    if (data.file) {
      formData.append('status', "Awaiting Approval");
      formData.append('file_name', data.file.name);
      formData.append('file_type', data.file.type);
    }
    formData.append('document_number', data.document_number)
    if (data.expiry_date && !data.expiry_date.includes('00:00:00'))
      data.expiry_date = `${data.expiry_date} 00:00:00`;
    formData.append('expiry_date', data.expiry_date)
    setData({...data, document_type_id: rowSelect.original.id})
    updateDocumentService(`${params.idOrganization}/employees/${params.idEmployee}/documents/${rowSelect.original.document_id}`, formData)
      .then(response => {
        setLoadingPercentage(50);
        if (data.file) {
          console.log("Upload file to S3");
          AwsHelper.uploadFile(response.upload_url, data.file, documentTags).then( response => {
              setLoadingPercentage(100);
              setIsLoading(false);
              setNewUpdated(newUpdated + 1);
              toggleModalDocument();
            }
          );
        } else {
          setLoadingPercentage(100);
          setIsLoading(false);
          setNewUpdated(newUpdated + 1);
          toggleModalDocument();
        }
      })
  }

  const createDocument = () => {
    setIsLoading(true);
    setLoadingPercentage(10);
    const formData = new FormData();
    formData.append('file', '');
    if (data.file) {
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
    OrganizationService.createNoJson(`${params.idOrganization}/employees/${params.idEmployee}/documents`, formData)
      .then(response => {
        setLoadingPercentage(50);
        console.log("Upload file to S3");
        AwsHelper.uploadFile(response.upload_url, data.file, documentTags).then(response => {
          setLoadingPercentage(100);
          setIsLoading(false);
          setNewUpdated(newUpdated + 1);
          toggleModalDocument();
        })
      })
      .catch(error => console.log(error))
      .finally(() => {
        setSendingFile(false);
      })
  }

  const toggleModalDocument = (row, isUpdate = true) => {
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
                            'Document Edit' : 'Document Create'
                        }

                      </ModalHeader>
                      <ModalBody>
                        <div className='mb-3'>
                          <label>Document Number</label>
                          <input type='text' className='form-control' name='document_number'
                                 value={data.document_number} onChange={handleInput}/>
                        </div>
                        <div className='mb-3'>
                          <label>Expiration Date</label>
                          <input type='date' className='form-control' name='expiry_date' value={data.expiry_date}
                                 onChange={handleInput}/>
                        </div>
                        <div className='mb-3'>
                          <input type='file' className='form-control' name='file' onChange={handleInput}/>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        {
                          isLoading ?
                            <Progress
                              className="mb-3" striped color="primary" value={loadingPercentage}
                              style={{height: '30px', width: '100%'}}>
                              {`${loadingPercentage}%`}
                            </Progress>
                            :
                            <div>
                              <Button className='text-primary bg-white' color="light"
                                      onClick={toggleModalDocument}>Cancel</Button>
                              {
                                isUpdateDocument ?
                                  <Button color="primary" onClick={() => updateDocument()}>Update</Button>
                                  : <Button color="primary" onClick={() => createDocument()}>Create</Button>
                              }
                            </div>
                        }

                      </ModalFooter>
                    </Modal>

                    {/* End Modal Edit */}

                    <Row>
                      {
                        isLoading
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
                                                  <Button className='text-primary bg-white' color="light"
                                                          onClick={() => toggleModalDocument(row, false)}>Upload</Button>

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
                                                  onClick={() => updateModal(row.original)}
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
        <ModalHeader toggle={toggleModalDelete}>Confirm Delete Document </ModalHeader>
        {
          isLoading ? <Spinner>Deleting ...</Spinner>
            :
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
        }
      </Modal>
    </>
  )
}
export default ProfileDocuments