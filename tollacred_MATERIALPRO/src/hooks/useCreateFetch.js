import { useState } from "react"
import apiManager from "../config/ApiManager"

const NAME_ENTITY = 'organizations'

const useCreateFetch = ({endpoint='', initData = null}) =>{
  const [data, setData] = useState(initData)
  const [result, setResult] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState({})


  const handleInput = (e) => {
    if(typeof e === 'object' && e.hasOwnProperty('nameSelect'))
    {
      const tempSelect = {...data}
      const key = [e['nameSelect']]
      tempSelect[key] = e.value
      setData({ ... tempSelect })
    }
    else if(!!e.target){
      const { type, name, value, checked } = e.target
      setData({ ...data, [name]: type == 'checkbox' ? checked : value })
    }
  }

  const validate = ({dataValidate = []}) => {
    let countErrors = 0
    setError({})

    if(dataValidate[0] == '*'){
      for (const [key] of Object.entries(data)) {
        if(data[key] === '' || data[key] === null){
          setError({...error,  error : 'Please fill all fields'})
          countErrors++
          break
        }
      }
    }
    else {
      dataValidate.map(key => {
        if(!!!data[key]){
          setError({...error, [key]: 'field is required'})
          countErrors++
        }
      })
    }

    return countErrors
  }

  const create = async () => {
    
    setIsFetching(true)

    for (const [key, value] of Object.entries(data)) {
      if(Array.isArray(value)){
        data[key] = data[key].map(item => item.value)
      }
    }
    try{
        await apiManager.post(`${NAME_ENTITY}/${endpoint}`, data).
        then(response => {
          setIsFetching(false)
          setResult(response)
      })
    }
    catch (error) {
      setError(error.push[{ create : error}])
      setIsFetching(false)
    }  
  }

  return {data, setData, validate, isFetching, create, error, setError, handleInput, result }

}

export default useCreateFetch