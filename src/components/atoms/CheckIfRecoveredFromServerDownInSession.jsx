import { api, checkIfServerUp } from '../../utils/backend_configuration/BackendConfig'

function CheckIfRecoveredFromServerDownInSession (props) {
  api.post(checkIfServerUp, {
  }, {
    withCredentials: true
  }
  ).then(response => {
    if (response.data.operation_success) {
      props.serverUnavailableStatusGrabber(false)
    }
  }
  )
}

export default CheckIfRecoveredFromServerDownInSession
