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
import organizationService from '../organization/services/organization.service';
const ProfileQuestionnaires = () => {
    /**LIST OF ProfileQuestionnaires */
    const [profileQuestionnairesList, setProfileQuestionnairesList] = useState([])
    
    const getQuestionnaires = () => {
        organizationService.get('9cf728c0-288a-4d92-9524-04d58b2ab32d/questionnaires').then(response => {
            setProfileQuestionnairesList(response) 
        })
    }
    
    useEffect(() => {
        getQuestionnaires()
    }, [])

    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="12">
                    <Row>
                        <ComponentCard title="Questionnaires" >

                            <ReactTable
                                data={profileQuestionnairesList}
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
                                        Header: 'Recieved',
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
                    </Row>
                </Col>
            </Row>
        </>
    )
}
export default ProfileQuestionnaires