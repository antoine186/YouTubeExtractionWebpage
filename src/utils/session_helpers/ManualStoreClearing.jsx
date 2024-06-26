import { clearAccountData } from '../../store/Slices/AccountDataSlice'
import { clearAmendPayment } from '../../store/Slices/AmendPaymentSlice'
import { clearSetupIntentState } from '../../store/Slices/SetupIntentSlice'
import { clearStripeCustomerId } from '../../store/Slices/StripeCustomerIdSlice'
import { clearstripeSubscription } from '../../store/Slices/StripeSubscriptionSlice'
import { invalidateUserSession } from '../../store/Slices/UserSessionSlice'
import { clearValidSubscription } from '../../store/Slices/ValidSubscriptionSlice'
import Cookies from 'js-cookie'
import { api, removeSession } from '../backend_configuration/BackendConfig'

import { connect } from 'react-redux'
import ClearEntireStore from './ClearEntireStore'

function ManualStoreClearing (props) {
  console.log('Clearing entire store')

  Cookies.remove('user_session_cookie')
  Cookies.remove('__stripe_sid')
  Cookies.remove('__stripe_mid')

  api.post(removeSession, {
    username: props.accountData.accountData.payload.emailAddress
  }, {
    withCredentials: true
  }
  )

  ClearEntireStore()
  console.log('Tried dispatch')
  props.clearAccountData()
  props.clearAmendPayment()
  props.clearSetupIntentState()
  props.clearStripeCustomerId()
  props.clearstripeSubscription()
  props.invalidateUserSession()
  props.clearValidSubscription()
  console.log('Dispatch worked')
}

const mapStateToProps = state => {
  return {
    accountData: state.accountData
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearAccountData: () => dispatch(clearAccountData()),
    clearAmendPayment: () => dispatch(clearAmendPayment()),
    clearSetupIntentState: () => dispatch(clearSetupIntentState()),
    clearStripeCustomerId: () => dispatch(clearStripeCustomerId()),
    clearstripeSubscription: () => dispatch(clearstripeSubscription()),
    invalidateUserSession: () => dispatch(invalidateUserSession()),
    clearValidSubscription: () => dispatch(clearValidSubscription())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManualStoreClearing)
