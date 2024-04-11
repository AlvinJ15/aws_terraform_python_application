import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, CardBody, CardGroup, Button, Progress, Form, FormGroup, Label, Input, Alert, CardTitle,
    TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody
} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import { FetchData } from '../../assets/js/funcionesGenerales'
import CrudQuestionnaire from './forms/crudQuestionnaire'
const Questionnaires = () => {
    /**Adding new Questionnaire */
    const [dataQuestionnaire, setDataQuestionnaire] = useState({
        id: '',
        name: '',
        description: '',
        questions: [],
    })

    const [openCrud, setOpenCrud] = useState(false)
    const toggleCrud = () => { setOpenCrud(!openCrud) }

    useEffect(() => {
        //getQuestionnaireList()
    }, [])
    const [modalQuestionnaire, setModalQuestionnaire] = useState(false);
    const toggleModalQuestionnaire = () => { setError(false); setModalQuestionnaire(!modalQuestionnaire) }
    const handleInput = (e) => {
        const { type, name, value, checked } = e.target
        console.log("name", name, "type", type, "value", value, "checked", checked)
        setDataQuestionnaire({ ...dataQuestionnaire, [name]: type == 'checkbox' ? checked : value })
    }
    const [error, setError] = useState({
        status: false,
        message: ''
    })
    const validateFieldsQuestionnaire = (action = "CREATE") => {
        if (dataQuestionnaire.packageName == "") {
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
    const mangeQuestionnaire = (action) => {
        if (validateFieldsQuestionnaire(action)) {
            alert("mandare a " + action)
            let endpoint = "'organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/save'"
            FetchData(endpoint, "GET", dataQuestionnaire).then(response => {
                console.log("ar", response)
                setQuestionnairesList(response)
            })
        }
    }
    /**end new Questionnaire */
    /**LIST OF Questionnaires */
    const [questionnairesList, setQuestionnairesList] = useState([])
    const getQuestionnaireList = () => {
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/questionnaires', "GET").then(response => {
            setQuestionnairesList(response)
        })
    }
    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="11">
                    <Card >
                        <Row>
                            <Col sm="12">
                                <div className="p-4">
                                    <Row>
                                        <Col md="12" xs="12" >
                                            <strong>Questionnaires</strong>
                                            <Button className='float-end mb-2' color="primary"
                                                onClick={toggleCrud}
                                            >{openCrud ? "Go back" : "Add Questionnaire"}</Button>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Row>

                                            {openCrud ?
                                                <CrudQuestionnaire role="CREATE" data={dataQuestionnaire} handle={handleInput} />
                                                :
                                                <ComponentCard title="List" >

                                                    <ReactTable
                                                        data={questionnairesList}
                                                        columns={[
                                                            {
                                                                Header: 'Name',
                                                                accessor: 'name',
                                                                id: 'id',
                                                            },
                                                            {
                                                                Header: 'Created',
                                                                id: 'created',
                                                                accessor: (d) => d.creation_date,
                                                            },
                                                            {
                                                                Header: 'Updated',
                                                                accessor: 'creation_date',
                                                            },
                                                            {
                                                                Header: 'Actions',
                                                                accessor: 'package_id',
                                                                sorteable: false,
                                                                Cell: row => (
                                                                    <div className='row'>
                                                                        <div className='col-6'>
                                                                            <Button color="primary" onClick={toggleModalQuestionnaire}>
                                                                                Edit
                                                                            </Button>
                                                                        </div>
                                                                        <div className='col-6'>
                                                                            <Button color="danger" onClick={toggleModalQuestionnaire}>
                                                                                Assign
                                                                            </Button>
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
                                                </ComponentCard>
                                            }
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {questionnairesList.length > 0 &&
                        <Row>

                        </Row>
                    }
                </Col>
            </Row>
        </>
    )
}
export default Questionnaires