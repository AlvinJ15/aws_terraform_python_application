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

const ProfileOnboarding = () => {
    useEffect(() => {
        getOnboarding()
    }, [])
    /**LIST OF ProfileOnboarding */
    const [profileOnboardingList, setProfileOnboardingList] = useState([])
    const getOnboarding = () => {
        organizationService.get('9cf728c0-288a-4d92-9524-04d58b2ab32d/onboarding')
        .then(response => {
            setProfileOnboardingList(response)
        })

    }
    return (
        <><BreadCrumbs />
            <div>
                <div className='text-end mb-4'>
                    <Button onClick={() => alert("assinging")}>Assing Onboarding</Button>
                </div>

                <div>
                    <div>
                        <ComponentCard title="Onboarding" >

                            <ReactTable
                                data={profileOnboardingList}
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
                                        Header: 'Completed',
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
                </div>
            </div >
        </>
    )
}
export default ProfileOnboarding