import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress
} from 'reactstrap';
import React, {useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import 'react-table-v6/react-table.css';
import {ContextMenu} from "react-contextmenu";
import FileService from "@/views/file-explorer/services/file.service.js";

const FileContextMenu = ({ contextMenu, refreshTable }) => {

  const params = useParams()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [openModal, setOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRenameModal, setIsRenameModal] = useState(true)
  const [objectName, setObjectName] = useState(contextMenu.row.original.object_key.split('/').pop())
  const [selectedFile, setSelectedFile] = useState(null);
  const [linkRedirectModal, setLinkRedirectModal] = useState(false);
  // Modal states:
  const [isOpen1, setIsOpen1] = useState(false);

  const handleContextMenuEditClick = (row) => {
    setObjectName(contextMenu.row.original.object_key.split('/').pop())
    if (contextMenu.row.original.tags['file_visibility'] !== 'file_explorer') {
      setLinkRedirectModal(true);
      return;
    }
    setIsRenameModal(true);
    toggleModalDocument();
  };

  const handleContextMenuDeleteClick = (row) => {
    if (contextMenu.row.original.tags['file_visibility'] !== 'file_explorer') {
      setLinkRedirectModal(true);
      return;
    }
    setIsRenameModal(false);
    toggleModalDocument();
  };


  const renameObject = () => {
    if (contextMenu.row.original.object_key.endsWith('/')){
      alert('Cant Rename Folders!');
      toggleModalDocument();
    }

    const fileData = {
      original_name: contextMenu.row.original.object_key,
      new_name: objectName
    }
    const fileName = fileData.original_name.split('/').pop()
    FileService.editFile(params.idOrganization, fileData, fileName).then(response => {
      refreshTable();
      toggleModalDocument();
      setIsLoading(false);
    })
  };

  const deleteObject = () => {
    const fileData = {
      original_name: contextMenu.row.original.object_key,
    }
    const fileName = fileData.original_name.split('/').pop()
    FileService.deleteFile(params.idOrganization, fileData, fileName).then(response => {
      refreshTable();
      toggleModalDocument();
      setIsLoading(false);
    })
  };
  const handleObjectNameChange = (event) => {
    setObjectName(event.target.value);
  };

  const toggleModalDocument = () => {
    setOpenModal(!openModal);
  }

  const toggle1 = () => {
    setIsOpen1(!isOpen1);
  };
  const toggle = () => {
    setLinkRedirectModal(!linkRedirectModal);
  };

  return (
    <>
    <ContextMenu id={`contextmenu_${contextMenu.row.index}`} style={{top: contextMenu.y, left: contextMenu.x}}>
      <ButtonDropdown isOpen={true} toggle={toggle1.bind(null)}>
        <DropdownMenu>
          <DropdownItem onClick={() => handleContextMenuEditClick(contextMenu.row)}>Edit</DropdownItem>
          <DropdownItem onClick={() => handleContextMenuDeleteClick(contextMenu.row)}>Delete</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </ContextMenu>
    <Modal isOpen={openModal} className={"primary"}>
        {
          isRenameModal ?
            <>
              <ModalHeader title="Rename Object" >
                Rename Object
              </ModalHeader>
              <ModalBody>
                <div className='mb-3'>
                  <input type='text' id="folder_name" className='form-control' name='folder_name'
                         value={objectName}
                         onChange={handleObjectNameChange}/>
                </div>
              </ModalBody>
              <ModalFooter>
                <div>
                  <Button className='text-primary bg-white' color="light"
                          onClick={toggleModalDocument}>Cancel</Button>
                <Button color="primary" onClick={() => renameObject()}>Rename</Button>
              </div>
        </ModalFooter>
            </>
           :
            <>
              <ModalHeader>
                Delete Object
              </ModalHeader>
                <ModalFooter>
                  <Button className='text-primary bg-white' color="light"
                          onClick={toggleModalDocument}>Cancel</Button>
                  <Button color="primary" onClick={() => deleteObject()}>Delete</Button>
              </ModalFooter>
            </>
        }
      </Modal>
      <Modal isOpen={linkRedirectModal} toggle={toggle.bind(null)}>
        <ModalHeader toggle={toggle.bind(null)}>Modal title</ModalHeader>
        <ModalBody>
          Please go into Staff documents to edit/delete this document: <br />
          <a href={`/organization/${params.idOrganization}/staff`}>CLICK HERE</a>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle.bind(null)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default FileContextMenu;
