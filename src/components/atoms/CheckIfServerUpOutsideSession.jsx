import { api, checkIfServerUp } from '../../utils/backend_configuration/BackendConfig'

function CheckIfServerUpOutsideSession (props) {
  api.post(checkIfServerUp, {
  }, {
    withCredentials: true
  }
  ).then(response => {
    if (response.data.operation_success) {
      props.setServerUnavailable(false)
    }
  }
  ).catch(error => {
    switch (error.response.status) {
      case 503:
        props.setServerUnavailable(true)
        break
      case 502:
        props.setServerUnavailable(true)
        break
      default:
        break
    }
  })
}

export default CheckIfServerUpOutsideSession
