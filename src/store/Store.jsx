import { configureStore } from '@reduxjs/toolkit'
import userSessionReducer from './Slices/UserSessionSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import { combineReducers } from 'redux'
import AccountDataReducer from './Slices/AccountDataSlice'
import StripeCustomerIdReducer from './Slices/StripeCustomerIdSlice'
import StripeSubscriptionReducer from './Slices/StripeSubscriptionSlice'
import ValidSubscriptionReducer from './Slices/ValidSubscriptionSlice'
import AmendPaymentReducer from './Slices/AmendPaymentSlice'
import SetupIntentReducer from './Slices/SetupIntentSlice'
import PasswordResetAccountReducer from './Slices/PasswordResetAccountSlice'
import SubscriptionStoredReducer from './Slices/SubscriptionStoredSlice'
import AnonSessionReducer from './Slices/AnonSessionSlice'
import CreditReducer from './Slices/CreditSlice'
import SearchTimeoutReducer from './Slices/SearchTimeoutSlice'
import ProgressionTimeoutReducer from './Slices/ProgressionTimeoutSlice'
import videoAdHocSmartRetrievalReducer from './Slices/VideoAdHocSmartRetrievalSlice'
import SessionLogoutReducer from './Slices/SessionLogoutSlice'
import AttemptingRecoveryFromServerDownReducer from './Slices/AttemptingRecoveryFromServerDownSlice'

const rootReducer = combineReducers({
  userSession: userSessionReducer,
  accountData: AccountDataReducer,
  stripeCustomerId: StripeCustomerIdReducer,
  stripeSubscription: StripeSubscriptionReducer,
  validSubscription: ValidSubscriptionReducer,
  amendPaymentState: AmendPaymentReducer,
  setupIntentState: SetupIntentReducer,
  passwordResetAccountState: PasswordResetAccountReducer,
  subscriptionStoredState: SubscriptionStoredReducer,
  anonSession: AnonSessionReducer,
  creditData: CreditReducer,
  searchTimeoutState: SearchTimeoutReducer,
  progressionTimeoutState: ProgressionTimeoutReducer,
  videoAdHocSmartRetrieval: videoAdHocSmartRetrievalReducer,
  sessionLogoutState: SessionLogoutReducer,
  attemptingRecoveryFromServerDown: AttemptingRecoveryFromServerDownReducer
})

export const persistConfig = {
  key: 'root',
  storage,
  whiteList: [
    'userSession',
    'accountData',
    'stripeCustomerId',
    'stripeSubscription',
    'validSubscription',
    'amendPaymentState',
    'setupIntentState',
    'passwordResetAccountState',
    'subscriptionStoredState',
    'anonSession',
    'creditData',
    'searchTimeoutState',
    'progressionTimeoutState',
    'videoAdHocSmartRetrieval',
    'sessionLogoutState',
    'attemptingRecoveryFromServerDown'
  ]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  // devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)
