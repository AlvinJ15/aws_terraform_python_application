import React, { useEffect, useState } from 'react';
import {
    Progress, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
import Select from 'react-select'
const CrudStaff = ({ role, data, handle, lists }) => {
    const [optionRoles, setOptionRoles] = useState([])

    //console.log('list: ', lists)

    const optionAdapter = () => {
        let options = []
        lists.map(item => {
            options.push({
                value: item.role_id,
                label: item.name
            })
        })
        return options
    }

    const handleSelect = (e) => {
        console.log(' handle(e)', handle(e))
    }

    useEffect(() => {
        setOptionRoles(optionAdapter())
    }, [])
    return (
        <>
            {role == "EDIT" &&
                <FormGroup style={{ display: "none" }}>
                    <Label>ID (Primary Key):</Label>
                    <Input type="text" value={data.id} placeholder="Enter a ID" onChange={handle} name="id" />
                </FormGroup >
            }
            <FormGroup>
                <Label>First Name*</Label>
                <Input type="text" value={data.first_name} placeholder="Enter first Name" required onChange={handle} name="first_name" />
            </FormGroup>
            <FormGroup>
                <Label>Last Name</Label>
                <Input type="text" value={data.last_name} placeholder="Enter last name" onChange={handle} name="last_name" />
            </FormGroup>
            <FormGroup>
                <Label>Email</Label>
                <Input type="email" value={data.email} placeholder="Enter email" onChange={handle} name="email" />
            </FormGroup>
            {/* <FormGroup>
                <Label> Personnel Type</Label>
                <Select
                    closeMenuOnSelect={false}
                    options={optionRoles}
                    value={data.role_id}
                    onChange={handleSelect}
                />
            </FormGroup> */}


        </>
    )
}
export default CrudStaff