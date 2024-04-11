import React, { useEffect, useState } from 'react';
import {
    Progress, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
import '../../tables/ReactBootstrapTable.scss';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ComponentCard from '../../../components/ComponentCard';
import { FetchData } from '../../../assets/js/funcionesGenerales';
import Select, { components } from 'react-select';
import '../../form-pickers/tagselect.scss';
const CrudDocument = ({ role, data, handle, lists }) => {
    const [roleList, setRoleList] = useState([])
    useEffect(() => {
        setRoleList(lists.roleList)
    }, [])

    /***select roles*/
    const CustomClearText = () => 'clear all';
    const ClearIndicator = (props) => {
        const {
            // eslint-disable-next-line react/prop-types
            children = <CustomClearText />,
            // eslint-disable-next-line react/prop-types
            getStyles,
            // eslint-disable-next-line react/prop-types
            innerProps: { ref, ...restInnerProps },
        } = props;
        return (
            <div {...restInnerProps} ref={ref} style={getStyles('clearIndicator', props)}>
                <div style={{ padding: '0px 5px' }}>{children}</div>
            </div>
        );
    };

    const ClearIndicatorStyles = (base, state) => ({
        ...base,
        cursor: 'pointer',
        color: state.isFocused ? 'blue' : 'black',
    });
    const colourOptions = [
        { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
        { value: 'blue', label: 'Blue', color: '#0052CC', disabled: true },
        { value: 'purple', label: 'Purple', color: '#5243AA' },
        { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
        { value: 'orange', label: 'Orange', color: '#FF8B00' },
        { value: 'yellow', label: 'Yellow', color: '#FFC400' },
        { value: 'green', label: 'Green', color: '#36B37E' },
        { value: 'forest', label: 'Forest', color: '#00875A' },
        { value: 'slate', label: 'Slate', color: '#253858' },
        { value: 'silver', label: 'Silver', color: '#666666' },
    ];
    /*end select roles*/

    return (
        <>
            {/* {JSON.stringify(lists.roleList)} */}
            <FormGroup>
                <Label>Title*</Label>
                <Input type="text" value={data.title} placeholder="Enter a package Name" onChange={handle} name="title" />
            </FormGroup>
            <FormGroup>
                <Label>Description</Label>
                <Input type="text" value={data.packageName} placeholder="Enter a package Name" onChange={handle} name="packageName" />
            </FormGroup>
            <FormGroup>
                <FormGroup>
                    <Label>Purpose</Label>
                    <FormGroup check>
                        <Input type="radio" checked={data.category == "signaturerequired"} value="signaturerequired" name="purpose" onChange={handle} />
                        {' '}
                        <Label check>
                            Signature Required
                        </Label>
                    </FormGroup>

                    <FormGroup check>
                        <Input type="radio" checked={data.category == "Certificate"} value="downloadonly" name="purpose" onChange={handle} />
                        {' '}
                        <Label check>
                            Downloadonly Only
                        </Label>
                    </FormGroup>
                </FormGroup>
            </FormGroup>

            {
                roleList.length > 0 ?
                    <ComponentCard title="Roles Types">

                        <Select
                            closeMenuOnSelect={false}
                            components={{ ClearIndicator }}
                            styles={{ clearIndicator: ClearIndicatorStyles }}
                            defaultValue={[colourOptions[4], colourOptions[5]]}
                            isMulti
                            options={colourOptions}
                        />
                    </ComponentCard>
                    : "No Roles Found!"
            }
        </>
    )
}
export default React.memo(CrudDocument)