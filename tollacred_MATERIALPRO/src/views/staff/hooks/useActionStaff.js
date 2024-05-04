import { useState } from "react"
import organizationService from "../../organization/services/organization.service"

const initialStaff = {
  country: 'United States',
  first_name: '',
  last_name: '',
  email: '',
  role_id: '',
}

const useActionStaff = (idOrganization) => {

  const [dataStaff, setDataStaff] = useState(initialStaff)
  const [modalStaffList, setModalStaffList] = useState(false);
  const [roleList, setRoleList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getRoleList = () => {
    organizationService.get(`${idOrganization}/roles`)
      .then(response => { setRoleList(response); /*console.log(response)*/ })
  }

  const toggleModalStaffList = () => {
    setError(false);
    setModalStaffList(!modalStaffList)
  }

  const handleInput = (e) => {
    if (typeof e === 'object' && !!e.label) {
      dataStaff.role_id = e.value
      setDataStaff(dataStaff)
    }
    else {
      const { type, name, value, checked } = e.target
      setDataStaff({ ...dataStaff, [name]: type == 'checkbox' ? checked : value })
    }
  }

  const [error, setError] = useState({
    status: false,
    message: ''
  })
  const validateFieldsStaffList = (action = "CREATE") => {
    if (dataStaff.packageName == "") {
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
  const mangeStaffCreate = async (action) => {
    toggleModalStaffList()
    if (validateFieldsStaffList(action)) {
      const profile = {
        profile: {
          country: 'United States',
          first_name: dataStaff.first_name,
          last_name: dataStaff.last_name,
          email: dataStaff.email,
        },
        role_id: dataStaff.role_id,
      }
      await organizationService.create(`${idOrganization}/employees`, profile)
        .then(response => {
          toggleModalStaffList()
        })
    }
    //toggleModalStaffList()
  }

  return {
    dataStaff,
    roleList,
    getRoleList,
    isLoading,
    setIsLoading,
    toggleModalStaffList,
    modalStaffList,
    handleInput,
    error,
    mangeStaffCreate
  }
}

export default useActionStaff;