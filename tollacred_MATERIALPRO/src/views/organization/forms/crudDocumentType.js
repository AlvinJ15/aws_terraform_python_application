import React, { useState } from 'react';
import {
    Progress, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
const CrudDocumentType = ({ role, data, handle }) => {
    return (
        <>
            {role == "EDIT" &&
                <FormGroup >
                    <Label>ID (Primary Key):</Label>
                    <Input type="text" value={data.id} placeholder="Enter a ID" onChange={handle} name="id" />
                </FormGroup >
            }
            {role != "CREATE" &&
                <FormGroup >
                    <Label>Organization ID:</Label>
                    <Input type="text" value={data.organizationId} placeholder="Enter a document Name" onChange={handle} name="organizationId" />
                </FormGroup >
            }
            <FormGroup>
                <Label>Document Name*</Label>
                <Input type="text" value={data.name} placeholder="Enter a document Name" onChange={handle} name="name" />
            </FormGroup>
            {role == "CREATE" &&
                <FormGroup>
                    <Label>Document Description</Label>
                    <Input type="text" value={data.description} placeholder="Enter document description" onChange={handle} name="description" />
                </FormGroup>
            }
            <FormGroup>
                <Label>Category</Label>
                <FormGroup check>
                    <Input type="radio" checked={data.category == "Personal"} value="Personal" name="category" onChange={handle} />
                    {' '}
                    <Label check>
                        Personal
                    </Label>
                </FormGroup>

                <FormGroup check>
                    <Input type="radio" checked={data.category == "Certificate"} value="Certificate" name="category" onChange={handle} />
                    {' '}
                    <Label check>
                        Certificate
                    </Label>
                </FormGroup>
                {role != "DELETE" &&
                    <FormGroup>
                        <Label>Expiration (in months):</Label>
                        <Input type="Number" value={data.expiration} placeholder="" name="expiration" onChange={handle} />
                    </FormGroup>
                }
            </FormGroup>
        </>
    )
}
export default CrudDocumentType