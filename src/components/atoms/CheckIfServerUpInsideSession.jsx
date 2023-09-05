import { api, checkIfServerUp } from '../../utils/backend_configuration/BackendConfig'

function CheckIfServerUpInsideSession (props) {
  api.post(checkIfServerUp, {
  }, {
    withCredentials: true
  }
  ).then(response => {
    if (response.data.operation_success) {
      if (props.serverUnavailable) {
        props.setServerUnavailable(false)
      }
    }
  }
  ).catch(error => {
    switch (error.response.status) {
      case 503:
        if (!props.serverUnavailable) {
          props.setServerUnavailable(true)
        }
        break
      case 502:
        if (!props.serverUnavailable) {
          props.setServerUnavailable(true)
        }
        break
      default:
        break
    }
  })
}

export default CheckIfServerUpInsideSession
