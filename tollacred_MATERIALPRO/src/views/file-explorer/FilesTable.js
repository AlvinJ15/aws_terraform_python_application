import {Card, CardBody, CardTitle, CardSubtitle, Table, Button} from 'reactstrap';
import folder_icon from '../../assets/images/icons/icons8-folder-96.png';
import file_icon from '../../assets/images/icons/icons8-file-96.png';
import React, {useEffect, useState} from "react";
import ComponentCard from "@/components/ComponentCard.js";
import ReactTable from "react-table-v6";
import {useLocation, useParams, useNavigate} from "react-router-dom";
import FileService from "@/views/file-explorer/services/file.service.js";
import 'react-table-v6/react-table.css';
import FileBreadCrumb from "@/layouts/breadcrumbs/FileExplorerBreadCrumb.js";
import * as Icon from 'react-feather';

const FilesTable = () => {

  const params = useParams()
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [tableData, setTableData] = useState([])
  useEffect(() => {
    const path = searchParams.get('path') || "";

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

  const downloadFile = async (idOrganization, objectPath) => {
    try {
      const response = await FileService.getSingleFile(idOrganization, objectPath);
      if (response.download_url) {
        const url = response.download_url;
        Object.assign(document.createElement('a'), {
          target: '_blank',
          rel: 'noopener noreferrer',
          href: url,
        }).click();
      } else {
        console.error('Error: Download URL not found.');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleClick = (row) => {
    let objectPath = row.value;
    objectPath = objectPath.replace(`${import.meta.env.VITE_ENV}/`, '')
    if (row.original.type === 'folder')
      updateQueryParams({path: objectPath});
    else {
      downloadFile(params.idOrganization, objectPath)
    }
  };

  const get_object_name = (full_name) => {
    return full_name.replace(/\/$/, '').split('/').pop()
  }

  return (
    <div>
      <Card>
        <CardBody>
          <ComponentCard>
            <CardTitle tag="h3">Data Migration Pulse</CardTitle>
            <div className="button-group">
              <Button className="btn" color="primary">
                <Icon.FolderPlus size={20}/> New
              </Button>
              <Button className="btn" color="secondary">
                <Icon.Upload size={20}/> Upload
              </Button>
            </div>
            <FileBreadCrumb/* name='Files'*//>
            <ReactTable
              columns={[
                {
                  Header: 'FileName',
                  accessor: 'object_key',
                  Cell: row => (
                    <div className="d-flex align-items-center p-2" onClick={() => handleClick(row)}>
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
        </CardBody>
      </Card>
    </div>
  );
};

export default FilesTable;
