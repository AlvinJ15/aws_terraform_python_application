import { Card, CardBody, CardTitle, CardSubtitle, Table } from 'reactstrap';
import user1 from '../../assets/images/users/user1.jpg';
import user2 from '../../assets/images/users/user2.jpg';
import user3 from '../../assets/images/users/user3.jpg';
import folder_icon from '../../assets/images/icons/icons8-folder-96.png';
import file_icon from '../../assets/images/icons/icons8-file-96.png';
import user5 from '../../assets/images/users/user5.jpg';
import BreadCrumbs from "@/layouts/breadcrumbs/BreadCrumbs.js";
import React, {useEffect, useState} from "react";
import ComponentCard from "@/components/ComponentCard.js";
import ReactTable from "react-table-v6";
import {useLocation, useParams, useNavigate} from "react-router-dom";
import FileService from "@/views/file-explorer/services/file.service.js";
import 'react-table-v6/react-table.css';


/*const tableData = [
  {
    avatar: user1,
    name: 'Hanna Gover',
    email: 'hgover@gmail.com',
    project: 'Flexy React',
    status: 'pending',
    weeks: '35',
    budget: '95K',
  },
  {
    avatar: user2,
    name: 'Jonathan Gover',
    email: 'hgover@gmail.com',
    project: 'Lading pro React',
    status: 'done',
    weeks: '35',
    budget: '95K',
  },
  {
    avatar: user3,
    name: 'Steave',
    email: 'hgover@gmail.com',
    project: 'Elite React',
    status: 'holt',
    weeks: '35',
    budget: '95K',
  },
  {
    avatar: folder_icon,
    name: 'Mukesh chava',
    email: 'hgover@gmail.com',
    project: 'Flexy React',
    status: 'pending',
    weeks: '35',
    budget: '95K',
  },
  {
    avatar: user5,
    name: 'Thuklk luu',
    email: 'hgover@gmail.com',
    project: 'Ample React',
    status: 'done',
    weeks: '35',
    budget: '95K',
  },
];*/

const FilesTable = () => {

  const params = useParams()
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [tableData, setTableData] = useState([])
  useEffect( () => {
    const path = searchParams.get('path') || "app_data/orgs/Pulse 2024/Ongoing/";

    FileService.getFiles(params.idOrganization, path)
      .then(value => {
        const filteredFiles = value.files.filter(file => file !== null);
        setTableData(filteredFiles)
    });
  }, [location.search]);

  const updateQueryParams = (newParams) => {
    const searchParams = new URLSearchParams(location.search);

    // Merge new params with existing params
    Object.keys(newParams).forEach(key => {
      searchParams.set(key, newParams[key]);
    });

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handleClick = (objectPath) => {
    objectPath = objectPath.replace(`${import.meta.env.VITE_ENV}/`, '')
    updateQueryParams({ path: objectPath });
  };

  const get_object_name = (full_name) => {
    return full_name.replace(/\/$/, '').split('/').pop()
  }

  return (
    <div>
      <BreadCrumbs name='Files' />
      <Card>
        <CardBody>
          <CardTitle tag="h5">Project Listing</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Overview of the projects
          </CardSubtitle>
          <ComponentCard title="Action Table">
            <ReactTable
              columns={[
                {
                  Header: 'FileName',
                  accessor: 'object_key',
                  Cell: row => (
                    <div className="d-flex align-items-center p-2" onClick={() => handleClick(row.value)}>
                      <img
                        src={row.original.type === 'folder' ? folder_icon : file_icon}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <div className="ms-3">
                        <h6 className="mb-0">{get_object_name(row.value)}</h6>
                        <span className="text-muted">{get_object_name(row.value)}</span>
                      </div>
                    </div>
                  )
                },
                {
                  Header: 'Modification Date',
                  accessor: 'modification_date',
                },
                {
                  Header: 'Size',
                  accessor: 'size',
                },
                {
                  Header: 'Type',
                  accessor: 'type',
                }
              ]}
              defaultPageSize={10}
              showPaginationBottom
              className="-striped -highlight"
              data={tableData}
              filterable
            />
          </ComponentCard>
          {/*<Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
            <tr>
              <th>Team Lead</th>
              <th>Project</th>

              <th>Status</th>
              <th>Weeks</th>
              <th>Budget</th>
            </tr>
            </thead>
            <tbody>
            {tableData.map((tdata) => (
              <tr key={tdata.name} className="border-top">
                <td>
                  <div className="d-flex align-items-center p-2">
                    <img
                      src={tdata.avatar}
                      className="rounded-circle"
                      alt="avatar"
                      width="45"
                      height="45"
                    />
                    <div className="ms-3">
                      <h6 className="mb-0">{tdata.name}</h6>
                      <span className="text-muted">{tdata.email}</span>
                    </div>
                  </div>
                </td>
                <td>{tdata.project}</td>
                <td>
                  {tdata.status === 'pending' ? (
                    <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                  ) : tdata.status === 'holt' ? (
                    <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                  ) : (
                    <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                  )}
                </td>
                <td>{tdata.weeks}</td>
                <td>{tdata.budget}</td>
              </tr>
            ))}
            </tbody>
          </Table>*/}
        </CardBody>
      </Card>
    </div>
  );
};

export default FilesTable;
