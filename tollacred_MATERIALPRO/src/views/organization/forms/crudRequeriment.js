import React, { useEffect, useState } from 'react';
import {
    Progress, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
import '../../tables/ReactBootstrapTable.scss';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ComponentCard from '../../../components/ComponentCard';


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
    const selectRowPropDocument = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: 'pink',
        selected: gettingSelectedes("documentList", "id", data.document_types),
        onSelect: onRowSelectDocument
    }
    function gettingSelectedes(type, field, array) {
        let list = []
        //console.log("quefue", lists[type]);
        if (array.length > 0) {
            lists[type].map(item => {
                if (array.includes(item[field])) {
                    list.push(item[field])
                }
            })
        }
        return list
    }
    function onRowSelectDocument(row, isSelected, e) {
        let documents = [...data.document_types]
        if (isSelected) {
            //data.document_types.push(row.id)
            documents.push(row.id)
        } else {
            //delete the item in documents array
            documents = documents.filter(item => item !== row.id)
        }
        handle({ target: { name: "document_types", value: documents } })
        //alert(`is selected: ${isSelected}, ${rowStr}`);
    }

    const selectRowPropRole = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: 'pink',
        selected: gettingSelectedes("roleList", "role_id", data.roles),
        onSelect: onRowSelectRole
    }
    function onRowSelectRole(row, isSelected, e) {
        //console.log("seleccioo", row)
        let roles = [...data.roles]
        if (isSelected) {
            roles.push(row.role_id)
        } else {
            roles = roles.filter(item => item !== row.role_id)
        }
        handle({ target: { name: "roles", value: roles } })
    }
    const cellEditProp = {// to edit in real-time
        mode: 'click',
        blurToSave: true,
    };
    return (
        <>
            {/* {JSON.stringify(lists.roleList)} */}
            {/* {JSON.stringify(data)} */}
            <FormGroup>
                <Label>Package Name*</Label>
                <Input type="text" value={data.name} placeholder="Enter a package Name" onChange={handle} name="name" />
            </FormGroup>
            {documentTypeList.length > 0 ?
                <ComponentCard title="Document Types">
                    <BootstrapTable
                        search
                        data={documentTypeList}
                        //deleteRow
                        selectRow={selectRowPropDocument}
                        pagination
                        //insertRow
                        options={options}
                        //cellEdit={cellEditProp}
                        tableHeaderClass="mb-0"
                    >
                        <TableHeaderColumn width="100" dataField="id" hidden isKey>
                            ID
                        </TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField="name">
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
                        selectRow={selectRowPropRole}
                        pagination
                        //insertRow
                        //options={options}
                        //cellEdit={cellEditProp}
                        tableHeaderClass="mb-0"
                    >
                        <TableHeaderColumn width="100" dataField="role_id" hidden isKey>
                            ID
                        </TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField="name" >
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