import { useEffect, useState } from "react"
import organizationService from "../services/organization.service"
import apiManager from "../../../config/ApiManager"

const NAME_ENTITY = 'organizations'

const initialRequeriment = {
    id: '',
    name: '',
    document_types: [],
    roles: [],
}

const useActionRequeriments = (idOrganization, dataInicial = initialRequeriment) => {
    const [dataRequeriment, setDataRequeriment] = useState(dataInicial)
    const [isLogin, setIsLogin] = useState(false)

    const [documentList, setDocumentList] = useState([])
    const [roleList, setRoleList] = useState([])
    const [modalRequeriment, setModalRequeriment] = useState(false);
    const [isFetching, setIsFetching] = useState(false)

    const getDocumentList = () => {
        organizationService.get(`${idOrganization}/documents`)
            .then(response => setDocumentList(response))
    }

    const getRoleList = () => {
        organizationService.get(`${idOrganization}/roles`)
            .then(response => setRoleList(response))
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
                roles: dataRequeriment.roles
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
            roles: dataRequeriment.roles
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
        getRoleList,
        documentList,
        roleList,
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