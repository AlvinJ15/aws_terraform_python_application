import React, { useEffect, useState } from 'react';
import {Row, Col, Form, FormGroup, Label, Input, AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion, Card, CardHeader, Spinner } from 'reactstrap';

import ProfileOff from './ProfileOff';

import 'react-table-v6/react-table.css';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { CardBody } from 'reactstrap';
import DateFormat from '../../utilities/dateFormat';
import useUpdateFetch from '../../hooks/useUpdateFetch';


const initProfile = {
    profile: {
        address : '',
        city : '',
        country : '',
        date_of_birth : '',
        email : '',
        employee_id : '',
        first_name :  '',
        gender : '',
        grade : '',
        last_name : '',
        medical_category : '',
        profile_id : '',
        role : '',
        specialty : '',
        state : '',
        title :'',
        zip : '',
    }
}

const ProfileDetails = () => {

    const params = useParams()
    // GET Employee
    const {data, isLoading, refresh} = useFetch({endpoint :`${params.idOrganization}/employees/${params.idEmployee}`, initData: initProfile})
    
    // GET Roles
    const {data: roleList, isLoading: isLoadingRole} = useFetch({endpoint :`${params.idOrganization}/roles`, initData: []})
 
    // UPDATE

    const {data: profile, setData: setProfile, error, setError,handleInput ,isFetching: isFechingUpdate, update} = useUpdateFetch({endpoint :`${params.idOrganization}/employees/${params.idEmployee}`, initData: initProfile})

    const updateEmployee = () => {
        const updateData = {...profile}
        const role_id = profile.role_id
        updateData.date_of_birth = `${updateData.date_of_birth} 00:00:00`
        delete updateData.role_id
        update({profile: updateData, role_id: role_id})
    }


    useEffect(() => {    
        setProfile({...data.profile, role_id: data.role_id}) 
    },[data])

 
    /*accordtion*/
    return (
        <>
            {/* <BreadCrumbs /> */}
            <Card className='p-4'>
                <CardBody>
                    <h5>Customize the personal info below</h5>
                </CardBody>
                <hr></hr>
                <CardBody>
                    {
                        isLoading
                        ?   <Spinner>Is loading ...</Spinner>
                        :   <UncontrolledAccordion defaultOpen={['1','2']} stayOpen>
                                <AccordionItem>
                                    <AccordionHeader targetId="1">Personal Information</AccordionHeader>
                                    <AccordionBody className='bg-white' accordionId="1">
                                        <Form className='p-4'>
                                            <FormGroup>
                                                <Label>Gender</Label>
                                                <select className='form-control' name="gender" value={profile.gender} onChange={handleInput}>
                                                    <option value=''>Select a gender</option>
                                                    <option value='Male'>Male</option>
                                                    <option value='Fale'>Fale</option>
                                                    <option value='Other'>Other</option>
                                                </select>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Title</Label>
                                                <Input type="text" placeholder="Enter a title" name="title" value={profile.title} onChange={handleInput} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>First Name</Label>
                                                <Input type="text" placeholder="Enter first name" name="first_name" value={profile.first_name} onChange={handleInput} />
                ˙                                    </FormGroup>
                                            <FormGroup>
                                                <Label>Last name</Label>
                                                <Input type="text" placeholder="Enter last name" name="last_name" value={profile.last_name} onChange={handleInput} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Grade</Label>
                                                <Input type="text" placeholder="Enter grade" name="grade" value={profile.grade} onChange={handleInput} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Medical Category</Label>
                                                <Input type="text" placeholder="Enter medical category" name="medicalCategory" value={profile.medicalCategory} onChange={handleInput} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Speciality</Label>
                                                <Input type="text" placeholder="Enter specialty" name="specialty" value={profile.specialty} onChange={handleInput} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Date of Birth</Label>
                                                <Input type="date" placeholder="Enter specialty" name="date_of_birth" value={DateFormat(profile.date_of_birth)} onChange={handleInput} />
                                            </FormGroup>
                                            {
                                                !!isLoadingRole
                                                ? <p>Loading...</p>
                                                :   <FormGroup>
                                                        <Label>Personnel Type</Label>
                                                        <select className='form-select' name="role_id" value={profile.role_id} onChange={handleInput}>
                                                            {   !!roleList &&
                                                                roleList.map((item, index) => 
                                                                <option key={index} value={item.role_id}>{item.name}</option>)
                                                            }
            
                                                        </select>
                                                    </FormGroup>
                                            }
                                        </Form>
                                    </AccordionBody>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionHeader targetId="2">Contact Details</AccordionHeader>
                                    <AccordionBody className='bg-white' accordionId="2">
                                        <Form className='p-4'>
                                            <FormGroup>
                                                <Label>Email</Label>
                                                <Input type="email" placeholder="Enter a email" name="email" value={profile.email} onChange={handleInput} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Address</Label>
                                                <Input type="text" placeholder="Enter a address" name="address" value={profile.address} onChange={handleInput} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Country</Label>
                                                <Input type="text" placeholder="Enter a country" name="country" value={profile.country} onChange={handleInput} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>City</Label>
                                                <Input type="text" placeholder="Enter a city" name="country" value={profile.city} onChange={handleInput} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>State</Label>
                                                <Input type="text" placeholder="Enter a state" name="state" value={profile.state} onChange={handleInput} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Zip Code</Label>
                                                <Input type="text" placeholder="Enter a zip code" name="zip" value={profile.zip} onChange={handleInput} />
                                            </FormGroup>
                                        </Form>
                                    </AccordionBody>
                                </AccordionItem>
                            </UncontrolledAccordion>
                    }
                </CardBody>
                <CardHeader className='bg-white'>
                    <div className='text-end'>
                        <button className='btn btn-primary' onClick={() => updateEmployee()} disabled={isFechingUpdate}>{isFechingUpdate ? 'Saving' : 'Save'}</button>
                    </div>
                </CardHeader>
            </Card>            
        </>
    )
}
export default ProfileDetails