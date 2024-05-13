import {useState} from "react"
import organizationService from "../../organization/services/organization.service"

const initialStaff = {
    country: 'United States',
    first_name: '',
    last_name: '',
    email: '',
    facility_id: '',
}

const useActionStaff = (idOrganization) => {

    const [dataStaff, setDataStaff] = useState(initialStaff)
    const [modalStaffList, setModalStaffList] = useState(false);
    const [facilityList, setFacilityList] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getFacilityList = () => {
        organizationService.get(`${idOrganization}/facilities`)
            .then(response => {
                setFacilityList(response); /*console.log(response)*/
            })
    }

    const toggleModalStaffList = () => {
        setError(false);
        setModalStaffList(!modalStaffList)
    }

    const handleInput = (e) => {
        if (typeof e === 'object' && !!e.label) {
            dataStaff.facility_id = e.value
            setDataStaff(dataStaff)
        } else {
            const {type, name, value, checked} = e.target
            setDataStaff({...dataStaff, [name]: type == 'checkbox' ? checked : value})
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
        if (validateFieldsStaffList(action)) {
            const profile = {
                profile: {
                    country: 'United States',
                    first_name: dataStaff.first_name,
                    last_name: dataStaff.last_name,
                    email: dataStaff.email,
                    phone_number: dataStaff.phone_number
                },
                facility_id: dataStaff.facility_id,
            }
            await organizationService.create(`${idOrganization}/employees`, profile)
                .then(response => {
                    toggleModalStaffList();
                })
                .catch(error => console.log(error))
                .finally(() => {
                    setIsLoading(false);
                })
        }
        //toggleModalStaffList()
    }

    return {
        dataStaff,
        facilityList,
        getFacilityList,
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