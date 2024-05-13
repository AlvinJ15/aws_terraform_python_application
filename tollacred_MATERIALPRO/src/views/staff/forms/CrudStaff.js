import React, {useEffect, useState} from 'react';
import {
    Progress, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
import Select from 'react-select'

const CrudStaff = ({facility, data, handle, lists, register, errors}) => {
    const [optionFacilities, setOptionFacilities] = useState([])

    const optionAdapter = () => {
        let options = []
        lists.map(item => {
            options.push({
                value: item.facility_id,
                label: item.name
            })
        })
        return options
    }

    const handleSelect = (e) => {
        console.log(' handle(e)', handle(e))
    }

    useEffect(() => {
        setOptionFacilities(optionAdapter())
    }, [])
    return (
        <>
            {facility == "EDIT" &&
                <FormGroup style={{display: "none"}}>
                    <Label>ID (Primary Key):</Label>
                    <Input type="text" value={data.id} placeholder="Enter a ID" onChange={handle} name="id"/>
                </FormGroup>
            }
            <FormGroup>
                <Label>First Name*</Label>
                <input
                    type="text"
                    {...register('first_name', {required: true})}
                    value={data.first_name} placeholder="Enter first Name" onChange={handle}
                    name="first_name"
                    className="form-control"
                />
                <span className="text-danger">{errors.first_name && 'First name is required.'}</span>
            </FormGroup>
            <FormGroup>
                <Label>Last Name</Label>
                <Input
                    type="text"
                    value={data.last_name} placeholder="Enter last name" onChange={handle} name="last_name"
                />
            </FormGroup>
            <FormGroup>
                <Label>Email</Label>
                <Input type="email" value={data.email} placeholder="Enter email" onChange={handle} name="email"/>
            </FormGroup>
            <FormGroup>
                <Label>Phone Number*</Label>
                <input
                    type="text" value={data.phone_number}
                    {...register('phone_number', { required: true, pattern:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/})}
                    placeholder="Enter Phone Number (###-###-####)" onChange={handle} name="phone_number"
                    className="form-control"
                />
                <span className="text-danger">{errors.phone_number && 'Phone number is required and format ###-###-####'}</span>
            </FormGroup>
            {<FormGroup>
                <Label> Facility</Label>
                <Select
                    closeMenuOnSelect={true}
                    options={optionFacilities}
                    value={facility.facility_id}
                    onChange={handleSelect}
                />
            </FormGroup>}

        </>
    )
}
export default CrudStaff