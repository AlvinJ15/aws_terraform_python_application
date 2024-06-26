import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Progress} from 'reactstrap';
import React, {useEffect, useState} from "react";
import {useLocation, useParams, useNavigate} from "react-router-dom";
import FileService from "@/views/file-explorer/services/file.service.js";
import 'react-table-v6/react-table.css';
import * as Icon from 'react-feather';

const FileActionButtons = ({ newUpdated, setNewUpdated }) => {

  const params = useParams()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [openUploadModal, setOpenUploadModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadDocument, setIsUploadDocument] = useState(true)
  const [folderName, setFolderName] = useState("")
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  function put(url, data) {
    return fetch(url, {
      method: "PUT",
      body: data,
    });
  }

  const uploadDocument = () => {
    setIsLoading(true);
    if (isUploadDocument && !selectedFile) {
      alert("Please select a file first!");
      return;
    }
    if (isUploadDocument) {
      const fileData = {
        file_name: selectedFile.name,
        file_type: selectedFile.type
      }
      const path = encodeURIComponent(searchParams.get('path') || "");
      FileService.uploadFile(params.idOrganization, path, fileData).then(response => {
          setLoadingPercentage(50);
          if (selectedFile) {
            console.log("Upload file to S3");
            put(response.upload_url, selectedFile).then( response => {
                setNewUpdated(newUpdated + 1);
                setLoadingPercentage(100);
                setIsLoading(false);
                toggleModalDocument();
              }
            );
          } else {
            setLoadingPercentage(100);
            setIsLoading(false);
            toggleModalDocument();
          }
      })
    } else{
      const fileData = {
        folder_name: folderName,
      }
      const path = encodeURIComponent(searchParams.get('path') || "");
      setLoadingPercentage(50);
      FileService.uploadFile(params.idOrganization, path, fileData).then(response => {
        setNewUpdated(newUpdated + 1);
        setLoadingPercentage(100);
        toggleModalDocument();
        setIsLoading(false);
      })
    }

  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleFolderChange = (event) => {
    setFolderName(event.target.value);
  };


  const toggleModalDocument = () => {
    setOpenUploadModal(!openUploadModal);
  }

  const openFolderCreation = () => {
    setIsUploadDocument(false);
    toggleModalDocument();
  }

  const openFileUpload = () => {
    setIsUploadDocument(true);
    toggleModalDocument();
  }



  return (
    <div className="button-group">
    <Button className="btn" color="primary" onClick={openFolderCreation}>
        <Icon.FolderPlus size={20}/> New
      </Button>
      <Button className="btn" color="secondary" onClick={openFileUpload}>
        <Icon.Upload size={20}/> Upload
      </Button>
      <Modal isOpen={openUploadModal} className={"primary"}>
        {
          isUploadDocument ?
            <>
              <ModalHeader title="Upload Document" >
                Upload Document
              </ModalHeader>
              <ModalBody>
                <div className='mb-3'>
                  <input type='file' className='form-control' name='file' onChange={handleFileChange}/>
                </div>
              </ModalBody>
            </>
           :
            <>
              <ModalHeader>
                Create Folder
              </ModalHeader>
              <ModalBody>
                <div className='mb-3'>
                  <input type='text' id="folder_name" className='form-control' name='folder_name' onChange={handleFolderChange}/>
                </div>
              </ModalBody>
            </>
        }
        <ModalFooter>
          {
            isLoading ?
              <Progress
                className="mb-3" striped color="primary" value={loadingPercentage}
                style={{height: '30px', width: '100%'}}>
                {`${loadingPercentage}%`}
              </Progress>
              :
              <div>
                <Button className='text-primary bg-white' color="light"
                        onClick={toggleModalDocument}>Cancel</Button>
                <Button color="primary" onClick={() => uploadDocument()}>Upload</Button>
              </div>
          }
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FileActionButtons;
