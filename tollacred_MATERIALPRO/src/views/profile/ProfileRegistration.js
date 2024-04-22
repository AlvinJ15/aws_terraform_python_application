import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle,
    TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
const ProfileRegistration = () => {
    useEffect(() => {
        //getProfileDocumentList()
    }, [])
    /**LIST OF ProfileOrganizationDocuments */
    const [profileorganizationdocumentsList, setProfileOrganizationDocumentsList] = useState([])
    const getProfileDocumentList = () => {
        /*FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/compliancePackages', "GET").then(response => {
            setProfileOrganizationDocumentsList(response)
        })*/
    }
    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="11">
                    <h2>Use the menu to navigate</h2>
                </Col>
            </Row>
        </>
    )
}
export default ProfileRegistration