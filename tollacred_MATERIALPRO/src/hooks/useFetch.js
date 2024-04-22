import apiManager from '@/config/ApiManager';
import { useEffect, useState } from "react"

const NAME_ENTITY = 'organizations'

const useFetch = ({endpoint = '', autoGet = true, initData = []}) => {
  const [data, setData] = useState(initData)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState([])

  const getFetch = async () => {
    setError([])
    setIsLoading(true)
    setIsFetching(true)
    try {
      apiManager.get(`${NAME_ENTITY}/${endpoint}`).
      then(response => {
        setData(response)
        setIsFetching(false)
        setIsLoading(false)
      })
    }
    catch (error) {
      setError(error.push[{ get : error}])
      setIsFetching(false)
      setIsLoading(false)
    }
  }

  // const update = async (id) => {
  //   setError([])
  //   setIsFetching(true)
  //   try{
  //     apiManager.put(`${NAME_ENTITY}/${endpoint}/${id}`, body).
  //     then(response => {
  //       setIsFetching(false)
  //     })
  //   }
  //   catch(error){
  //     setError(error.push[{ update : error}])
  //     setIsFetching(false)
  //   }
  // }

  const refresh = () => {
    getFetch()
  }
  
  useEffect(() => {
    if(autoGet) getFetch()
  }, [endpoint])

  return{
    getFetch,
    data,
    isLoading,
    isFetching,
    error,
    refresh,
  }
}

export default useFetch