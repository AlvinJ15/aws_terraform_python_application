import React, { useEffect, useState } from 'react';
import {
    Progress, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
import '../../tables/ReactBootstrapTable.scss';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ComponentCard from '../../../components/ComponentCard';
import { FetchData } from '../../../assets/js/funcionesGenerales';
const CrudRequeriment = ({ role, data, handle, lists }) => {
    const [documentTypeList, setDocumentTypeList] = useState([])
    const [roleList, setRoleList] = useState([])
    useEffect(() => {
        setRoleList(lists.roleList)
        setDocumentTypeList(lists.documentList)
    }, [])
    const options = {
        afterInsertRow: () => { },  // A hook for after insert rows
        afterDeleteRow: () => { }, // A hook for after droping rows.
        afterSearch: () => { }, // define a after search hook 
        /*onRowClick: function (row, columnIndex, rowIndex, e) {
            alert(`You click row id: , column index: ${columnIndex}, row index: ${rowIndex}`);
            console.log(e);
        },*/

    };
    const selectRowProp = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: 'pink',
        onSelect: onRowSelect
    }
    function onRowSelect(row, isSelected, e) {
        let rowStr = '';
        for (const prop in row) {
            rowStr += prop + ': "' + row[prop] + '"';
        }
        console.log(e);
        //alert(`is selected: ${isSelected}, ${rowStr}`);
    }
    const cellEditProp = {// to edit in real-time
        mode: 'click',
        blurToSave: true,
    };
    return (
        <>
            {/* {JSON.stringify(lists.roleList)} */}
            <FormGroup>
                <Label>Package Name*</Label>
                <Input type="text" value={data.packageName} placeholder="Enter a package Name" onChange={handle} name="packageName" />
            </FormGroup>
            {documentTypeList.length > 0 ?
                <ComponentCard title="Document Types">
                    <BootstrapTable 
                        search
                        data={documentTypeList}
                        //deleteRow
                        selectRow={selectRowProp}
                        pagination
                        //insertRow
                        options={options}
                        //cellEdit={cellEditProp}
                        tableHeaderClass="mb-0"
                    >
                        <TableHeaderColumn width="100" dataField="name" isKey>
                            Name
                        </TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField="description">
                            Description
                        </TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField="category">
                            Category
                        </TableHeaderColumn>
                    </BootstrapTable>
                </ComponentCard>
                : "No Document Type Found!"
            }
            <br />
            {roleList.length > 0 ?
                <ComponentCard title="Roles Types">
                    <BootstrapTable
                        striped
                        hover
                        condensed
                        search
                        data={roleList}
                        //deleteRow
                        //selectRow={selectRowProp}
                        pagination
                        //insertRow
                        //options={options}
                        //cellEdit={cellEditProp}
                        tableHeaderClass="mb-0"
                    >
                        <TableHeaderColumn width="100" dataField="name" isKey>
                            Name
                        </TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField="description">
                            Description
                        </TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField="category">
                            Category
                        </TableHeaderColumn>
                    </BootstrapTable>
                </ComponentCard>
                : "No Roles Found!"
            }
        </>
    )
}
export default React.memo(CrudRequeriment)