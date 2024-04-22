import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, CardBody, CardSubtitle, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle, Spinner,
    Table, Offcanvas, OffcanvasHeader, OffcanvasBody, ButtonGroup, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';

import CrudStaff from './forms/CrudStaff';
// import Select from 'react-select'
import Loader from '../../layouts/loader/Loader';
import organizationService from '../organization/services/organization.service';

import 'react-table-v6/react-table.css';
import { useNavigate, useParams } from 'react-router-dom';
import useActionStaff from './hooks/useActionStaff';

const StaffList = ({ dataFetch = [] }) => {

    const params = useParams()
    const navigate = useNavigate()

    const [administrators, setAdministrator] = useState([])

    /**Adding new StaffList */
    const { dataStaff,
        roleList,
        getRoleList,
        isLoading,
        setIsLoading,
        toggleModalStaffList,
        modalStaffList,
        handleInput,
        error,
        mangeStaffCreate } = useActionStaff(params.idOrganization)
    const saveEmployee = () => {
        mangeStaffCreate("CREATE").then(response => {
            //console.log("cargarrr", response)
            getStaffList()
        })
    }
    /**end new StaffList */
    /**LIST OF StaffList */
    const [spinnerLoading, setSpinnerLoading] = useState(false)
    const [staffList, setStaffList] = useState([])

    const getStaffList = () => {
        if (typeof dataFetch.type !== "undefined") {
            setStaffList(dataFetch.body)
        } else {
            setSpinnerLoading(true)

            organizationService.get(`${params.idOrganization}/employees?page=1`)
                .then(response => {
                    setStaffList(response)
                    setSpinnerLoading(false)
                })
        }
    }

    const getAdministratorList = () => {
        organizationService.get(`${params.idOrganization}/administrators`)
            .then(response => setAdministrator(response))
    }

    const deleteStaff = (idStaff) => {
        params.idEmployee = idStaff
        setIsLoading(true)
        organizationService.delete(`${params.idOrganization}/employees/${idStaff}`)
            .then(response => {
                //console.log('delete --->', response)
                setIsLoading(false)
                getStaffList()
            })
    }

    const navigateProfile = (idStaff) => {
        params.idEmployee = idStaff
        navigate(`/organization/${params.idOrganization}/employee/${idStaff}/compliancePackages`)
    }

    useEffect(() => {
        getAdministratorList()
        getStaffList()
        getRoleList()
    }, [])
    const defaultFilterMethod = (filter, row, column) => {
        //console.log("filtering", filter)
        const id = filter.pivotId || filter.id
        return row[id] !== undefined ? String(row[id]).toLowerCase().startsWith(filter.value.toString().toLowerCase()) : true
    }
    const [changingAssigned, setIsChangingId] = useState(false)
    const handleAdministrador = (e, row) => {
        setIsChangingId(true)
        //console.log(e.target.value, row.original.employee_id)
        //return
        organizationService.update(`${params.idOrganization}/employees/${row.original.employee_id}`, { assignee_id: e.target.value })
            .then(response => {
                //getAdministratorList()
                setIsChangingId(false)
                e.target.value = e.target.value
            })
    }
    const [modalEdit, setModalEdit] = useState(false)
    const toggleModalEdit = () => { setModalEdit(!modalEdit) }
    const [dataUpdate, setDataUpdate] = useState({
        compliance_packages_names: '',
        compliance_tags: '',
        notes: ''
    })
    const handleUpdate = (e) => {
        setDataUpdate({
            ...dataUpdate,
            [e.target.name]: e.target.value
        })
    }
    const openEditMember = (row) => {
        //console.log("editare lo sgte xd!", row)
        setDataUpdate({
            id_employee: row.employee_id,
            compliance_packages_names: row.compliance_packages_names.join(","),
            compliance_tags: row.compliance_tags,
            notes: row.notes
        })
        toggleModalEdit()
    }
    const updateEmployee = () => {
        setIsLoading(true)
        let dataSend = {
            //compliance_packages_names: dataUpdate.compliance_packages_names.split(", "),
            compliance_tags: dataUpdate.compliance_tags,
            notes: dataUpdate.notes,
            status: dataUpdate.compliance_packages_names
        }
        organizationService.update(`${params.idOrganization}/employees/${dataUpdate.id_employee}`, dataSend)
            .then(response => {
                getStaffList()
                toggleModalEdit()
            }).finally(() => setIsLoading(false))

    }
    return (
        <div fallback={Loader}>
            <BreadCrumbs name='Staff' />
            <Row>
                <Col xs="12" md="12" lg="12">
                    <Row>
                        <Col sm="12">
                            <div className="py-4">
                                <Row>
                                    <Col md="12" xs="12" >
                                        <Card>
                                            <CardTitle tag="h4" className="border-bottom px-4 py-3 mb-0">
                                                <Row>
                                                    <Col md="8" xs="8">
                                                        <strong>Staff Members</strong>
                                                    </Col>
                                                    <Col md="4" xs="4">
                                                        <Button className='float-end mb-2' color="primary" onClick={toggleModalStaffList}
                                                        >Add Staff Member</Button>
                                                        <Offcanvas direction="end" toggle={toggleModalStaffList} isOpen={modalStaffList} style={{ width: "48%" }} >
                                                            <OffcanvasHeader toggle={toggleModalStaffList}>
                                                                Add New Staff Member
                                                            </OffcanvasHeader>
                                                            <OffcanvasBody>
                                                                <strong>
                                                                    Please fill all fields
                                                                </strong>
                                                                <CrudStaff role="CREATE" data={dataStaff} handle={handleInput} lists={roleList} />
                                                                <div className='d-flex justify-content-end gap-2'>
                                                                    <div>
                                                                        <Button className='' color="primary" onClick={saveEmployee} disabled={isLoading}
                                                                        >{isLoading ? "Saving" : "Save"}</Button>
                                                                    </div>
                                                                    <div>
                                                                        <Button className='' color="dark" onClick={toggleModalStaffList} disabled={isLoading}
                                                                        >Close</Button>
                                                                    </div>
                                                                </div>
                                                            </OffcanvasBody>
                                                        </Offcanvas>
                                                    </Col>
                                                </Row>
                                            </CardTitle>
                                            <CardBody className="p-4">
                                                {spinnerLoading ?
                                                    <Spinner color="primary">
                                                        Loading...
                                                    </Spinner>
                                                    :
                                                    <ReactTable
                                                        filterable={true}
                                                        defaultFilterMethod={defaultFilterMethod}
                                                        loading={spinnerLoading}
                                                        data={staffList}
                                                        columns={[
                                                            {
                                                                id: 'profile',
                                                                Header: 'Staff Member',
                                                                accessor: (d) => d.profile.first_name + " " + d.profile.last_name,
                                                                //accessor: (d) => d.profile.first_name,
                                                            },
                                                            {
                                                                id: 'role',
                                                                Header: 'Role',
                                                                accessor: (d) => d.profile.role,
                                                            },
                                                            {
                                                                id: 'assignee_id',
                                                                Header: 'Assigned',
                                                                accessor: 'assignee_id',
                                                                Cell: row => (
                                                                    <div className='row'>
                                                                        <select defaultValue={row.value} className="form-select" onChange={(e) => handleAdministrador(e, row)} disabled={changingAssigned} >
                                                                            {administrators.map((admin, index) => (
                                                                                <option key={index} value={admin.admin_id}>{admin.first_name + " " + admin.last_name}</option>
                                                                            ))}
                                                                        </select>
                                                                        {/* <Select
                                                                getOptionLabel={op => op.first_name + " " + op.last_name} getOptionValue={op => op.email}
                                                                closeMenuOnSelect={true}
                                                                options={administrators}
                                                                value={administrators.filter(function (option) {
                                                                    return option.email === row.assignee;
                                                                })}
                                                                //defaultValue={row.assignee}
                                                                //styles={colourStyles}
                                                            /> */}
                                                                    </div>
                                                                )
                                                            },
                                                            {
                                                                id: "compliance_packages",
                                                                Header: 'Compliance Packages',
                                                                accessor: 'compliance_packages_names',
                                                                Cell: row => (
                                                                    <div className='row'>
                                                                        {row.value?.join(",")}
                                                                    </div>
                                                                )
                                                            },
                                                            {
                                                                id: 'speciality',
                                                                Header: 'Specialty',
                                                                accessor: (d) => d.profile.speciality,
                                                            },
                                                            {
                                                                Header: 'Compliance',
                                                                accessor: 'status',
                                                            },
                                                            {
                                                                Header: 'Compliance Tags',
                                                                accessor: 'compliance_tags',
                                                            },
                                                            {
                                                                id: "signed_off",
                                                                Header: 'Signed Off',
                                                                accessor: () => "-"
                                                            },
                                                            {
                                                                Header: 'Notes',
                                                                accessor: 'notes',
                                                            },
                                                            {
                                                                id: 'employee_id',
                                                                Header: 'Actions',
                                                                sorteable: false,
                                                                accessor: 'employee_id',
                                                                Cell: employee_id => (
                                                                    <div className=''>
                                                                        <div className=''>
                                                                            <UncontrolledDropdown
                                                                                className="me-4"
                                                                                direction="down"
                                                                                style={{ position: 'inherit' }}
                                                                            >
                                                                                <DropdownToggle
                                                                                    caret
                                                                                    color="primary"
                                                                                >
                                                                                    Dropdown
                                                                                </DropdownToggle>
                                                                                <DropdownMenu>
                                                                                    <DropdownItem disabled={isLoading}
                                                                                        onClick={() => openEditMember(employee_id.original)}
                                                                                    >
                                                                                        Edit
                                                                                    </DropdownItem>
                                                                                    <DropdownItem disabled={isLoading} onClick={() => navigateProfile(employee_id.value)}>
                                                                                        Manage
                                                                                    </DropdownItem>
                                                                                    <DropdownItem onClick={() => deleteStaff(employee_id.value)} disabled={isLoading}>
                                                                                        Delete
                                                                                    </DropdownItem>
                                                                                </DropdownMenu>
                                                                            </UncontrolledDropdown>

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
                                                }
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Col >
            </Row >
            {/*to edit a member*/}
            <Offcanvas direction="end" toggle={toggleModalEdit} isOpen={modalEdit} style={{ width: "48%" }} >
                <OffcanvasHeader toggle={toggleModalEdit}>
                    Edit Compliance member
                </OffcanvasHeader>
                <OffcanvasBody>
                    <strong>
                    </strong>
                    <hr />
                    <FormGroup>
                        <Label>Compliance</Label>
                        <Input type="textarea" value={dataUpdate.compliance_packages_names} onChange={handleUpdate} name="compliance_packages_names" />
                    </FormGroup>
                    <FormGroup>
                        <Label>Compliance Tags</Label>
                        <Input type="textarea" value={dataUpdate.compliance_tags} onChange={handleUpdate} name="compliance_tags" />
                    </FormGroup>
                    <FormGroup>
                        <Label>Notes</Label>
                        <Input type="textarea" value={dataUpdate.notes} onChange={handleUpdate} name="notes" />
                    </FormGroup>
                    <div className='d-flex justify-content-end gap-2'>
                        <div>
                            <Button className='' color="primary" onClick={updateEmployee} disabled={isLoading}
                            >{isLoading ? "Updating" : "Update"}</Button>
                        </div>
                        <div>
                            <Button className='' color="dark" onClick={toggleModalEdit} disabled={isLoading}
                            >Close</Button>
                        </div>
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </div>
    )
}
export default StaffList
