import React, { useState } from 'react';
import {Row, Col, Card, Button, Spinner,} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import ComponentCard from '../../components/ComponentCard';
import CrudQuestionnaire from './forms/crudQuestionnaire'
import useFetch from '../../hooks/useFetch';
import useCreateFetch from '../../hooks/useCreateFetch';
import { useParams } from 'react-router-dom';
const Questionnaires = () => {

    const params = useParams()

    const toggleCrud = () => { setOpenCrud(!openCrud) }
    const [modalQuestionnaire, setModalQuestionnaire] = useState(false);
    const [openCrud, setOpenCrud] = useState(false)

    const toggleModalQuestionnaire = () => { 
        setError(false)
        setModalQuestionnaire(!modalQuestionnaire) 
    }

    /**CREATE Questionnarie */
    const { data: dataQuestionnaire, handleInput, error, setError,isFetching} = useCreateFetch({endpoint: `${params.idOrganization}/questionnaires`})

    /**LIST OF Questionnaires */
    const {data: questionnairesList, isLoading, reset} = useFetch({endpoint: `${params.idOrganization}/questionnaires`})

    return (
        <><BreadCrumbs />
            <Row>
                <Col xs="12" md="12" lg="12">
                    <Card >
                        <Row>
                            <Col sm="12">
                                <div className="p-4">
                                    <Row>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <h5>Questionnaires</h5>
                                            <Button className='float-end mb-2' color="primary"
                                                onClick={toggleCrud}
                                            >{openCrud ? "Go back" : "Add Questionnaire"}</Button>
                                        </div>
                                    </Row>
                                    <div>
                                        <Row>

                                            {openCrud ?
                                                <CrudQuestionnaire facility="CREATE" data={dataQuestionnaire} handle={handleInput} />
                                                :
                                                <ComponentCard title="List" >
                                                    {
                                                        isFetching 
                                                        ? <Spinner className='mx-auto'>Loading...</Spinner>
                                                        :
                                                    
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
                                                                    <div className='d-flex gap-3 justify-content-center'>
                                                                        <div className=''>
                                                                            <Button color="primary" onClick={toggleModalQuestionnaire}>
                                                                                Edit
                                                                            </Button>
                                                                        </div>
                                                                        <div className=''>
                                                                            <Button outline color="danger" onClick={toggleModalQuestionnaire}>
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
                                                    }
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
        </>
    )
}
export default Questionnaires