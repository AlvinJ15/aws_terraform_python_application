import React, { useEffect, useState } from 'react';
import {
    Progress, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
import Select from 'react-select'
const CrudStaff = ({ role, data, handle, lists }) => {

    const [roleList, setRoleList] = useState([])
    useEffect(() => {
        setRoleList(lists.roleList)
    }, [])
    return (
        <>
            {role == "EDIT" &&
                <FormGroup >
                    <Label>ID (Primary Key):</Label>
                    <Input type="text" value={data.id} placeholder="Enter a ID" onChange={handle} name="id" />
                </FormGroup >
            }
            <FormGroup>
                <Label>First Name*</Label>
                <Input type="text" value={data.first_name} placeholder="Enter first Name" onChange={handle} name="first_name" />
            </FormGroup>
            <FormGroup>
                <Label>Last Name</Label>
                <Input type="text" value={data.last_name} placeholder="Enter last name" onChange={handle} name="last_name" />
            </FormGroup>
            <FormGroup>
                <Label>Email</Label>
                <Input type="email" value={data.email} placeholder="Enter email" onChange={handle} name="email" />
            </FormGroup>
            <FormGroup>
                <Label> Personnel Type</Label>
                <Select
                    onChange={(e) => {
                        let ev = {}
                        ev.target = {}
                        ev.target.type = "text"
                        ev.target.name = "personnel_type";
                        ev.target.value = e.role_id;
                        handle(ev)
                    }}
                    getOptionLabel={op => op.name} getOptionValue={op => op.role_id}
                    closeMenuOnSelect={true}
                    options={roleList}
                    value={roleList.filter(function (option) {
                        return option.role_id === data.personnel_type;
                    })}
                />
            </FormGroup>


        </>
    )
}
export default CrudStaff