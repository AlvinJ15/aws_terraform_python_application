import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle, Accordion,
    TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, AccordionItem, AccordionBody, AccordionHeader
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
const ProfileChecks = () => {
    useEffect(() => {
        //getCkecks()
    }, [])
    /**LIST OF ProfileChecks */
    const [profileChecksList, setProfileChecksList] = useState([])
    const getCkecks = () => {
        /*FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/onboarding', "GET").then(response => {
            setProfileChecksList(response)
        })*/
    }
    return (
        <><BreadCrumbs />
            <Row>
                <div className='text-end mb-4'>
                    <Button onClick={() => alert("adding")}>Add new Check</Button>
                </div >
                <Col xs="12" md="12" lg="12">
                    <div>
                        <ComponentCard title="Checks" >

                            <ReactTable
                                data={profileChecksList}
                                columns={[
                                    {
                                        Header: 'Check',
                                        accessor: 'name',
                                        id: 'name',
                                    },
                                    {
                                        Header: 'Check',
                                        id: 'status',
                                        accessor: (d) => d.status,
                                    },
                                    {
                                        Header: 'Check',
                                        accessor: 'approval',
                                    },
                                    {
                                        Header: 'Actions',
                                        accessor: 'package_id',
                                        sorteable: false,
                                        Cell: row => (
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <Button color="primary" onClick={() => { }}>
                                                        Edit
                                                    </Button>
                                                </div>
                                                <div className='col-6'>
                                                    <Button color="danger" onClick={() => { }}>
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
                        </ComponentCard>
                    </div>
                </Col>
            </Row >
        </>
    )
}
export default ProfileChecks