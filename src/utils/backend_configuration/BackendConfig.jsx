import axios from 'axios'
import { debugSwitchedOn, backendUrlProd, backendUrlDebug } from '../debug_switch/DebugSwitch'

let intermediaryBool

if (debugSwitchedOn) {
  intermediaryBool = true
} else {
  intermediaryBool = false
}

export const localTestingUrl = intermediaryBool

let intermediaryUrl
if (localTestingUrl) {
  intermediaryUrl = backendUrlDebug
} else {
  intermediaryUrl = backendUrlProd
}

export const backendUrl = intermediaryUrl
export const loginAuthUrl = '/auth-login'
export const sessionAuthUrl = '/session-validate'
export const searchUrl = '/search'
export const basicAccountCreateUrl = '/basic-account-create'
export const stripeCustomerCreate = '/stripe-customer-create'
export const subscriptionCreate = '/subscription_create'
export const getSubscriptionStatus = '/get-subscription-status'
export const getSubscriptionId = '/get_subscription_id'
export const storeNewSubscription = '/store_new_subscription'
export const updateSubscriptionStatus = '/update_subscription_status'
export const deleteAccount = '/delete_account'
export const retrieveSubscriptionDetails = '/retrieve_subscription_details'
export const retrieveAccountData = '/retrieve_account_data'
export const setupintentCreation = '/setupintent_creation'
export const getStripeCustomerId = '/get_stripe_customer_id'
export const deleteSubscription = '/delete_subscription'
export const forgotPassword = '/forgot_password'
export const passwordReset = '/password_reset'
export const getPreviousSearchResult = '/get-previous-search-result'
export const taggingSearch = './tagging-search'
export const getTaggingInputs = './get-tagging-inputs'
export const saveTaggingInputs = './save-tagging-inputs'
export const updateTaggingInputs = './update-tagging-inputs'
export const getPreviousTaggingResult = './get-previous-tagging-result'
export const deleteTag = './delete-tag'
export const deleteTaggingInputs = './delete-tagging-inputs'
export const progressionCharting = './progression-charting'
export const getPreviousCharting = './get-previous-charting'
export const linkingTopics = './linking-topics'
export const getPreviousLinking = './get-previous-linking'
export const createCheckout = './create_checkout'
export const checkStillSearching = './check_still_searching'
export const checkStillCharting = './check_still_charting'
export const checkStillAnalysingChannel = './checkStillAnalysingChannel'
export const getPreviousChannelResult = './getPreviousChannelResult'
export const channelUrl = './channelUrl'
export const youtubeRetrieveChannelResults = './youtube-retrieve-channel-results'
export const commentsLlmQuestioning = './comments-llm-questioning'
export const commentsLlmEmoElaboration = './comments-llm-emo-elaboration'
export const youtubeVideoAdhocAnalyse = './youtube-video-adhoc-analyse'
export const youtubeRetrieveVideoAdhocResults = './youtube-retrieve-video-adhoc-results'
export const removeSession = './remove-session'
export const checkIfServerUp = './check-if-server-up'
export const sessionConfigurationData = './session_configuration_data'

export const api = axios.create({
  baseURL: backendUrl
})
