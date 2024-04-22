import React, { useEffect, useState } from 'react';
import {
    Progress, Card, CardBody, CardTitle, CardText, Form, FormGroup, Label, Input, Alert, Button, Row, Col,
} from 'reactstrap';
import '../../tables/ReactBootstrapTable.scss';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ComponentCard from '../../../components/ComponentCard';
const CrudQuestionnaire = ({ role, data, handle }) => {
    const [documentTypeList, setDocumentTypeList] = useState([])
    const [roleList, setRoleList] = useState([])
    useEffect(() => {

    }, [])
    const addNewQuestion = () => {
        let temp = [...data.questions]
        temp.push({
            question: '',
            isMandatory: false,
            answer: ''
        })
        //calling the handle method
        handle({ target: { name: "questions", value: temp } })
    }
    const deleteQuestion = (index) => {
        let temp = [...data.questions]
        temp.splice(index, 1)
        //calling the handle method
        handle({ target: { name: "questions", value: temp } })
    }
    return (
        <>
            {/* {JSON.stringify(lists.roleList)} */}
            <FormGroup>
                <Label>Questionnaire Name*</Label>
                <Input type="text" value={data.name} placeholder="Enter a questionnaire Name" onChange={handle} name="name" />
            </FormGroup>
            <FormGroup>
                <Label>Questionnaire Description*</Label>
                <Input type="text" value={data.description} placeholder="Enter a questionnaire Description" onChange={handle} name="description" />
            </FormGroup>
            {data.questions.map((item, index) => (
                <Card style={{ backgroundColor: "#f6f4f4" }}>
                    <CardTitle>
                        Question {index + 1}
                    </CardTitle>
                    <CardBody>
                        <Row>
                            <Col md={10} sm={7}>
                                <FormGroup key={index}>
                                    {/* <Label>Question {index + 1}</Label> */}
                                    <Input type="textarea" value={item.answer} placeholder="Enter the question " onChange={handle} name="answer" />
                                </FormGroup>
                            </Col>
                            <Col md={2} sm={5}>
                                <FormGroup key={index}>
                                    <Label>Is Mandatory</Label>
                                    <Input type="checkbox" checked={data.isMandatory} value="Certificate" name="isMandatory" onChange={handle} />
                                </FormGroup>
                            </Col>

                        </Row>
                        <FormGroup key={index}>
                            <Label>answer {index + 1}</Label>
                            <Input type="text" value={item.answer} placeholder="Enter a answer " onChange={handle} name="answer" />
                        </FormGroup>
                    </CardBody>
                </Card>
            ))}

            <br />
            <Button className='float-end mb-2' color="primary" onClick={addNewQuestion}
            >Add New Question</Button>

        </>
    )
}
export default React.memo(CrudQuestionnaire)