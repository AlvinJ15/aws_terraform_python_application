import React, { useEffect, useState } from 'react';
import {FormGroup, Label, Input} from 'reactstrap';
import Select from 'react-select';
import ComponentCard from '../../../components/ComponentCard';

import '../../tables/ReactBootstrapTable.scss';
import '../../form-pickers/tagselect.scss';


const CrudDocument = ({ facility, data, handle, lists }) => {
    const [optionFacilities, setOptionFacilities] = useState([])

    const optionFacilityAdapter = () => {
        let options = []
        lists.facilityList.map(facilityOption => {
            options.push({ 
                value: facilityOption.facility_id, 
                label: facilityOption.name,
            })
        })
        return options
    }

    const handleSelect = (e) => {
        handle({nameSelect : 'facilities', value : e})
    }

    useEffect(() => {
        setOptionFacilities(optionFacilityAdapter)
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
                optionFacilities.length > 0 ?
                    <ComponentCard title="Facilities Types">

                        <Select
                            closeMenuOnSelect={false}
                            options={optionFacilities}
                            value={data.facilities}
                            onChange={handleSelect}
                            isMulti
                        />
                    </ComponentCard>
                    : "No Facilities Found!"
            }
        </>
    )
}
export default React.memo(CrudDocument)