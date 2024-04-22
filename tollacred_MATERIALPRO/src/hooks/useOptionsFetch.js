import { useState } from "react"
import apiManager from "../config/ApiManager"

const NAME_ENTITY = 'organizations'

const useOptionsFetch = ({ endpoint = '' }) => {
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState({})

  const send = async (data) => {
    setError({})
    setIsFetching(true)
    try {
      apiManager.options(`${NAME_ENTITY}/${endpoint}/`, data).
        then(response => {
          setIsFetching(false)
        })
    }
    catch (err) {
      setError({ ...error, 'options': err })
      setIsFetching(false)
    }
  }

  return {
    isFetching,
    send,
    error,
  }
}

export default useOptionsFetch