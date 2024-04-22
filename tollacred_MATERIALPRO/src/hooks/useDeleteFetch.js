import { useState } from "react"
import apiManager from "../config/ApiManager"

const NAME_ENTITY = 'organizations'

const useDeleteFetch = ({endpoint = ''}) => {
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState({})

  const destroy = async (id) => {
    setError({})
    setIsFetching(true)
    try{
      apiManager.delete(`${NAME_ENTITY}/${endpoint}/${id}`).
      then(response => {
        setIsFetching(false)
      })
    }
    catch(err){
      setError({ ... error, 'destroy' : err})
      setIsFetching(false)
    }
  }

  return {
    isFetching,
    destroy,
    error,
  }
}

export default useDeleteFetch