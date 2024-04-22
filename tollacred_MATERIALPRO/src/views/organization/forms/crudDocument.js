import React, { useEffect, useState } from 'react';
import {FormGroup, Label, Input} from 'reactstrap';
import Select from 'react-select';
import ComponentCard from '../../../components/ComponentCard';

import '../../tables/ReactBootstrapTable.scss';
import '../../form-pickers/tagselect.scss';


const CrudDocument = ({ role, data, handle, lists }) => {
    const [optionRoles, setOptionRoles] = useState([])

    const optionRoleAdapter = () => {
        let options = []
        lists.roleList.map(roleOption => {
            options.push({ 
                value: roleOption.role_id, 
                label: roleOption.name,
            })
        })
        return options
    }

    const handleSelect = (e) => {
        handle({nameSelect : 'roles', value : e})
    }

    useEffect(() => {
        setOptionRoles(optionRoleAdapter)
    }, [])

    return (
        <>
            <FormGroup>
                <Label>Title*</Label>
                <Input type="text" value={data.title} placeholder="Enter a package Name" onChange={handle} name="title" />
            </FormGroup>
            <FormGroup>
                <Label>Description</Label>
                <Input type="text" value={data.description} placeholder="Enter a package Name" onChange={handle} name="description" />
            </FormGroup>
            <FormGroup>
                <FormGroup>
                    <Label>Purpose</Label>
                    <FormGroup check>
                        <Input type="radio" id='signarute' checked={data.purpose == "signaturerequired"} value="signaturerequired" name="purpose" onChange={handle} />
                        {' '}
                        <Label check htmlFor='signarute'>
                            Signature Required
                        </Label>
                    </FormGroup>

                    <FormGroup check>
                        <Input type="radio" id='download' checked={data.purpose == "downloadonly"} value="downloadonly" name="purpose" onChange={handle} />
                        {' '}
                        <Label check htmlFor='download'>
                            Downloadonly Only
                        </Label>
                    </FormGroup>
                </FormGroup>
            </FormGroup>

            {
                optionRoles.length > 0 ?
                    <ComponentCard title="Roles Types">

                        <Select
                            closeMenuOnSelect={false}
                            options={optionRoles}
                            value={data.roles}
                            onChange={handleSelect}
                            isMulti
                        />
                    </ComponentCard>
                    : "No Roles Found!"
            }
        </>
    )
}
export default React.memo(CrudDocument)