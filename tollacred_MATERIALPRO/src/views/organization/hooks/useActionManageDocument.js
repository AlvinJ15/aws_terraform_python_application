import { useState } from "react"
import OrganizationService from "../services/organization.service.js"

const initilaError = {
  status: false,
  message: ''
}

const initialDocumentTypes = {
  name: '',
  description: '',
  category: '',
  expiration: 0,
}

const useActionManageDocument = (idOrganization) => {
  const [dataDocument, setDataDocument] = useState(initialDocumentTypes)
  const [error, setError] = useState(initilaError)
  const [isLoading, setIsLoading] = useState(false)

  const [modalDocumentType, setModalDocumentType] = useState(false);


  const handleInput = (e) => {
    if(Array.isArray(e)){
      console.log(e)
    }
    else{
      const { type, name, value, checked } = e.target
      setDataDocument({ ...dataDocument, [name]: type == 'checkbox' ? checked : value })
    }
  }

  const setMessageError = (message) => {
      setError({
          status: message != "",
          message: message
      })
  }

  const validateFieldsDocument = (action = "CREATE") => {
    switch (action) {
        case "DELETE":
            if (dataDocument.organizationId == "" || dataDocument.name == "" || dataDocument.category == "") {
                setMessageError('All fields are required to delete')
                return false
            }
            break;
        case "EDIT":
            if (dataDocument.organizationId == "" || dataDocument.name == "" || dataDocument.category == "") {
                setMessageError('All fields are required to edit')
                return false
            }
            break;
        default:
            if (dataDocument.name == "" || dataDocument.description == "" || dataDocument.category == "" || dataDocument.expiration == 0) {
                setMessageError('All fields are required by default')
                return false
            }
    }
    return true
  }
  const mangeDocumentAction = (action) => {
    setIsLoading(true)
    if (validateFieldsDocument(action)) {
        let endpoint = `${idOrganization}/documents`
        switch (action) {
            case "CREATE":
                OrganizationService.create(endpoint, dataDocument).then(response => {
                  if(response.id){
                    alert("Document created successfully")
                    setModalDocumentType(!modalDocumentType)
                  }
                  setIsLoading(false)
                })
                break;
            case "EDIT":
                break;
            case "DELETE":
                break;
            default:
                break;
        }

    }
  }
  
  const toggleModalDocumentType = () => { 
    setError(false);
    setDataDocument(initialDocumentTypes);
    setModalDocumentType(!modalDocumentType);
  }   


  return {
    dataDocument,
    setDataDocument,
    error,
    setError,
    isLoading,
    mangeDocumentAction,
    handleInput,
    modalDocumentType,
    toggleModalDocumentType
  }
}

export default useActionManageDocument