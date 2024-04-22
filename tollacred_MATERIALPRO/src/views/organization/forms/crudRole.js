import React, { useState } from 'react';
import {
    Progress, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
const CrudRole = ({ role, data, handle }) => {
    //console.log("en mi tol", role)
    return (
        <>
            {role == "EDIT" &&
                <FormGroup style={{ display: "none" }}>
                    <Label>ID (Primary Key):</Label>
                    <Input type="text" value={data.id} placeholder="Enter a ID" onChange={handle} name="id" />
                </FormGroup >
            }
            <FormGroup>
                <Label>Name*</Label>
                <Input type="text" value={data.name} placeholder="Enter a Name" onChange={handle} name="name" />
            </FormGroup>

            <FormGroup>
                <Label>Description</Label>
                <Input type="text" value={data.description} placeholder="Enter description" onChange={handle} name="description" />
            </FormGroup>

            <FormGroup>
                <Label>Category</Label>
                <FormGroup check>
                    <Input type="radio" checked={data.type == "Clinical"} value="Clinical" name="type" onChange={handle} />
                    {' '}
                    <Label check>
                        Clinical
                    </Label>
                </FormGroup>

                <FormGroup check>
                    <Input type="radio" checked={data.type == "Non-Clinical"} value="Non-Clinical" name="type" onChange={handle} />
                    {' '}
                    <Label check>
                        Non Clinical
                    </Label>
                </FormGroup>
            </FormGroup>
        </>
    )
}
export default CrudRole