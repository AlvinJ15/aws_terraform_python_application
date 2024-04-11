import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, CardBody, CardSubtitle, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle,Spinner,
    Table, Offcanvas, OffcanvasHeader, OffcanvasBody, ButtonGroup, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Dropdown
} from 'reactstrap';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import { FetchData } from '../../assets/js/funcionesGenerales'
import CrudStaff from './forms/CrudStaff';
import Select from 'react-select'
import Loader from '../../layouts/loader/Loader';

const StaffList = ({ dataFetch = [] }) => {
    /**Adding new StaffList */
    const [dataStaff, setDataStaff] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        personnel_type: '',
    })
    const [roleList, setRoleList] = useState([])
    const getRoleList = () => {
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/roles', "GET").then(response => {
            setRoleList(response)
        })
    }


    useEffect(() => {
        getAdministratorList()
        getStaffList()
        getRoleList()
    }, [])
    const [modalStaffList, setModalStaffList] = useState(false);
    const toggleModalStaffList = () => { setError(false); setModalStaffList(!modalStaffList) }
    const handleInput = (e) => {
        const { type, name, value, checked } = e.target
        console.log("name", name, "type", type, "value", value, "checked", checked)
        setDataStaff({ ...dataStaff, [name]: type == 'checkbox' ? checked : value })
    }
    const [error, setError] = useState({
        status: false,
        message: ''
    })
    const validateFieldsStaffList = (action = "CREATE") => {
        if (dataStaff.packageName == "") {
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
    const mangeStaffList = (action) => {
        if (validateFieldsStaffList(action)) {
            alert("mandare a " + action)
            let endpoint = "'organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/save'"
            FetchData(endpoint, "GET", dataStaff).then(response => {
                setStaffList(response)
            })
        }
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
            FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/employees?page=1', "GET").then(response => {
                setStaffList(response)
                setSpinnerLoading(false)
            })
        } 
    }
    const [administrators, setAdministrator] = useState([])
    const getAdministratorList = () => {
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/administrators', "GET").then(response => {
            setAdministrator(response)
        })
    }
    const openOptionsMember = (role, data) => {
        console.log(role, data)
        switch (role) {
            case "edit":
                alert("editing")
                break;
            default:

        }
    }

    return (
        <div fallback={Loader}>
            <BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="12">
                    <Row>
                        <Col sm="12">
                            <div className="p-4">
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
                                                                <CrudStaff role="CREATE" data={dataStaff} handle={handleInput} lists={{ roleList: roleList }} />
                                                                <Row>
                                                                    <Col md="6" xs="12">
                                                                        <Button className='float-end mb-2' color="primary" onClick={() => { mangeStaffList("CREATE") }}
                                                                        >Save</Button>
                                                                    </Col>
                                                                    <Col md="6" xs="12">
                                                                        <Button className='float-end mb-2' color="primary" onClick={toggleModalStaffList}
                                                                        >Close</Button>
                                                                    </Col>
                                                                </Row>
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
                                                        loading={spinnerLoading}
                                                        data={staffList}
                                                        columns={[
                                                            {
                                                                id: 'profile',
                                                                Header: 'Staff Member',
                                                                //accessor: (d) => d.profile.first_name + " " + d.profile.last_name,
                                                                accessor: (d) => d.profile.first_name,
                                                            },
                                                            {
                                                                id: 'role',
                                                                Header: 'Role',
                                                                accessor: (d) => d.profile.role,
                                                            },
                                                            {
                                                                id: 'assigned',
                                                                Header: 'Assigned',
                                                                accessor: 'assigned',
                                                                Cell: row => (
                                                                    <div className='row'>
                                                                        <select value={row.assignee} className="form-select">
                                                                            {administrators.map((admin, index) => (
                                                                                <option key={index} value={admin.email}>{admin.first_name + " " + admin.last_name}</option>
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
                                                                id: "compilance_packages",
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
                                                                id: 'package_id',
                                                                Header: 'Actions',
                                                                sorteable: false,
                                                                accessor: (d) => d.profile,
                                                                Cell: row => (
                                                                    <div className='row'>
                                                                        <div className='col-12'>
                                                                            {
                                                                                <UncontrolledDropdown
                                                                            className="me-2"
                                                                            direction="end"
                                                                        >
                                                                            <DropdownToggle
                                                                                caret
                                                                                color="primary"
                                                                            >
                                                                                Dropdown
                                                                            </DropdownToggle>
                                                                            <DropdownMenu>
                                                                                <DropdownItem onClick={() => openEditMember(row.value)}>
                                                                                    Edit
                                                                                </DropdownItem>
                                                                                <DropdownItem>
                                                                                    Manage
                                                                                </DropdownItem>
                                                                                <DropdownItem />
                                                                                <DropdownItem>
                                                                                    Delete
                                                                                </DropdownItem>
                                                                            </DropdownMenu>
                                                                        </UncontrolledDropdown>

                                                                               /* <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="left">
                                                                                    <DropdownToggle caret>
                                                                                    Dropdown
                                                                                    </DropdownToggle>
                                                                                    <DropdownMenu>
                                                                                    <DropdownItem header>Header</DropdownItem>
                                                                                    <DropdownItem>Some Action</DropdownItem>
                                                                                    <DropdownItem disabled>Action (disabled)</DropdownItem>
                                                                                    <DropdownItem divider />
                                                                                    <DropdownItem>Foo Action</DropdownItem>
                                                                                    <DropdownItem>Bar Action</DropdownItem>
                                                                                    <DropdownItem>Quo Action</DropdownItem>
                                                                                    </DropdownMenu>
                                                                                </Dropdown>*/
                                                                            /*<select onChange={(e) => openOptionsMember(e.target.value, row.value)}>
                                                                                <option value="">   Options   </option>
                                                                                <option value="manage">   Manage    </option>
                                                                                <option value="edit">    Edit    </option>
                                                                                <option value="delete">    Delete      </option>
                                                                            </select>*/
                                                                            }
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
                                <div>
                                    <Row>


                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col >
            </Row >
        </div>
    )
}
export default StaffList