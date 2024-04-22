import { useState } from "react"

const initalQuestionnaires = {
  id: '',
  name: '',
  description: '',
  questions: [],
}

const useActionQuestionnaires = (idOrganization) => {

  const [dataQuestionnaire, setDataQuestionnaire] = useState(initalQuestionnaires)
  const toggleCrud = () => { setOpenCrud(!openCrud) }
  const [modalQuestionnaire, setModalQuestionnaire] = useState(false);
  
  const [openCrud, setOpenCrud] = useState(false)
  const toggleModalQuestionnaire = () => { setError(false); setModalQuestionnaire(!modalQuestionnaire) }

  const handleInput = (e) => {
      const { type, name, value, checked } = e.target
      console.log("name", name, "type", type, "value", value, "checked", checked)
      setDataQuestionnaire({ ...dataQuestionnaire, [name]: type == 'checkbox' ? checked : value })
  }
  const [error, setError] = useState({
      status: false,
      message: ''
  })

  const validateFieldsQuestionnaire = (action = "CREATE") => {
      if (dataQuestionnaire.packageName == "") {
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

  const mangeQuestionnaire = (action) => {
      if (validateFieldsQuestionnaire(action)) {
          alert("mandare a " + action)
          let endpoint = "'organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/save'"
          // FetchData(endpoint, "GET", dataQuestionnaire).then(response => {
          //     console.log("ar", response)
          //     setQuestionnairesList(response)
          // })
      }
  }

  return {
    mangeQuestionnaire,
    handleInput,
    dataQuestionnaire,
    error,
    toggleCrud,
    modalQuestionnaire,
    openCrud,
    setOpenCrud,
    toggleModalQuestionnaire
  }

}

export default useActionQuestionnaires;