import { api, deleteAccount } from "../backend_configuration/BackendConfig"

function CleanupBasicAccountWithoutCleaningupStripeAccount (props) {
  api.post(deleteAccount, {
    emailAddress: props.emailAddress
  }, {
    withCredentials: true
  }
  )
}

export default CleanupBasicAccountWithoutCleaningupStripeAccount
