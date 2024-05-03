import { useState } from "react"
import organizationService from "../services/organization.service"

const initialDocument = {
    id: '',
    title: '',
    description: '',
    purpose: '',
    notifiacionCheckBox: false,
    roles: [],
}

const errorInitial = {
    status: false,
    message: ''
}

const useCreateDocument = () => {

  const [dataDocument, setDataDocument] = useState(initialDocument)
  const [roleList, setRoleList] = useState([])
  const [modalDocument, setModalDocument] = useState(false);
  const [error, setError] = useState(errorInitial)


  const getRoleList = () => {
      organizationService.get('9cf728c0-288a-4d92-9524-04d58b2ab32d/roles')
      .then(response => setRoleList(response))
  }

  const handleInput = (e) => {
    if(Array.isArray(e)){ 
    }
    else {
      const { type, name, value, checked } = e.target
      setDataDocument({ ...dataDocument, [name]: type == 'checkbox' ? checked : value })
    }
  }

  const toggleModalDocument = () => { 
    setError(false); 
    if(modalDocument) getRoleList()
    setModalDocument(!modalDocument) 
  }
  
  const validateFieldsDocument = (action = "CREATE") => {
      if (dataDocument.packageName == "") {
          setMessageError('All fields are required by default')
          return false
      }
      return true
  }
  const setMessageError = (message) => {
      setError({
          status: message != "",
          message: message
      })
  }
  const mangeDocument = (action) => {
      if (validateFieldsDocument(action)) {
          alert("mandare a " + action)
          let endpoint = "'organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/save'"
          FetchData(endpoint, "GET", dataDocument).then(response => { 
              setDocumentsList(response)
          })
      }
  }

  return {
    dataDocument,
    roleList,
    modalDocument,
    error,
    toggleModalDocument,
    handleInput,
    mangeDocument,
    getRoleList
  }

}

export default useCreateDocument