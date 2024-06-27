import {
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import React, {useEffect, useState} from "react";
import ComponentCard from "@/components/ComponentCard.js";
import ReactTable from "react-table-v6";
import {useLocation, useParams, useNavigate} from "react-router-dom";
import FileService from "@/views/file-explorer/services/file.service.js";
import 'react-table-v6/react-table.css';
import FileBreadCrumb from "@/layouts/breadcrumbs/FileExplorerBreadCrumb.js";
import FileActionButtons from "@/views/file-explorer/FileActionButtons.js";
import { format } from 'date-fns';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import FileContextMenu from "@/views/file-explorer/FileContextMenu.js";
import folderIcon from '../../assets/images/icons/icons8-folder-96.png';
import fileIcon from '../../assets/images/icons/icons8-file-96.png';
import pdfIcon from '../../assets/images/icons/icons8-pdf-96.png';
import imageIcon from '../../assets/images/icons/icons8-image-96.png';
import csvIcon from '../../assets/images/icons/icons8-csv-96.png';
const FilesTable = () => {

  const params = useParams()
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [tableData, setTableData] = useState([])
  const [newUpdated, setNewUpdated] = useState(0)
  useEffect(() => {
    const path = searchParams.get('path') || "";

    FileService.getFiles(params.idOrganization, path)
      .then(value => {
        const filteredFiles = value.files.filter(file => file !== null);
        setTableData(filteredFiles)
      });
  }, [newUpdated, location.search]);

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

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    row: null
  });

  const handleClickFile = (row) => {
    let objectPath = row.original.object_key;
    objectPath = objectPath.replace(`${import.meta.env.VITE_ENV}/`, '')
    if (row.original.type === 'folder')
      updateQueryParams({path: objectPath});
    else {
      downloadFile(params.idOrganization, objectPath)
    }
  };

  const handleRightClick = (e, row) => {
    if (row.original.type === 'file') {
      e.preventDefault();
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        row
      });
    }
  };

  const getObjectName = (full_name) => {
    return full_name.replace(/\/$/, '').split('/').pop()
  }

  const refreshTable = () => {
    setNewUpdated(newUpdated+1);
  }

const getFileIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();

  switch (extension) {
    case 'pdf':
      return pdfIcon;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return imageIcon;
    case 'csv':
      return csvIcon;
    default:
      return fileIcon;
  }
};

  return (
    <div>
      <Card>
        <CardBody>
          <ComponentCard>
            <CardTitle tag="h3">Data Migration Pulse</CardTitle>
            <FileActionButtons newUpdated={newUpdated} setNewUpdated={setNewUpdated}></FileActionButtons>
            <FileBreadCrumb/>
            <ReactTable
              columns={[
                {
                  id: 'file_name',
                  Header: 'FileName',
                  accessor: d => getObjectName(d.object_key),
                  Cell: row => (
                    <ContextMenuTrigger id={`contextmenu_${row.index}`} holdToDisplay={-1}>
                      <div className="d-flex align-items-center p-2"
                        onClick={() => handleClickFile(row)}
                        onContextMenu={(e) => handleRightClick(e, row)}
                      >
                        <img
                          src={row.original.type === 'folder' ? folderIcon : getFileIcon(row.value)}
                          className="rounded-circle"
                          alt="avatar"
                          width="45"
                          height="45"
                        />
                        <div className="ms-3">
                          <h6 className="mb-0">{row.value}</h6>
                          <span className="text-muted">{row.value}</span>
                        </div>
                      </div>
                    </ContextMenuTrigger>
                  )
                },
                {
                  id: 'modification_date',
                  Header: 'Modification Date',
                  accessor: d => d.modification_date !== '-' ? format(new Date(d.modification_date), 'yyyy-MM-dd'): '',
                  filterable: false
                },
                {
                  Header: 'Size',
                  accessor: 'size',
                  filterable: false
                },
                {
                  Header: 'Type',
                  accessor: 'type',
                  filterable: false
                }
              ]}
              defaultPageSize={10}
              showPaginationBottom
              className="-striped -highlight"
              data={tableData}
              filterable
            />
            {contextMenu.visible && (
              <FileContextMenu contextMenu={contextMenu} refreshTable={refreshTable}></FileContextMenu>
            )}
          </ComponentCard>
        </CardBody>
      </Card>
    </div>
  );
};

export default FilesTable;
