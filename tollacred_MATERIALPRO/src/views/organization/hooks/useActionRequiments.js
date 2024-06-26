import { useEffect, useState } from "react"
import OrganizationService from "../services/organization.service.js"
import apiManager from "../../../config/ApiManager"

const NAME_ENTITY = 'organizations'

const initialRequeriment = {
    id: '',
    name: '',
    document_types: [],
    facilities: [],
}

const useActionRequeriments = (idOrganization, dataInicial = initialRequeriment) => {
    const [dataRequeriment, setDataRequeriment] = useState(dataInicial)
    const [isLogin, setIsLogin] = useState(false)

    const [documentList, setDocumentList] = useState([])
    const [facilityList, setFacilityList] = useState([])
    const [modalRequeriment, setModalRequeriment] = useState(false);
    const [isFetching, setIsFetching] = useState(false)

    const getDocumentList = () => {
        OrganizationService.get(`${idOrganization}/documents`)
            .then(response => setDocumentList(response))
    }

    const getFacilityList = () => {
        OrganizationService.get(`${idOrganization}/facilities`)
            .then(response => setFacilityList(response))
    }


    const toggleModalRequeriment = () => {
        setError({ status: false, message: '' });
        setModalRequeriment(!modalRequeriment)
    }

    const handleInput = (e) => {
        const { type, name, value, checked } = e.target
        setDataRequeriment({ ...dataRequeriment, [name]: type == 'checkbox' ? checked : value })
    }
    const [error, setError] = useState({
        status: false,
        message: ''
    })

    const validateFieldsRequeriment = (action = "CREATE") => {
        if (dataRequeriment.packageName == "") {
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
    const mangeRequerimentAction = async (endpoint) => {
        if (validateFieldsRequeriment()) {
            setIsFetching(true)
            let body_endpoint = {
                name: dataRequeriment.name,
                documentTypes: dataRequeriment.document_types,
                facilities: dataRequeriment.facilities
            }
            try {
                await apiManager.post(`${NAME_ENTITY}/${endpoint}`, body_endpoint).
                    then(response => { setIsFetching(false) })
            }
            catch (error) {
                //console.log("errorpacakges", error)
                setError({ status: true, error: error })
                setIsFetching(false)
            }
        }
    }
    const updateRequerimentAction = async (endpoint) => {
        setIsFetching(true)
        let body_endpoint = {
            package_id: dataRequeriment.id,
            name: dataRequeriment.name,
            document_types: dataRequeriment.document_types,
            facilities: dataRequeriment.facilities
        }
        try {
            await apiManager.put(`${NAME_ENTITY}/${endpoint}`, body_endpoint).
                then(response => { setIsFetching(false) })
        }
        catch (error) {
            //console.log("errorpacakges", error)
            setError({ status: true, error: error })
            setIsFetching(false)
        }
    }
    return {
        dataRequeriment,
        setDataRequeriment,
        isLogin,
        getDocumentList,
        getFacilityList,
        documentList,
        facilityList,
        handleInput,
        error,
        modalRequeriment,
        toggleModalRequeriment,
        mangeRequerimentAction,
        isFetching,
        updateRequerimentAction
    }

}

export default useActionRequeriments