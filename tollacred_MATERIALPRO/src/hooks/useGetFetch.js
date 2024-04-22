import apiManager from '@/config/ApiManager';
import { useEffect, useState } from "react"


const useGetFetch = (endpoint = '') => {
  const [fetchUrl, setFetchUrl] = useState(endpoint)
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState([])

  const getFetch = async (url) => {
    setError([])
    setIsLoading(true)
    setIsFetching(true)
    try {
      await apiManager.get(`${(!!endpoint && !!url) ? `${endpoint}/${url}` : fetchUrl ?? url}`).
      then(response => {
        setData(response)
      })
    }
    catch (error) {
      setError(error.push[{ get : error}])
    }
    finally{
      setIsFetching(false)
      setIsLoading(false)
    }
  }

  const refresh = () => {
    getFetch()
  }
  
  return{
    getFetch,
    data,
    fetchUrl,
    isLoading,
    isFetching,
    error,
    refresh,
  }
}

export default useGetFetch