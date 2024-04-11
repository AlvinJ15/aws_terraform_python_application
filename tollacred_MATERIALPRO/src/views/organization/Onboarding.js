import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, CardBody, CardSubtitle, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle,
    TabContent, TabPane, Nav, NavItem, NavLink, Table
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import { FetchData } from '../../assets/js/funcionesGenerales'
//import CrudOnboarding from './forms/crudOnboarding'
const Onboarding = () => {
    /**Adding new Onboarding */
    const [dataOnboarding, setDataOnboarding] = useState({
        id: '',
        name: '',
        description: '',
        questions: [],
    })

    const [openCrud, setOpenCrud] = useState(false)
    const toggleCrud = () => { setOpenCrud(!openCrud) }

    useEffect(() => {
        getOnboardingList()
    }, [])
    const [modalOnboarding, setModalOnboarding] = useState(false);
    const toggleModalOnboarding = () => { setError(false); setModalOnboarding(!modalOnboarding) }
    const handleInput = (e) => {
        const { type, name, value, checked } = e.target
        console.log("name", name, "type", type, "value", value, "checked", checked)
        setDataOnboarding({ ...dataOnboarding, [name]: type == 'checkbox' ? checked : value })
    }
    const [error, setError] = useState({
        status: false,
        message: ''
    })
    const validateFieldsOnboarding = (action = "CREATE") => {
        if (dataOnboarding.packageName == "") {
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
    const mangeOnboarding = (action) => {
        if (validateFieldsOnboarding(action)) {
            alert("mandare a " + action)
            let endpoint = "'organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/save'"
            FetchData(endpoint, "GET", dataOnboarding).then(response => {
                setOnboardingList(response)
            })
        }
    }
    /**end new Onboarding */
    /**LIST OF Onboarding */
    const [onboardingList, setOnboardingList] = useState([])
    const getOnboardingList = () => {
        /*FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/onboarding', "GET").then(response => {
            setOnboardingList(response)
        })*/
        //just an example
        let example = [{
            number: 1,
            title: 'Welcome tu Pulse'
        }, {
            number: 2,
            title: 'LA Country Registrion'
        }, {
            number: 3,
            title: 'About you!'
        }, {
            number: 4,
            title: 'Referencia Check!'
        },]
        setOnboardingList(example)
    }
    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="11">
                    <Row>
                        <Col sm="12">
                            <div className="p-4">
                                <Row>
                                    <Col md="6" xs="12" >
                                        <Card style={{}}>
                                            <CardTitle className='mx-3 mt-3'>
                                                <b><h4>Pulse</h4></b>
                                            </CardTitle>
                                            <CardBody>
                                                <CardSubtitle className="mb-2 text-muted" tag="h6">
                                                    Overview of the projects
                                                </CardSubtitle>

                                                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                                                    <thead>
                                                        <tr>
                                                            <th>Number</th>
                                                            <th>Title</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {onboardingList.map((tdata) => (
                                                            <tr key={tdata.name} className="border-top">
                                                                <td>
                                                                    <div className="d-flex align-items-center p-2">
                                                                        {/* <img
                                                                            src={tdata.avatar}
                                                                            className="rounded-circle"
                                                                            alt="avatar"
                                                                            width="45"
                                                                            height="45"
                                                                        /> */}
                                                                        <div className="ms-3">
                                                                            {/* <h6 className="mb-0">{tdata.name}</h6> */}
                                                                            <span className="text-muted">{tdata.number}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>{tdata.title}</td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col md="6" xs="12" >
                                        <Row>
                                            <Col md="12" xs="12" >
                                                <Card style={{}}>
                                                    <CardTitle className='mx-3 mt-3'>
                                                        <b><h4>OnBoarding Settings</h4></b>
                                                    </CardTitle>
                                                    <CardBody>
                                                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                                                            Overview of the projects
                                                        </CardSubtitle>

                                                        In strict mode,lorem ipsum
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col md="12" xs="12" >
                                                <Card style={{}}>
                                                    <CardTitle className='mx-3 mt-3'>
                                                        <b><h4>Build your onboard</h4></b>
                                                    </CardTitle>
                                                    <CardBody>
                                                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                                                            Overview of the projects
                                                        </CardSubtitle>

                                                        Contact Customer success team
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div>
                                    <Row>


                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {onboardingList.length > 0 &&
                        <Row>

                        </Row>
                    }
                </Col >
            </Row >
        </>
    )
}
export default Onboarding